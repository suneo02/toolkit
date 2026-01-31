#!/usr/bin/env node

/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');
const path = require('path');

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

function expandHome(value) {
  if (!value) return value;
  if (value === '~') return os.homedir();
  if (value.startsWith('~/') || value.startsWith('~\\')) {
    return path.join(os.homedir(), value.slice(2));
  }
  return value;
}

function parseArgs(argv) {
  const args = {
    agent: null,
    target: null,
    repos: [],
    skillsDir: '.agent/skills',
    skillNames: [],
    cleanBroken: false,
    force: false,
    dryRun: false
  };

  for (const raw of argv) {
    if (raw === '--force') args.force = true;
    else if (raw === '--dry-run') args.dryRun = true;
    else if (raw === '--clean-broken') args.cleanBroken = true;
    else if (raw.startsWith('--agent=')) args.agent = raw.slice('--agent='.length);
    else if (raw.startsWith('--target=')) args.target = raw.slice('--target='.length);
    else if (raw.startsWith('--repo=')) args.repos.push(raw.slice('--repo='.length));
    else if (raw.startsWith('--skills-dir=')) args.skillsDir = raw.slice('--skills-dir='.length);
    else if (raw.startsWith('--skill=')) args.skillNames.push(raw.slice('--skill='.length));
    else if (raw.startsWith('--skills=')) args.skillNames.push(...raw.slice('--skills='.length).split(','));
    else if (raw === 'help' || raw === '--help') args.help = true;
    else fail(`Unknown arg: ${raw}`);
  }

  args.skillNames = args.skillNames
    .map(name => String(name || '').trim())
    .filter(Boolean);

  return args;
}

function usage() {
  console.log(`
Agent Skills Union Linker

Build a global union pool of per-skill symlinks from multiple repos’ \`.agent/skills\`.

Usage:
  node scripts/union-link.cjs --agent=<name> --target=<dir> --repo=<path> [--repo=<path> ...] [options]

Required:
  --agent=<name>          Agent name (e.g. codex, claude, gemini, cursor)
  --target=<dir>          Agent global skills directory (e.g. ~/.codex/skills)
  --repo=<path>           Repo root to include (repeatable)

Options:
  --skills-dir=<path>     Skills root relative to repo (default: .agent/skills)
  --skill=<name>          Only link one skill by name (repeatable)
  --skills=<a,b,c>        Only link specific skill names (comma-separated)
  --clean-broken          Remove broken symlinks in target dir (safe)
  --force                 Replace existing links pointing elsewhere
  --dry-run               Print planned actions without changing filesystem
`);
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function readLinkTarget(p) {
  try {
    return fs.readlinkSync(p);
  } catch (error) {
    return null;
  }
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function existsFollow(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function entryExists(p) {
  try {
    fs.lstatSync(p);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function listDirSafe(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function scanAllSkills(skillsRoot) {
  const found = [];

  for (const entry of listDirSafe(skillsRoot)) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.')) continue;

    const directSkill = path.join(skillsRoot, entry.name, 'SKILL.md');
    if (existsFollow(directSkill)) {
      found.push({
        name: entry.name,
        dir: path.join(skillsRoot, entry.name)
      });
      continue;
    }

    // treat as group directory
    const groupDir = path.join(skillsRoot, entry.name);
    for (const sub of listDirSafe(groupDir)) {
      if (!sub.isDirectory()) continue;
      if (sub.name.startsWith('.')) continue;
      const skillDir = path.join(groupDir, sub.name);
      const skillMd = path.join(skillDir, 'SKILL.md');
      if (existsFollow(skillMd)) {
        found.push({ name: sub.name, dir: skillDir });
      }
    }
  }

  return found;
}

function createSymlink(target, linkPath, dryRun) {
  if (dryRun) {
    console.log(`DRY-RUN: link ${linkPath} -> ${target}`);
    return;
  }
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(target, linkPath, type);
}

function removePath(p, dryRun) {
  if (dryRun) {
    console.log(`DRY-RUN: remove ${p}`);
    return;
  }
  fs.rmSync(p, { recursive: true, force: true });
}

function resolveReal(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return null;
  }
}

function cleanBrokenSymlinks(targetDir, dryRun) {
  const removed = [];
  for (const entry of listDirSafe(targetDir)) {
    const p = path.join(targetDir, entry.name);
    if (!isSymlink(p)) continue;
    if (existsFollow(p)) continue; // not broken
    removePath(p, dryRun);
    removed.push(p);
  }
  return removed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  if (!args.agent) fail('Missing --agent');
  if (!args.target) fail('Missing --target');
  if (!args.repos || args.repos.length === 0) fail('At least one --repo is required');

  const targetDir = path.resolve(expandHome(args.target));
  const repos = args.repos.map(r => path.resolve(expandHome(r)));

  ensureDir(targetDir);

  const selectedNames = args.skillNames.length > 0 ? new Set(args.skillNames) : null;
  const nextEntries = {};
  const duplicates = new Map();
  const foundSelected = new Set();

  for (const repoRoot of repos) {
    const skillsRoot = path.join(repoRoot, args.skillsDir);
    if (!existsFollow(skillsRoot)) {
      fail(`Repo skills dir not found: ${skillsRoot}`);
    }

    let skillItems = scanAllSkills(skillsRoot);
    if (selectedNames) {
      skillItems = skillItems.filter(item => selectedNames.has(item.name));
      for (const item of skillItems) {
        foundSelected.add(item.name);
      }
    }

    for (const item of skillItems) {
      const existing = nextEntries[item.name];
      if (existing) {
        const list = duplicates.get(item.name) || [existing];
        list.push({ repoRoot, dir: item.dir });
        duplicates.set(item.name, list);
        continue;
      }
      nextEntries[item.name] = {
        repoRoot,
        dir: item.dir
      };
    }
  }

  if (selectedNames) {
    const missing = [...selectedNames].filter(name => !foundSelected.has(name));
    if (missing.length > 0) {
      fail(`Selected skill(s) not found in any repo: ${missing.join(', ')}`);
    }
  }

  if (duplicates.size > 0) {
    const lines = [];
    for (const [name, items] of duplicates.entries()) {
      lines.push(`- ${name}`);
      for (const it of items) {
        lines.push(`  - ${it.repoRoot} -> ${it.dir}`);
      }
    }
    fail(`Duplicate skill names detected (must be globally unique):\n${lines.join('\n')}`);
  }

  if (args.cleanBroken) {
    const removed = cleanBrokenSymlinks(targetDir, args.dryRun);
    if (removed.length > 0) {
      console.log(`→ Removed broken symlinks: ${removed.length}`);
    }
  }

  // Link/update
  const linkedNames = Object.keys(nextEntries).sort();
  for (const name of linkedNames) {
    const sourceDir = nextEntries[name].dir;
    const linkPath = path.join(targetDir, name);

    if (entryExists(linkPath)) {
      if (!isSymlink(linkPath)) {
        fail(`Path exists and is not a symlink: ${linkPath}`);
      }

      const rawTarget = readLinkTarget(linkPath);
      const resolvedCurrent = rawTarget
        ? path.resolve(path.dirname(linkPath), rawTarget)
        : null;
      const resolvedDesired = path.resolve(sourceDir);

      if (resolvedCurrent && !existsFollow(resolvedCurrent)) {
        // Broken link: safe to replace without requiring --force.
        removePath(linkPath, args.dryRun);
      } else {
        const currentReal = resolvedCurrent ? resolveReal(resolvedCurrent) : null;
        const desiredReal = resolveReal(resolvedDesired) || resolvedDesired;

        if (currentReal && desiredReal && currentReal === desiredReal) {
          continue;
        }

        if (!args.force) {
          fail(`Skill link conflict: ${linkPath} points elsewhere. Use --force to replace.`);
        }

        removePath(linkPath, args.dryRun);
      }
    }

    createSymlink(sourceDir, linkPath, args.dryRun);
  }

  console.log(`✓ Union links updated for ${args.agent}`);
  console.log(`→ Target: ${targetDir}`);
  console.log(`→ Skills: ${linkedNames.length}`);
  if (args.dryRun) {
    console.log('→ Mode: DRY-RUN (no changes applied)');
  }
}

main().catch(error => fail(error && error.message ? error.message : String(error)));
