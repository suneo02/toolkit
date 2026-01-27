#!/usr/bin/env node
'use strict';

// Archive **/docs/specs/<task> to **/docs/specs/archive/YYYY-MM/<task>
// @see /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/general/spec-doc-writer/SKILL.md

const fs = require('fs');
const path = require('path');

function printUsage() {
  console.log('用法:');
  console.log('  node scripts/archive-spec.cjs <task|path> [--root <repo>] [--dry-run]');
  console.log('示例:');
  console.log('  node scripts/archive-spec.cjs login-flow');
  console.log('  node scripts/archive-spec.cjs docs/specs/login-flow');
  console.log('  node scripts/archive-spec.cjs login-flow --root /path/to/repo');
  console.log('  node scripts/archive-spec.cjs login-flow --dry-run');
}

function isProbablyPath(input) {
  return (
    input.includes('/') ||
    input.includes('\\') ||
    input.startsWith('.') ||
    input.startsWith(path.sep)
  );
}

function ensureDirectoryExists(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function findDocsSpecsBase(taskPath) {
  let current = path.dirname(taskPath);
  while (true) {
    const baseName = path.basename(current);
    const parent = path.dirname(current);
    if (baseName === 'specs' && path.basename(parent) === 'docs') {
      return current;
    }
    if (current === parent) {
      break;
    }
    current = parent;
  }
  return '';
}

function moveDirectory(src, dest) {
  try {
    fs.renameSync(src, dest);
    return;
  } catch (error) {
    if (error && error.code !== 'EXDEV') {
      throw error;
    }
  }
  fs.cpSync(src, dest, { recursive: true });
  fs.rmSync(src, { recursive: true, force: true });
}

const args = process.argv.slice(2);
let sourceArg = '';
let rootArg = '';
let dryRun = false;

for (let index = 0; index < args.length; index += 1) {
  const current = args[index];
  if (current === '--root') {
    rootArg = args[index + 1] || '';
    index += 1;
    continue;
  }
  if (current === '--dry-run') {
    dryRun = true;
    continue;
  }
  if (!sourceArg) {
    sourceArg = current;
    continue;
  }
  console.error('参数错误: 仅支持一个 task 或 path 参数。');
  printUsage();
  process.exit(1);
}

if (!sourceArg) {
  console.error('参数错误: 缺少 task 或 path。');
  printUsage();
  process.exit(1);
}

const rootDir = rootArg ? path.resolve(rootArg) : process.cwd();
const sourcePath = isProbablyPath(sourceArg)
  ? path.resolve(rootDir, sourceArg)
  : path.join(rootDir, 'docs', 'specs', sourceArg);

if (!fs.existsSync(sourcePath)) {
  console.error(`未找到 Spec 目录: ${sourcePath}`);
  process.exit(1);
}

const sourceStat = fs.statSync(sourcePath);
if (!sourceStat.isDirectory()) {
  console.error(`Spec 路径不是目录: ${sourcePath}`);
  process.exit(1);
}

const taskName = path.basename(sourcePath);
const specsBase = findDocsSpecsBase(sourcePath);
if (!specsBase) {
  console.error(`路径不包含 docs/specs: ${sourcePath}`);
  process.exit(1);
}
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const archiveBase = path.join(specsBase, 'archive', `${year}-${month}`);
const targetPath = path.join(archiveBase, taskName);

if (fs.existsSync(targetPath)) {
  console.error(`目标已存在: ${targetPath}`);
  console.error('请先清理目标目录，或调整任务名后再归档。');
  process.exit(1);
}

if (dryRun) {
  console.log('[Dry Run] 将执行归档:');
  console.log(`  源: ${sourcePath}`);
  console.log(`  目标: ${targetPath}`);
  process.exit(0);
}

ensureDirectoryExists(archiveBase);
moveDirectory(sourcePath, targetPath);

console.log('归档完成:');
console.log(`  源: ${sourcePath}`);
console.log(`  目标: ${targetPath}`);
