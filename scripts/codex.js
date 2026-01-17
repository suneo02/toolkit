#!/usr/bin/env node

import { SkillsManager } from './skills-manager.js';

const AGENT_NAME = 'codex';

const args = process.argv.slice(2);
const command = args[0] || 'help';

const manager = new SkillsManager(AGENT_NAME, {
  repoRoot: args.find(arg => arg.startsWith('--repo='))?.replace('--repo=', ''),
  targetDir: args.find(arg => arg.startsWith('--target='))?.replace('--target=', '')
});

const options = {
  noPull: args.includes('--no-pull'),
  prune: args.includes('--prune')
};

async function main() {
  try {
    switch (command) {
      case 'sync':
        await manager.sync(options);
        break;

      case 'bootstrap':
        await manager.bootstrap(options);
        break;

      case 'adopt':
        const skillName = args[1];
        if (!skillName) {
          console.error('Error: Skill name required');
          console.log('Usage: node scripts/codex.js adopt <skill-name>');
          process.exit(1);
        }
        await manager.adopt(skillName);
        break;

      case 'prune':
        await manager.prune();
        break;

      case 'list':
        await manager.list();
        break;

      case 'help':
      default:
        console.log(`
Codex Skills Manager - Cross-platform skills management

Usage:
  node scripts/codex.js <command> [options]

Commands:
  sync              Create/update skill links (daily use)
  bootstrap         Initialize with backup (first time)
  adopt <name>      Move local skill to repo and link back
  prune             Remove links not in repo
  list              Show all skills and their status
  help              Show this help message

Options:
  --repo=<path>     Specify repository root
  --target=<path>   Specify target directory
  --no-pull         Skip git pull
  --prune           Remove old links during sync

Examples:
  node scripts/codex.js sync
  node scripts/codex.js bootstrap
  node scripts/codex.js adopt my-skill
  node scripts/codex.js sync --prune
  node scripts/codex.js list
`);
        break;
    }
  } catch (error) {
    console.error(`\n✗ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
