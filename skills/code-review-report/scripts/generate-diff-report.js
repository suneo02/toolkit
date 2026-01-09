#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
    base: 'main',
    head: 'HEAD',
    out: '',
    repo: process.cwd(),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === '--base') {
      args.base = value;
      i += 1;
      continue;
    }
    if (key === '--head') {
      args.head = value;
      i += 1;
      continue;
    }
    if (key === '--out') {
      args.out = value;
      i += 1;
      continue;
    }
    if (key === '--repo') {
      args.repo = value;
      i += 1;
      continue;
    }
    if (key === '--help' || key === '-h') {
      args.help = true;
    }
  }

  return args;
}

function runGit(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();
}

function formatNameStatus(nameStatus) {
  if (!nameStatus) {
    return [];
  }
  return nameStatus
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('\t');
      const status = parts[0] || '';
      if (status.startsWith('R') && parts.length >= 3) {
        return { status, path: `${parts[1]} -> ${parts[2]}` };
      }
      return { status, path: parts[1] || '' };
    });
}

function usage() {
  return [
    'Usage: generate-diff-report.js [--base <ref>] [--head <ref>] [--repo <path>] [--out <file>]',
    'Defaults: --base main --head HEAD --repo CWD',
  ].join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    process.exit(0);
  }

  const repo = path.resolve(args.repo);
  const range = `${args.base}..${args.head}`;

  let baseSha = '';
  let headSha = '';
  let diffStat = '';
  let nameStatus = '';

  try {
    baseSha = runGit(repo, ['rev-parse', args.base]);
    headSha = runGit(repo, ['rev-parse', args.head]);
    diffStat = runGit(repo, ['diff', '--stat', range]);
    nameStatus = runGit(repo, ['diff', '--name-status', range]);
  } catch (error) {
    console.error('Failed to run git commands.');
    console.error(error.message || error);
    process.exit(1);
  }

  const files = formatNameStatus(nameStatus);
  const lines = [];
  const now = new Date().toISOString();

  lines.push('# Diff Report');
  lines.push('');
  lines.push(`- Base: ${args.base} (${baseSha})`);
  lines.push(`- Head: ${args.head} (${headSha})`);
  lines.push(`- Range: ${range}`);
  lines.push(`- Files changed: ${files.length}`);
  lines.push(`- Generated at: ${now}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('```');
  lines.push(diffStat || 'No changes.');
  lines.push('```');
  lines.push('');
  lines.push('## Files');
  lines.push('');
  lines.push('| Status | Path |');
  lines.push('| --- | --- |');
  if (files.length === 0) {
    lines.push('| - | - |');
  } else {
    for (const file of files) {
      lines.push(`| ${file.status} | ${file.path} |`);
    }
  }
  lines.push('');

  const output = lines.join('\n');
  if (args.out) {
    fs.writeFileSync(path.resolve(args.out), output, 'utf8');
  } else {
    process.stdout.write(output);
  }
}

main();
