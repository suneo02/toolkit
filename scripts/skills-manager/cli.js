import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  SkillsManager,
  getLocalSkillCandidates,
  inferSkillName,
  interactiveSelect
} from './core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runCli() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('help') || args.includes('--help')) {
    const repoRoot = args.find(arg => arg.startsWith('--repo='))?.replace('--repo=', '')
      || resolve(__dirname, '../..');
    const agents = await SkillsManager.listAgents({ repoRoot });
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
  --group=<name>    Adopt target group (company, personal, general)
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

  const repoRoot = args.find(arg => arg.startsWith('--repo='))?.replace('--repo=', '')
    || resolve(__dirname, '../..');
  const targetDir = args.find(arg => arg.startsWith('--target='))?.replace('--target=', '');
  const groupArg = args.find(arg => arg.startsWith('--group='));
  const group = groupArg ? groupArg.replace('--group=', '') : null;
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

      case 'adopt': {
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
        await manager.adopt(skillName, { group });
        break;
      }

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
