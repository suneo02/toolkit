import { exec } from 'child_process';
import { existsSync, lstatSync } from 'fs';
import { mkdir, readdir, rename, rm, symlink } from 'fs/promises';
import { homedir, platform } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { SKILL_GROUPS } from './constants.js';
import {
  loadConfig,
  normalizeAgentConfig,
  resolveConfigPath,
  resolveUserPath
} from './config.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isWindows = platform() === 'win32';

export class SkillsManager {
  constructor(agentName, options = {}) {
    this.agentName = agentName;
    this.repoRoot = options.repoRoot || resolve(__dirname, '../..');
    this.targetDir = options.targetDir || join(homedir(), `.${agentName}`, 'skills');
    this.repoSkillsDir = join(this.repoRoot, 'skills');
  }

  static async fromConfig(agentName, options = {}) {
    const repoRoot = options.repoRoot || resolve(__dirname, '../..');
    const configPath = resolveConfigPath(repoRoot);
    const config = await loadConfig(configPath);
    const configAgents = (config.agents || [])
      .map(normalizeAgentConfig)
      .filter(Boolean);
    const agentConfig = configAgents.find(agent => agent.name === agentName);

    const targetDir = options.targetDir || agentConfig?.targetDir || resolveUserPath(`~/.${agentName}/skills`);

    return new SkillsManager(agentName, {
      ...options,
      repoRoot,
      targetDir
    });
  }

  static async listAgents(options = {}) {
    const repoRoot = options.repoRoot || resolve(__dirname, '../..');
    const configPath = resolveConfigPath(repoRoot);
    const config = await loadConfig(configPath);
    const configAgents = (config.agents || [])
      .map(normalizeAgentConfig)
      .filter(Boolean);

    return configAgents;
  }

  static logMessage(message, level = 'info') {
    const prefix = {
      info: '→',
      success: '✓',
      error: '✗',
      warn: '⚠'
    }[level] || '•';
    console.log(`${prefix} ${message}`);
  }

  log(message, level = 'info') {
    SkillsManager.logMessage(message, level);
  }

  async isLink(path) {
    try {
      const stats = lstatSync(path);
      return stats.isSymbolicLink();
    } catch {
      return false;
    }
  }

  pathExists(path) {
    try {
      lstatSync(path);
      return true;
    } catch {
      return false;
    }
  }

  async createLink(target, linkPath) {
    if (isWindows) {
      await symlink(target, linkPath, 'junction');
    } else {
      await symlink(target, linkPath, 'dir');
    }
  }

  async getRepoSkills() {
    if (!existsSync(this.repoSkillsDir)) {
      throw new Error(`Repo skills directory not found: ${this.repoSkillsDir}`);
    }

    const items = await readdir(this.repoSkillsDir, { withFileTypes: true });
    const skills = [];
    for (const item of items) {
      if (!item.isDirectory() || item.name.startsWith('.')) {
        continue;
      }
      const groupPath = join(this.repoSkillsDir, item.name);
      if (SKILL_GROUPS.includes(item.name)) {
        const groupItems = await readdir(groupPath, { withFileTypes: true });
        for (const groupItem of groupItems) {
          if (!groupItem.isDirectory() || groupItem.name.startsWith('.')) {
            continue;
          }
          skills.push({
            name: groupItem.name,
            path: join(groupPath, groupItem.name)
          });
        }
        continue;
      }
      skills.push({
        name: item.name,
        path: groupPath
      });
    }
    return skills;
  }

  async sync(options = {}) {
    this.log(`Syncing ${this.agentName} skills...`);
    this.log(`Repo: ${this.repoRoot}`);
    this.log(`Target: ${this.targetDir}`);

    await mkdir(this.targetDir, { recursive: true });

    if (!options.noPull) {
      try {
        await execAsync('git pull', { cwd: this.repoRoot });
        this.log('Git pull completed', 'success');
      } catch {
        this.log('Git pull skipped (not a git repo or git not found)', 'warn');
      }
    }

    const skills = await this.getRepoSkills();

    for (const skill of skills) {
      const linkPath = join(this.targetDir, skill.name);

      if (this.pathExists(linkPath)) {
        const isLink = await this.isLink(linkPath);
        if (isLink) {
          if (!existsSync(linkPath)) {
            await rm(linkPath, { recursive: true, force: true });
            this.log(`Removed: ${skill.name} (broken link)`, 'warn');
          } else {
            this.log(`Skip: ${skill.name} (already linked)`, 'info');
            continue;
          }
        } else {
          this.log(`Skip: ${skill.name} (real directory exists)`, 'warn');
          continue;
        }
      }

      await this.createLink(skill.path, linkPath);
      this.log(`Linked: ${skill.name}`, 'success');
    }

    if (options.prune) {
      await this.prune(skills.map(s => s.name));
    }

    this.log('Sync completed!', 'success');
  }

  async bootstrap() {
    this.log(`Bootstrapping ${this.agentName} skills...`);
    this.log(`Repo: ${this.repoRoot}`);
    this.log(`Target: ${this.targetDir}`);

    await mkdir(this.targetDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] +
                      '-' + new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '');
    const backupDir = `${this.targetDir}.backup-${timestamp}`;
    await mkdir(backupDir, { recursive: true });

    const skills = await this.getRepoSkills();

    for (const skill of skills) {
      const targetPath = join(this.targetDir, skill.name);
      if (this.pathExists(targetPath)) {
        const backupPath = join(backupDir, skill.name);
        this.log(`Backing up: ${skill.name}`, 'warn');
        await rename(targetPath, backupPath);
      }
    }

    for (const skill of skills) {
      const linkPath = join(this.targetDir, skill.name);
      await this.createLink(skill.path, linkPath);
      this.log(`Linked: ${skill.name}`, 'success');
    }

    this.log(`Backup saved to: ${backupDir}`, 'info');
    this.log('Bootstrap completed!', 'success');
  }

  async adopt(skillName, options = {}) {
    if (!skillName) {
      throw new Error('Skill name is required');
    }

    const group = options.group || 'general';
    if (!SKILL_GROUPS.includes(group)) {
      throw new Error(`Invalid group: ${group}. Use ${SKILL_GROUPS.join(', ')}`);
    }

    this.log(`Adopting skill: ${skillName}`);

    const sourcePath = join(this.targetDir, skillName);
    const groupPath = join(this.repoSkillsDir, group);
    const repoPath = join(groupPath, skillName);

    if (!existsSync(sourcePath)) {
      throw new Error(`Skill not found: ${sourcePath}`);
    }

    if (await this.isLink(sourcePath)) {
      this.log(`Already a link: ${skillName}`, 'warn');
      return;
    }

    if (existsSync(repoPath)) {
      throw new Error(`Skill already exists in repo: ${repoPath}`);
    }

    this.log(`Moving to repo: ${skillName}`, 'info');
    await mkdir(groupPath, { recursive: true });
    await rename(sourcePath, repoPath);

    await this.createLink(repoPath, sourcePath);
    this.log(`Linked back: ${skillName}`, 'success');

    this.log('Adopt completed!', 'success');
    this.log('Remember to commit and push to Git!', 'warn');
  }

  async prune(validSkills = null) {
    this.log('Pruning old links...');

    if (!validSkills) {
      const skills = await this.getRepoSkills();
      validSkills = skills.map(s => s.name);
    }

    const items = await readdir(this.targetDir, { withFileTypes: true });

    for (const item of items) {
      if (item.name === '.system') {
        continue;
      }

      if (validSkills.includes(item.name)) {
        continue;
      }

      const fullPath = join(this.targetDir, item.name);
      const isLink = await this.isLink(fullPath);

      if (isLink) {
        await rm(fullPath, { recursive: true, force: true });
        this.log(`Removed: ${item.name} (not in repo)`, 'warn');
      } else {
        this.log(`Skip: ${item.name} (real directory)`, 'info');
      }
    }

    this.log('Prune completed!', 'success');
  }

  async list() {
    this.log(`Skills for ${this.agentName}:\n`);

    const skills = await this.getRepoSkills();
    for (const skill of skills) {
      const linkPath = join(this.targetDir, skill.name);
      let status = '○ Not linked';

      if (existsSync(linkPath)) {
        if (await this.isLink(linkPath)) {
          status = '● Linked';
        } else {
          status = '⚠ Real directory';
        }
      }

      console.log(`  ${status}  ${skill.name}`);
    }

    console.log('');
  }
}
