#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
    base: 'main',
    head: 'HEAD',
    out: '',
    diffDir: '',
    repo: process.cwd(),
    findRenames: '',
    findCopies: '',
    jsonOut: '',
    maxFileDiffLines: 0,
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
    if (key === '--diff-dir') {
      args.diffDir = value;
      i += 1;
      continue;
    }
    if (key === '--repo') {
      args.repo = value;
      i += 1;
      continue;
    }
    if (key === '--find-renames') {
      args.findRenames = value || '1';
      i += 1;
      continue;
    }
    if (key === '--find-copies') {
      args.findCopies = value || '1';
      i += 1;
      continue;
    }
    if (key === '--json-out') {
      args.jsonOut = value || '';
      i += 1;
      continue;
    }
    if (key === '--max-file-diff-lines') {
      args.maxFileDiffLines = Number(value || '0') || 0;
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

function usage() {
  return [
    'Usage: generate-diff-report.js [--base <ref>] [--head <ref>] [--repo <path>] [--out <file>] [--diff-dir <dir>]',
    'Options: [--find-renames <N>] [--find-copies <N>] [--json-out <file>] [--max-file-diff-lines <N>] [--include <regex[,regex...]>] [--exclude <regex[,regex...]>]',
    'Defaults: --base main --head HEAD --repo CWD; diff files disabled unless --diff-dir is set',
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
  let numStatRaw = '';
  let dirStatRaw = '';

  try {
    baseSha = runGit(repo, ['rev-parse', args.base]);
    headSha = runGit(repo, ['rev-parse', args.head]);
    {
      const diffArgs = ['diff', '--color=never', '--no-ext-diff', '--stat'];
      if (args.findRenames) diffArgs.push(`--find-renames=${args.findRenames}`);
      if (args.findCopies) diffArgs.push(`--find-copies=${args.findCopies}`);
      diffArgs.push(range);
      diffStat = runGit(repo, diffArgs);
    }
    {
      const nsArgs = [
        'diff',
        '--color=never',
        '--no-ext-diff',
        '--name-status',
      ];
      if (args.findRenames) nsArgs.push(`--find-renames=${args.findRenames}`);
      if (args.findCopies) nsArgs.push(`--find-copies=${args.findCopies}`);
      nsArgs.push(range);
      nameStatus = runGit(repo, nsArgs);
    }
    {
      const nsArgs = [
        'diff',
        '--color=never',
        '--no-ext-diff',
        '--numstat',
        range,
      ];
      numStatRaw = runGit(repo, nsArgs);
    }
    {
      const dsArgs = [
        'diff',
        '--color=never',
        '--no-ext-diff',
        '--dirstat=files,50',
        range,
      ];
      try {
        dirStatRaw = runGit(repo, dsArgs);
      } catch {
        dirStatRaw = '';
      }
    }
    {
    }
  } catch (error) {
    console.error('Failed to run git commands.');
    console.error(error.message || error);
    process.exit(1);
  }

  let files = formatNameStatus(nameStatus);
  if (args.include.length || args.exclude.length) {
    const includeRes = args.include.map((p) => new RegExp(p));
    const excludeRes = args.exclude.map((p) => new RegExp(p));
    files = files.filter((f) => {
      const p = f.filePath || '';
      const included =
        includeRes.length === 0 || includeRes.some((r) => r.test(p));
      const excluded = excludeRes.some((r) => r.test(p));
      return included && !excluded;
    });
  }
  const statusPriority = {
    A: 0,
    M: 1,
    R: 2,
    C: 3,
    D: 4,
    T: 5,
    U: 6,
  };
  files.sort((a, b) => {
    const sa = (a.status || '').charAt(0);
    const sb = (b.status || '').charAt(0);
    const pa = statusPriority.hasOwnProperty(sa) ? statusPriority[sa] : 9;
    const pb = statusPriority.hasOwnProperty(sb) ? statusPriority[sb] : 9;
    if (pa !== pb) return pa - pb;
    return (a.filePath || '').localeCompare(b.filePath || '');
  });
  const pathStats = {};
  if (numStatRaw) {
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
        pathStats[targetPath] = {
          added: add === '-' ? null : Number(add || 0),
          deleted: del === '-' ? null : Number(del || 0),
          isBinary: add === '-' || del === '-',
        };
      });
  }
  for (const f of files) {
    const stat = pathStats[f.filePath];
    if (stat) {
      f.added = stat.added;
      f.deleted = stat.deleted;
      f.isBinary = stat.isBinary || false;
    } else {
      f.added = 0;
      f.deleted = 0;
      f.isBinary = false;
    }
  }
  const statusCounts = {};
  let totalAdded = 0;
  let totalDeleted = 0;
  for (const f of files) {
    const key = (f.status || '').charAt(0) || '-';
    statusCounts[key] = (statusCounts[key] || 0) + 1;
    if (typeof f.added === 'number') totalAdded += f.added;
    if (typeof f.deleted === 'number') totalDeleted += f.deleted;
  }
  const dirStats = [];
  if (dirStatRaw) {
    dirStatRaw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => {
        const m = l.match(/^(\d+(?:\.\d+)?)%\s+(.+)$/);
        if (m) dirStats.push({ percent: Number(m[1]), dir: m[2] });
      });
  }
  const commits = [];
  if (commitLogRaw) {
    commitLogRaw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => {
        const [hash, author, date, subject] = l.split('|');
        commits.push({ hash, author, date, subject });
      });
  }
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
  lines.push('## Stats');
  lines.push('');
  lines.push(`- Added lines: ${totalAdded}`);
  lines.push(`- Deleted lines: ${totalDeleted}`);
  lines.push(
    `- Status counts: ${Object.keys(statusCounts)
      .sort()
      .map((k) => `${k}:${statusCounts[k]}`)
      .join(', ')}`
  );
  if (dirStats.length) {
    lines.push(
      `- Top impacted directories: ${dirStats
        .slice(0, 5)
        .map((d) => `${d.dir}(${d.percent}%)`)
        .join(', ')}`
    );
  }
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('```');
  lines.push(diffStat || 'No changes.');
  lines.push('```');
  lines.push('');
  lines.push('## Commits');
  lines.push('');
  if (commits.length === 0) {
    lines.push('- No commits.');
  } else {
    for (const c of commits) {
      lines.push(`- ${c.hash} ${c.subject} (${c.author}, ${c.date})`);
    }
  }
  lines.push('');
  lines.push('## Files');
  lines.push('');
  lines.push('| Status | Path | +lines | -lines | Notes |');
  lines.push('| --- | --- | ---: | ---: | --- |');
  if (files.length === 0) {
    lines.push('| - | - | 0 | 0 | - |');
  } else {
    for (const file of files) {
      const notes = [];
      if (file.isBinary) notes.push('binary');
      if (file.similarity !== null && file.similarity !== undefined)
        notes.push(`similarity:${file.similarity}%`);
      lines.push(
        `| ${file.status} | ${file.displayPath} | ${file.added ?? ''} | ${
          file.deleted ?? ''
        } | ${notes.join('; ')} |`
      );
    }
  }
  lines.push('');

  lines.push('## Per-file Details');
  lines.push('');
  if (files.length === 0) {
    lines.push('No file changes.');
  } else {
    for (const file of files) {
      lines.push(`### ${file.status} ${file.displayPath}`);
      const headerNotes = [];
      if (file.isBinary) headerNotes.push('binary');
      if (file.similarity !== null && file.similarity !== undefined)
        headerNotes.push(`similarity:${file.similarity}%`);
      if (headerNotes.length) lines.push(`- Notes: ${headerNotes.join('; ')}`);
      lines.push(
        `- +lines: ${file.added ?? ''}  -lines: ${file.deleted ?? ''}`
      );
      lines.push('');
      if (file.isBinary) {
        lines.push('_Binary change detected; diff content omitted._');
      } else
        try {
          const diffContent = runGit(repo, [
            'diff',
            '--color=never',
            '--no-ext-diff',
            '--binary',
            range,
            '--',
            file.filePath,
          ]);
          const contentForWrite =
            args.maxFileDiffLines && args.maxFileDiffLines > 0
              ? diffContent
                  .split('\n')
                  .slice(0, args.maxFileDiffLines)
                  .join('\n')
              : diffContent;
          if (contentForWrite && contentForWrite.trim()) {
            lines.push('```diff');
            lines.push(contentForWrite);
            lines.push('```');
          } else {
            lines.push('_No diff content_');
          }
        } catch (e) {
          lines.push(`_Failed to load diff: ${e.message}_`);
        }
      lines.push('');
    }
  }

  const output = lines.join('\n');
  if (args.out) {
    fs.writeFileSync(path.resolve(args.out), output, 'utf8');
  } else {
    process.stdout.write(output);
  }

  if (args.jsonOut) {
    const json = {
      base: { ref: args.base, sha: baseSha },
      head: { ref: args.head, sha: headSha },
      range,
      generatedAt: now,
      stats: {
        totalAdded,
        totalDeleted,
        statusCounts,
        dirStats,
      },
      commits,
      files: [],
    };
    for (const file of files) {
      let diffSnippet = '';
      if (file.isBinary) {
        diffSnippet = '';
      } else
        try {
          const diffContent = runGit(repo, [
            'diff',
            '--color=never',
            '--no-ext-diff',
            '--binary',
            range,
            '--',
            file.filePath,
          ]);
          diffSnippet =
            args.maxFileDiffLines && args.maxFileDiffLines > 0
              ? diffContent
                  .split('\n')
                  .slice(0, args.maxFileDiffLines)
                  .join('\n')
              : diffContent;
        } catch {}
      json.files.push({
        status: file.status,
        similarity: file.similarity ?? null,
        oldPath: file.oldPath ?? null,
        path: file.filePath,
        displayPath: file.displayPath,
        added: file.added ?? null,
        deleted: file.deleted ?? null,
        isBinary: !!file.isBinary,
        diff: diffSnippet,
      });
    }
    fs.writeFileSync(
      path.resolve(args.jsonOut),
      JSON.stringify(json, null, 2),
      'utf8'
    );
  }

  if (args.diffDir) {
    const diffDir = path.resolve(args.diffDir);
    if (!fs.existsSync(diffDir)) {
      fs.mkdirSync(diffDir, { recursive: true });
    }

    console.error(`\nGenerating diff files in ${diffDir}...`);

    for (const file of files) {
      if (file.status.startsWith('D')) continue;

      try {
        const diffContent = runGit(repo, [
          'diff',
          '--color=never',
          '--no-ext-diff',
          '--binary',
          range,
          '--',
          file.filePath,
        ]);
        if (diffContent) {
          const targetPath = path.join(diffDir, `${file.filePath}.diff`);
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          const contentForWrite =
            args.maxFileDiffLines && args.maxFileDiffLines > 0
              ? diffContent
                  .split('\n')
                  .slice(0, args.maxFileDiffLines)
                  .join('\n')
              : diffContent;
          fs.writeFileSync(targetPath, contentForWrite, 'utf8');
        }
      } catch (e) {
        console.error(
          `Failed to generate diff for ${file.filePath}`,
          e.message
        );
      }
    }
    console.error('Diff files generation completed.');
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    formatNameStatus,
  };
}
