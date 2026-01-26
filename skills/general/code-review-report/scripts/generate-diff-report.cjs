#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function parseArgs(argv) {
  const args = {
    base: 'main',
    head: 'HEAD',
    repo: process.cwd(),
    out: '',
    outDir: '',
    maxFileDiffLines: 0,
    context: 3,
    help: false,
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
    if (key === '--repo') {
      args.repo = value;
      i += 1;
      continue;
    }
    if (key === '--out') {
      args.out = value;
      i += 1;
      continue;
    }
    if (key === '--out-dir') {
      args.outDir = value;
      i += 1;
      continue;
    }
    if (key === '--max-file-diff-lines') {
      args.maxFileDiffLines = toNumber(value, 0);
      i += 1;
      continue;
    }
    if (key === '--context') {
      args.context = toNumber(value, 3);
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
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
  }).trim();
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
      const similarity =
        status.length > 1 && /^[RC]\d+$/.test(status)
          ? Number(status.slice(1))
          : null;
      if (
        (status.startsWith('R') || status.startsWith('C')) &&
        parts.length >= 3
      ) {
        return {
          status,
          similarity,
          displayPath: `${parts[1]} -> ${parts[2]}`,
          filePath: parts[2],
          oldPath: parts[1],
        };
      }
      return {
        status,
        similarity,
        displayPath: parts[1] || '',
        filePath: parts[1] || '',
      };
    });
}

function buildPathStats(numStatRaw) {
  const stats = {};
  if (!numStatRaw) return stats;
  numStatRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.split('\t');
      const add = parts[0];
      const del = parts[1];
      const pathPart = parts.slice(2).join('\t');
      let targetPath = pathPart;
      const arrowIdx = pathPart.indexOf(' -> ');
      if (arrowIdx >= 0) {
        targetPath = pathPart.slice(arrowIdx + 4);
      }
      stats[targetPath] = {
        added: add === '-' ? null : Number(add || 0),
        deleted: del === '-' ? null : Number(del || 0),
        isBinary: add === '-' || del === '-',
      };
    });
  return stats;
}

function limitLines(text, maxLines) {
  if (!maxLines || maxLines <= 0) {
    return { content: text, truncated: false };
  }
  const lines = text.split('\n');
  if (lines.length <= maxLines) {
    return { content: text, truncated: false };
  }
  return { content: lines.slice(0, maxLines).join('\n'), truncated: true };
}

function usage() {
  return [
    'Usage: generate-diff-report.js [--base <ref>] [--head <ref>] [--repo <path>] [--out <file>]',
    'Options: [--out-dir <dir>] [--max-file-diff-lines <N>] [--context <N>]',
    'Defaults: --base main --head HEAD --context 3; writes to <repo>/diff-report/ unless --out is set',
  ].join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    process.exit(0);
  }

  const repo = path.resolve(args.repo);
  const defaultOutDir = path.join(repo, 'diff-report');
  const outDir = args.out ? '' : path.resolve(args.outDir || defaultOutDir);
  const range = `${args.base}..${args.head}`;

  let baseSha = '';
  let headSha = '';
  let nameStatus = '';
  let numStatRaw = '';

  try {
    baseSha = runGit(repo, ['rev-parse', args.base]);
    headSha = runGit(repo, ['rev-parse', args.head]);
    nameStatus = runGit(repo, [
      'diff',
      '--color=never',
      '--no-ext-diff',
      '--name-status',
      '-M',
      '-C',
      range,
    ]);
    numStatRaw = runGit(repo, [
      'diff',
      '--color=never',
      '--no-ext-diff',
      '--numstat',
      '-M',
      '-C',
      range,
    ]);
  } catch (error) {
    console.error('Failed to run git commands.');
    console.error(error.message || error);
    process.exit(1);
  }

  if (args.out && args.outDir) {
    console.error('Use either --out or --out-dir, not both.');
    process.exit(1);
  }

  const files = formatNameStatus(nameStatus);
  const pathStats = buildPathStats(numStatRaw);
  let totalAdded = 0;
  let totalDeleted = 0;
  for (const file of files) {
    const stat = pathStats[file.filePath];
    if (stat) {
      file.added = stat.added;
      file.deleted = stat.deleted;
      file.isBinary = stat.isBinary || false;
    } else {
      file.added = 0;
      file.deleted = 0;
      file.isBinary = false;
    }
    if (typeof file.added === 'number') totalAdded += file.added;
    if (typeof file.deleted === 'number') totalDeleted += file.deleted;
  }

  if (!args.out) {
    const diffsDir = path.join(outDir, 'diffs');
    fs.mkdirSync(diffsDir, { recursive: true });

    for (const file of files) {
      if (!file.filePath) continue;
      const diffRelPath = path.join('diffs', `${file.filePath}.diff`);
      file.diffRelPath = diffRelPath;
      const diffPath = path.join(outDir, diffRelPath);
      const diffPathDir = path.dirname(diffPath);
      fs.mkdirSync(diffPathDir, { recursive: true });

      if (file.isBinary) {
        fs.writeFileSync(diffPath, 'Binary change detected; diff omitted.\n');
        continue;
      }
      try {
        const diffContent = runGit(repo, [
          'diff',
          '--color=never',
          '--no-ext-diff',
          '--binary',
          `-U${args.context}`,
          '-M',
          '-C',
          range,
          '--',
          file.filePath,
        ]);
        if (diffContent && diffContent.trim()) {
          const limited = limitLines(diffContent, args.maxFileDiffLines);
          fs.writeFileSync(
            diffPath,
            limited.truncated
              ? `${limited.content}\n\n[Truncated to ${args.maxFileDiffLines} lines]\n`
              : `${limited.content}\n`
          );
          if (limited.truncated) {
            file.truncated = true;
          }
        } else {
          fs.writeFileSync(diffPath, 'No diff content.\n');
        }
      } catch (e) {
        fs.writeFileSync(diffPath, `Failed to load diff: ${e.message}\n`);
      }
    }
  }

  const lines = [];
  const now = new Date().toISOString();

  lines.push('# Diff Report');
  lines.push('');
  lines.push(`- Base: ${args.base} (${baseSha})`);
  lines.push(`- Head: ${args.head} (${headSha})`);
  lines.push(`- Range: ${range}`);
  lines.push(`- Files changed: ${files.length}`);
  lines.push(`- Added lines: ${totalAdded}`);
  lines.push(`- Deleted lines: ${totalDeleted}`);
  if (args.maxFileDiffLines > 0) {
    lines.push(`- Per-file diff lines: <= ${args.maxFileDiffLines}`);
  }
  if (!args.out) {
    lines.push(`- Diff directory: ${outDir}`);
  }
  lines.push(`- Generated at: ${now}`);
  lines.push('');

  lines.push('## Files');
  lines.push('');
  lines.push('| Status | Path | +lines | -lines | Notes | Diff |');
  lines.push('| --- | --- | ---: | ---: | --- | --- |');
  if (files.length === 0) {
    lines.push('| - | - | 0 | 0 | - | - |');
  } else {
    for (const file of files) {
      const notes = [];
      if (file.isBinary) notes.push('binary');
      if (file.similarity !== null && file.similarity !== undefined) {
        notes.push(`similarity:${file.similarity}%`);
      }
      if (file.truncated) notes.push('truncated');
      const diffCell = args.out ? 'inline' : file.diffRelPath || '-';
      lines.push(
        `| ${file.status} | ${file.displayPath} | ${file.added ?? ''} | ${
          file.deleted ?? ''
        } | ${notes.join('; ')} | ${diffCell} |`
      );
    }
  }
  lines.push('');

  if (args.out) {
    lines.push('## Diff');
    lines.push('');
    if (files.length === 0) {
      lines.push('No file changes.');
    } else {
      for (const file of files) {
        lines.push(`### ${file.status} ${file.displayPath}`);
        lines.push(
          `- +lines: ${file.added ?? ''}  -lines: ${file.deleted ?? ''}`
        );
        if (file.isBinary) {
          lines.push('');
          lines.push('_Binary change detected; diff omitted._');
          lines.push('');
          continue;
        }
        lines.push('');
        try {
          const diffContent = runGit(repo, [
            'diff',
            '--color=never',
            '--no-ext-diff',
            '--binary',
            `-U${args.context}`,
            '-M',
            '-C',
            range,
            '--',
            file.filePath,
          ]);
          if (diffContent && diffContent.trim()) {
            const limited = limitLines(diffContent, args.maxFileDiffLines);
            lines.push('```diff');
            lines.push(limited.content);
            lines.push('```');
            if (limited.truncated) {
              lines.push(`_Truncated to ${args.maxFileDiffLines} lines._`);
            }
          } else {
            lines.push('_No diff content_');
          }
        } catch (e) {
          lines.push(`_Failed to load diff: ${e.message}_`);
        }
        lines.push('');
      }
    }
  }

  const output = lines.join('\n');
  if (args.out) {
    fs.writeFileSync(path.resolve(args.out), output, 'utf8');
  } else {
    fs.writeFileSync(path.join(outDir, 'index.md'), output, 'utf8');
    process.stdout.write(`Diff report written to ${outDir}\n`);
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    formatNameStatus,
  };
}
