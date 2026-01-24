import { existsSync } from 'fs';
import { readdir } from 'fs/promises';
import { homedir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { resolveAgentTarget, loadAgents } from './agent-config.js';
import { createLink, isLink, pathExists } from './links.js';
import { getRepoSkills } from './repo.js';
import {
  adoptSkill,
  bootstrapSkills,
  listSkills,
  pruneSkills,
  syncSkills
} from './ops.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class SkillsManager {
  constructor(agentName, options = {}) {
    this.agentName = agentName;
    this.repoRoot = options.repoRoot || resolve(__dirname, '../..');
    this.targetDir = options.targetDir || join(homedir(), `.${agentName}`, 'skills');
    this.repoSkillsDir = join(this.repoRoot, 'skills');
  }

  static async fromConfig(agentName, options = {}) {
    const repoRoot = options.repoRoot || resolve(__dirname, '../..');
    const targetDir = await resolveAgentTarget(repoRoot, agentName, options.targetDir);

    return new SkillsManager(agentName, {
      ...options,
      repoRoot,
      targetDir
    });
  }

  static async listAgents(options = {}) {
    const repoRoot = options.repoRoot || resolve(__dirname, '../..');
    return loadAgents(repoRoot);
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
    return isLink(path);
  }

  pathExists(path) {
    return pathExists(path);
  }

  async createLink(target, linkPath) {
    await createLink(target, linkPath);
  }

  async getRepoSkills() {
    return getRepoSkills(this.repoSkillsDir);
  }

  async listTargetItems() {
    if (!existsSync(this.targetDir)) {
      return [];
    }
    return readdir(this.targetDir, { withFileTypes: true });
  }

  async sync(options = {}) {
    await syncSkills(this, options);
  }

  async bootstrap() {
    await bootstrapSkills(this);
  }

  async adopt(skillName, options = {}) {
    await adoptSkill(this, skillName, options);
  }

  async prune(validSkills = null) {
    await pruneSkills(this, validSkills);
  }

  async list() {
    await listSkills(this);
  }
}
