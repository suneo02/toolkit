import { resolve } from 'path';
import {
  loadConfig,
  normalizeAgentConfig,
  resolveConfigPath,
  resolveUserPath
} from './config.js';

export async function loadAgents(repoRoot) {
  const configPath = resolveConfigPath(repoRoot);
  const config = await loadConfig(configPath);
  return (config.agents || [])
    .map(normalizeAgentConfig)
    .filter(Boolean);
}

export async function resolveAgentTarget(repoRoot, agentName, targetDirOverride) {
  const agents = await loadAgents(repoRoot);
  const agentConfig = agents.find(agent => agent.name === agentName);
  return targetDirOverride || agentConfig?.targetDir || resolveUserPath(`~/.${agentName}/skills`);
}

export function resolveRepoRoot(fallback) {
  return resolve(fallback);
}
