const os = require('os');
const { join } = require('path');
const { existsSync } = require('fs');

const home = os.homedir();
const configHome = process.env.XDG_CONFIG_HOME || join(home, '.config');
const codexHome = process.env.CODEX_HOME?.trim() || join(home, '.codex');
const claudeHome = process.env.CLAUDE_CONFIG_DIR?.trim() || join(home, '.claude');

const agents = {
  antigravity: {
    name: 'antigravity',
    displayName: 'Antigravity',
    globalSkillsDir: join(home, '.gemini/antigravity/skills'),
    localSkillsDir: '.agent/skills',
    detectInstalled: async () => existsSync(join(home, '.gemini/antigravity')),
  },
  'claude-code': {
    name: 'claude-code',
    displayName: 'Claude Code',
    globalSkillsDir: join(claudeHome, 'skills'),
    localSkillsDir: '.claude/skills',
    detectInstalled: async () => existsSync(claudeHome),
  },
  codex: {
    name: 'codex',
    displayName: 'Codex',
    globalSkillsDir: join(codexHome, 'skills'),
    localSkillsDir: '.agents/skills',
    detectInstalled: async () => existsSync(codexHome) || existsSync('/etc/codex'),
  },
  cursor: {
    name: 'cursor',
    displayName: 'Cursor',
    globalSkillsDir: join(home, '.cursor/skills'),
    localSkillsDir: '.agents/skills',
    detectInstalled: async () => existsSync(join(home, '.cursor')),
  },
  'gemini-cli': {
    name: 'gemini-cli',
    displayName: 'Gemini CLI',
    globalSkillsDir: join(home, '.gemini/skills'),
    localSkillsDir: '.agents/skills',
    detectInstalled: async () => existsSync(join(home, '.gemini')),
  }
};

async function detectInstalledAgents() {
  const results = await Promise.all(
    Object.keys(agents).map(async (type) => ({
      type,
      installed: await agents[type].detectInstalled(),
    }))
  );
  return results.filter((r) => r.installed).map((r) => r.type);
}

function getAgentConfig(type) {
  return agents[type];
}

module.exports = {
  agents,
  detectInstalledAgents,
  getAgentConfig
};
