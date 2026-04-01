#!/usr/bin/env node

const path = require('path');
const { parseArgs, usage } = require('./lib/args.cjs');
const { ensureDir, resolveReal } = require('./lib/fs-utils.cjs');
const { collectFromSource } = require('./lib/scanner.cjs');
const { prune, sync } = require('./lib/sync-engine.cjs');
const { getAgentConfig, detectInstalledAgents } = require('./lib/agents.cjs');

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || process.argv.length <= 2) {
    usage();
    return;
  }

  if (args.agents.length === 0) {
    console.error('✗ Missing --agent');
    process.exit(1);
  }
  if (!args.src) {
    console.error('✗ Missing --src');
    process.exit(1);
  }

  let targetAgents = args.agents;
  if (targetAgents.includes('all')) {
    const installed = await detectInstalledAgents();
    if (installed.length === 0) {
      console.error('✗ No agents detected with --agent=all');
      process.exit(1);
    }
    targetAgents = installed;
  }

  try {
    // 1. Scan source
    const skillEntries = collectFromSource(args.src, args.skillNames);

    if (args.skillNames.length > 0) {
      const foundNames = new Set(Object.keys(skillEntries));
      const missing = args.skillNames.filter(name => !foundNames.has(name));
      if (missing.length > 0) {
        throw new Error(`Selected skill(s) not found in source: ${missing.join(', ')}\nSource: ${args.src}`);
      }
    }

    if (Object.keys(skillEntries).length === 0) {
      console.log('-> No skills found to link.');
      return;
    }

    // 2. Apply to each agent
    for (const agentName of targetAgents) {
      const agentConfig = getAgentConfig(agentName);
      if (!agentConfig) {
        console.warn(`! Unsupported agent: ${agentName}, skipping...`);
        continue;
      }

      const targetDir = args.local
        ? path.resolve(process.cwd(), agentConfig.localSkillsDir)
        : agentConfig.globalSkillsDir;

      ensureDir(targetDir);

      // Prune (Clean broken links)
      if (args.cleanBroken) {
        const removed = prune(targetDir, args.dryRun);
        if (removed.length > 0) {
          console.log(`[${agentName}] -> Removed ${removed.length} broken links`);
        }
      }

      // Sync
      const stats = sync(targetDir, skillEntries, args.force, args.dryRun, args.relative);

      console.log(`✓ Union links updated for ${agentName} (${args.local ? 'local' : 'global'})`);
      console.log(`  -> Source: ${args.src}`);
      console.log(`  -> Target: ${targetDir}`);
      console.log(`  -> Skills: ${Object.keys(skillEntries).length} (linked: ${stats.linked}, updated: ${stats.updated}, skipped: ${stats.skipped})`);
    }

    if (args.dryRun) {
      console.log('\n-> Mode: DRY-RUN (no changes applied)');
    }
  } catch (error) {
    console.error(`\n✗ ${error.message}`);
    process.exit(1);
  }
}

main();
