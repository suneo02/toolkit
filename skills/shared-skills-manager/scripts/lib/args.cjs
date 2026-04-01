const path = require('path');
const { expandHome } = require('./fs-utils.cjs');

function parseArgs(argv) {
  const args = {
    agents: [],
    src: null,
    local: false,
    skillNames: [],
    cleanBroken: true,
    force: false,
    dryRun: false,
    relative: false
  };

  for (const raw of argv) {
    if (raw === '--force') args.force = true;
    else if (raw === '--dry-run') args.dryRun = true;
    else if (raw === '--clean-broken') args.cleanBroken = true;
    else if (raw === '--no-clean-broken') args.cleanBroken = false;
    else if (raw === '--relative') args.relative = true;
    else if (raw === '--local') args.local = true;
    else if (raw.startsWith('--agent=')) {
      args.agents.push(...raw.slice('--agent='.length).split(','));
    }
    else if (raw.startsWith('--src=')) {
      args.src = path.resolve(expandHome(raw.slice('--src='.length)));
    }
    else if (raw.startsWith('--skill=')) args.skillNames.push(raw.slice('--skill='.length));
    else if (raw.startsWith('--skills=')) args.skillNames.push(...raw.slice('--skills='.length).split(','));
    else if (raw === 'help' || raw === '--help') args.help = true;
  }

  args.agents = args.agents
    .map(name => String(name || '').trim())
    .filter(Boolean);

  args.skillNames = args.skillNames
    .map(name => String(name || '').trim())
    .filter(Boolean);

  return args;
}

function usage() {
  console.log(`
Agent Skills Union Linker

Usage:
  node scripts/union-link.cjs --agent=<name1,name2|all> --src=<path> [options]

Required:
  --agent=<name>          Agent name(s) (e.g. codex, claude-code, gemini-cli, or 'all')
  --src=<path>            Skills source directory to include

Options:
  --local                 Link to project-local skills dir instead of global
  --skill=<name>          Only link one skill by name (repeatable)
  --skills=<a,b,c>        Only link specific skill names (comma-separated)
  --clean-broken          Remove broken symlinks in target dir (default: true)
  --no-clean-broken       Disable automatic broken link removal
  --force                 Replace existing links pointing elsewhere
  --dry-run               Print planned actions without changing filesystem
`);
}

module.exports = {
  parseArgs,
  usage
};
