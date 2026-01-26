import { readFile } from 'fs/promises';
import { homedir, platform } from 'os';
import { isAbsolute, join, resolve } from 'path';
import { CONFIG_FILENAME } from './constants.js';

export function resolveUserPath(value) {
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

export function resolveTargetDir(targetDir) {
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

export function normalizeAgentConfig(agentConfig) {
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

export async function loadConfig(configPath) {
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

export function resolveConfigPath(repoRoot) {
  return resolve(repoRoot, CONFIG_FILENAME);
}
