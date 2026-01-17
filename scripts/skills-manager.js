#!/usr/bin/env node

import { exec } from 'child_process';
import { existsSync, lstatSync } from 'fs';
import { mkdir, readdir, rename, rm, symlink } from 'fs/promises';
import { homedir, platform } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWindows = platform() === 'win32';

/**
 * SkillsManager - Cross-platform agent skills management
 */
export class SkillsManager {
  constructor(agentName, options = {}) {
    this.agentName = agentName;
    this.repoRoot = options.repoRoot || resolve(__dirname, '..');
    this.targetDir = options.targetDir || join(homedir(), `.${agentName}`, 'skills');
    this.repoSkillsDir = join(this.repoRoot, 'skills');
  }

  log(message, level = 'info') {
    const prefix = {
      info: '→',
      success: '✓',
      error: '✗',
      warn: '⚠'
    }[level] || '•';
    console.log(`${prefix} ${message}`);
  }

  /**
   * Check if a path is a symlink or junction
   */
  async isLink(path) {
    try {
      const stats = lstatSync(path);
      return stats.isSymbolicLink();
    } catch {
      return false;
    }
  }

  /**
   * Create a symlink (Unix) or junction (Windows)
   */
  async createLink(target, linkPath) {
    if (isWindows) {
      // Windows: use junction
      await symlink(target, linkPath, 'junction');
    } else {
      // Unix: use symlink
      await symlink(target, linkPath, 'dir');
    }
  }

  /**
   * Get all skill directories from repo
   */
  async getRepoSkills() {
    if (!existsSync(this.repoSkillsDir)) {
      throw new Error(`Repo skills directory not found: ${this.repoSkillsDir}`);
    }

    const items = await readdir(this.repoSkillsDir, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory() && !item.name.startsWith('.'))
      .map(item => ({
        name: item.name,
        path: join(this.repoSkillsDir, item.name)
      }));
  }

  /**
   * Sync command - create/update links
   */
  async sync(options = {}) {
    this.log(`Syncing ${this.agentName} skills...`);
    this.log(`Repo: ${this.repoRoot}`);
    this.log(`Target: ${this.targetDir}`);

    // Ensure target directory exists
    await mkdir(this.targetDir, { recursive: true });

    // Git pull (optional)
    if (!options.noPull) {
      try {
        await execAsync('git pull', { cwd: this.repoRoot });
        this.log('Git pull completed', 'success');
      } catch (error) {
        this.log('Git pull skipped (not a git repo or git not found)', 'warn');
      }
    }

    // Get all skills from repo
    const skills = await this.getRepoSkills();

    // Create links for each skill
    for (const skill of skills) {
      const linkPath = join(this.targetDir, skill.name);

      if (existsSync(linkPath)) {
        const isLink = await this.isLink(linkPath);
        if (isLink) {
          this.log(`Skip: ${skill.name} (already linked)`, 'info');
        } else {
          this.log(`Skip: ${skill.name} (real directory exists)`, 'warn');
        }
        continue;
      }

      await this.createLink(skill.path, linkPath);
      this.log(`Linked: ${skill.name}`, 'success');
    }

    // Prune old links (optional)
    if (options.prune) {
      await this.prune(skills.map(s => s.name));
    }

    this.log('Sync completed!', 'success');
  }

  /**
   * Bootstrap command - backup existing and sync
   */
  async bootstrap(options = {}) {
    this.log(`Bootstrapping ${this.agentName} skills...`);
    this.log(`Repo: ${this.repoRoot}`);
    this.log(`Target: ${this.targetDir}`);

    // Ensure target directory exists
    await mkdir(this.targetDir, { recursive: true });

    // Create backup directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + 
                      '-' + new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '');
    const backupDir = `${this.targetDir}.backup-${timestamp}`;
    await mkdir(backupDir, { recursive: true });

    // Get all skills from repo
    const skills = await this.getRepoSkills();

    // Backup existing directories
    for (const skill of skills) {
      const targetPath = join(this.targetDir, skill.name);
      if (existsSync(targetPath)) {
        const backupPath = join(backupDir, skill.name);
        this.log(`Backing up: ${skill.name}`, 'warn');
        await rename(targetPath, backupPath);
      }
    }

    // Create links
    for (const skill of skills) {
      const linkPath = join(this.targetDir, skill.name);
      await this.createLink(skill.path, linkPath);
      this.log(`Linked: ${skill.name}`, 'success');
    }

    this.log(`Backup saved to: ${backupDir}`, 'info');
    this.log('Bootstrap completed!', 'success');
  }

  /**
   * Adopt command - move local skill to repo and link back
   */
  async adopt(skillName) {
    if (!skillName) {
      throw new Error('Skill name is required');
    }

    this.log(`Adopting skill: ${skillName}`);

    const sourcePath = join(this.targetDir, skillName);
    const repoPath = join(this.repoSkillsDir, skillName);

    // Check if source exists
    if (!existsSync(sourcePath)) {
      throw new Error(`Skill not found: ${sourcePath}`);
    }

    // Check if it's already a link
    if (await this.isLink(sourcePath)) {
      this.log(`Already a link: ${skillName}`, 'warn');
      return;
    }

    // Check if repo path already exists
    if (existsSync(repoPath)) {
      throw new Error(`Skill already exists in repo: ${repoPath}`);
    }

    // Move to repo
    this.log(`Moving to repo: ${skillName}`, 'info');
    await rename(sourcePath, repoPath);

    // Create link back
    await this.createLink(repoPath, sourcePath);
    this.log(`Linked back: ${skillName}`, 'success');

    this.log('Adopt completed!', 'success');
    this.log('Remember to commit and push to Git!', 'warn');
  }

  /**
   * Prune command - remove links not in repo
   */
  async prune(validSkills = null) {
    this.log('Pruning old links...');

    if (!validSkills) {
      const skills = await this.getRepoSkills();
      validSkills = skills.map(s => s.name);
    }

    const items = await readdir(this.targetDir, { withFileTypes: true });

    for (const item of items) {
      // Skip .system
      if (item.name === '.system') {
        continue;
      }

      // Skip if in valid list
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

  /**
   * List command - show all skills and their status
   */
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
