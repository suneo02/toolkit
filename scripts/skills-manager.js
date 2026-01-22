#!/usr/bin/env node

import { exec } from 'child_process';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { mkdir, readdir, readFile, rename, rm, symlink } from 'fs/promises';
import { homedir, platform } from 'os';
import { dirname, isAbsolute, join, resolve, relative, sep } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { createInterface } from 'readline';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWindows = platform() === 'win32';

const CONFIG_FILENAME = 'skills-manager.config.json';

function resolveUserPath(value) {
  if (!value) {
    return null;
  }

  if (value === '~') {
    return homedir();
  }

  if (value.startsWith('~/') || value.startsWith('~\\')) {
    return join(homedir(), value.slice(2));
  }

  if (isAbsolute(value)) {
    return value;
  }

  return resolve(value);
}

function resolveTargetDir(targetDir) {
  if (!targetDir) {
    return null;
  }

  if (typeof targetDir === 'string') {
    return resolveUserPath(targetDir);
  }

  if (typeof targetDir === 'object') {
    const platformTarget = targetDir[platform()] || targetDir.default;
    return resolveUserPath(platformTarget);
  }

  return null;
}

function normalizeAgentConfig(agentConfig) {
  if (!agentConfig || !agentConfig.name) {
    return null;
  }

  const name = String(agentConfig.name).trim();
  if (!name) {
    return null;
  }

  const targetDir = resolveTargetDir(agentConfig.targetDir) || resolveUserPath(`~/.${name}/skills`);
  return { name, targetDir };
}

async function loadConfig(configPath) {
  try {
    const raw = await readFile(configPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { agents: [] };
    }
    throw error;
  }
}

/**
 * Infer skill name from current working directory.
 * Returns skill name if cwd is within targetDir, null otherwise.
 */
function inferSkillName(targetDir) {
  const cwd = process.cwd();
  const rel = relative(targetDir, cwd);

  if (rel.startsWith('..') || isAbsolute(rel)) {
    return null;
  }

  const segments = rel.split(sep);
  if (segments.length > 0 && segments[0] !== '.') {
    return segments[0];
  }

  return null;
}

/**
 * Get local skill candidates from target directory.
 * Returns real directories (not symlinks) that are not .system.
 */
async function getLocalSkillCandidates(targetDir) {
  if (!existsSync(targetDir)) {
    return [];
  }

  const items = await readdir(targetDir, { withFileTypes: true });
  const candidates = [];

  for (const item of items) {
    if (item.name === '.system') {
      continue;
    }

    if (!item.isDirectory()) {
      continue;
    }

    const fullPath = join(targetDir, item.name);
    const isLink = lstatSync(fullPath).isSymbolicLink();
    if (!isLink) {
      candidates.push(item.name);
    }
  }

  return candidates;
}

/**
 * Interactive selection using readline.
 * Prompts user to select a skill from candidates.
 */
function interactiveSelect(candidates) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error('Non-interactive environment: please provide skill name explicitly'));
      return;
    }

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\nFound multiple local skills:');
    candidates.forEach((name, index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const prompt = () => {
      rl.question('\nSelect a skill (enter number or name): ', (input) => {
        const trimmed = input.trim();
        const index = parseInt(trimmed, 10);

        if (!isNaN(index) && index >= 1 && index <= candidates.length) {
          rl.close();
          resolve(candidates[index - 1]);
          return;
        }

        if (candidates.includes(trimmed)) {
          rl.close();
          resolve(trimmed);
          return;
        }

        console.log('Invalid selection. Please try again.');
        prompt();
      });
    };

    prompt();
  });
}

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

  static async fromConfig(agentName, options = {}) {
    const repoRoot = options.repoRoot || resolve(__dirname, '..');
    const configPath = resolve(repoRoot, CONFIG_FILENAME);
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
    const repoRoot = options.repoRoot || resolve(__dirname, '..');
    const configPath = resolve(repoRoot, CONFIG_FILENAME);
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
   * Check if a path exists (including broken symlinks)
   */
  pathExists(path) {
    try {
      lstatSync(path);
      return true;
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
      if (this.pathExists(targetPath)) {
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

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);
  
  // If no arguments or help requested
  if (args.length === 0 || args.includes('help') || args.includes('--help')) {
    const agents = await SkillsManager.listAgents({
      repoRoot: args.find(arg => arg.startsWith('--repo='))?.replace('--repo=', '')
    });
    const agentList = agents.length > 0
      ? agents.map(agent => `  ${agent.name.padEnd(16, ' ')}Manage ${agent.name} skills (${agent.targetDir})`).join('\n')
      : '  (No agents configured)';

    console.log(`
Skills Manager - Cross-platform agent skills management

Usage:
  node scripts/skills-manager.js <agent> <command> [options]

Agents:
${agentList}
  all              Sync skills for all agents

Commands:
  sync              Create/update skill links (daily use)
  bootstrap         Initialize with backup (first time)
  adopt [name]      Move local skill to repo and link back (auto-detects name if not provided)
  prune             Remove links not in repo
  list              Show all skills and their status
  help              Show this help message

Options:
  --repo=<path>     Specify repository root
  --target=<path>   Specify target directory
  --no-pull         Skip git pull
  --prune           Remove old links during sync

Examples:
  node scripts/skills-manager.js codex sync
  node scripts/skills-manager.js gemini bootstrap
  node scripts/skills-manager.js codex adopt my-skill
  node scripts/skills-manager.js claude list
  node scripts/skills-manager.js all sync
`);
    return;
  }

  const agentName = args[0];
  const command = args[1] || 'help';

  if (command !== 'sync' && agentName === 'all') {
    console.error('✗ Error: The "all" agent only supports the sync command.');
    process.exit(1);
  }

  const repoRoot = args.find(arg => arg.startsWith('--repo='))?.replace('--repo=', '');
  const targetDir = args.find(arg => arg.startsWith('--target='))?.replace('--target=', '');
  const options = {
    noPull: args.includes('--no-pull'),
    prune: args.includes('--prune')
  };

  const agents = await SkillsManager.listAgents({ repoRoot });
  const agentNames = agents.map(agent => agent.name);
  const isAllAgents = agentName === 'all';

  if (!isAllAgents && !agentNames.includes(agentName)) {
    const availableAgents = agentNames.length > 0 ? agentNames.join(', ') : 'none';
    console.error(`✗ Error: Invalid agent name "${agentName}". Available: ${availableAgents}`);
    process.exit(1);
  }

  try {
    if (isAllAgents) {
      for (const agent of agents) {
        const manager = await SkillsManager.fromConfig(agent.name, {
          repoRoot,
          targetDir: agent.targetDir
        });
        await manager.sync(options);
      }
      return;
    }

    const manager = await SkillsManager.fromConfig(agentName, {
      repoRoot,
      targetDir
    });

    switch (command) {
      case 'sync':
        await manager.sync(options);
        break;

      case 'bootstrap':
        await manager.bootstrap(options);
        break;

      case 'adopt':
        let skillName = args[2];

        if (!skillName) {
          console.log('No skill name provided, attempting auto-detection...\n');

          skillName = inferSkillName(manager.targetDir);
          if (skillName) {
            console.log(`→ Using inferred skill name: "${skillName}"`);
          } else {
            const candidates = await getLocalSkillCandidates(manager.targetDir);
            if (candidates.length === 0) {
              console.error('✗ Error: No local skills found in target directory');
              console.error(`Target: ${manager.targetDir}`);
              console.error(`\nUsage: node scripts/skills-manager.js ${agentName} adopt <skill-name>`);
              process.exit(1);
            } else if (candidates.length === 1) {
              skillName = candidates[0];
              console.log(`→ Only one local skill found: "${skillName}"`);
            } else {
              try {
                skillName = await interactiveSelect(candidates);
                console.log(`→ Selected skill: "${skillName}"`);
              } catch (error) {
                console.error(`\n✗ Error: ${error.message}`);
                console.error(`\nUsage: node scripts/skills-manager.js ${agentName} adopt <skill-name>`);
                process.exit(1);
              }
            }
          }
        }
        await manager.adopt(skillName);
        break;

      case 'prune':
        await manager.prune();
        break;

      case 'list':
        await manager.list();
        break;

      default:
        console.error(`✗ Error: Unknown command "${command}"`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n✗ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
