import { existsSync, lstatSync } from 'fs';
import { readdir } from 'fs/promises';
import { isAbsolute, join, relative, sep } from 'path';
import { createInterface } from 'readline';

export function inferSkillName(targetDir) {
  const cwd = process.cwd();
  const rel = relative(targetDir, cwd);

  if (rel.startsWith('..') || isAbsolute(rel)) {
    return null;
  }

  const segments = rel.split(sep);
  if (segments.length > 0 && segments[0] !== '.') {
    return segments[0];
  }

  return null;
}

export async function getLocalSkillCandidates(targetDir) {
  if (!existsSync(targetDir)) {
    return [];
  }

  const items = await readdir(targetDir, { withFileTypes: true });
  const candidates = [];

  for (const item of items) {
    if (item.name === '.system') {
      continue;
    }

    if (!item.isDirectory()) {
      continue;
    }

    const fullPath = join(targetDir, item.name);
    const isLink = lstatSync(fullPath).isSymbolicLink();
    if (!isLink) {
      candidates.push(item.name);
    }
  }

  return candidates;
}

export function interactiveSelect(candidates) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error('Non-interactive environment: please provide skill name explicitly'));
      return;
    }

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\nFound multiple local skills:');
    candidates.forEach((name, index) => {
      console.log(`  ${index + 1}. ${name}`);
    });

    const prompt = () => {
      rl.question('\nSelect a skill (enter number or name): ', (input) => {
        const trimmed = input.trim();
        const index = parseInt(trimmed, 10);

        if (!isNaN(index) && index >= 1 && index <= candidates.length) {
          rl.close();
          resolve(candidates[index - 1]);
          return;
        }

        if (candidates.includes(trimmed)) {
          rl.close();
          resolve(trimmed);
          return;
        }

        console.log('Invalid selection. Please try again.');
        prompt();
      });
    };

    prompt();
  });
}
