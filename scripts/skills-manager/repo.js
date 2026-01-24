import { existsSync } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { SKILL_GROUPS } from './constants.js';

export async function getRepoSkills(repoSkillsDir, options = {}) {
  if (!existsSync(repoSkillsDir)) {
    throw new Error(`Repo skills directory not found: ${repoSkillsDir}`);
  }

  const groups = Array.isArray(options.groups) && options.groups.length > 0
    ? options.groups
    : null;
  if (groups) {
    const invalidGroups = groups.filter(group => !SKILL_GROUPS.includes(group));
    if (invalidGroups.length > 0) {
      throw new Error(`Invalid group(s): ${invalidGroups.join(', ')}. Use ${SKILL_GROUPS.join(', ')}`);
    }
  }

  const items = await readdir(repoSkillsDir, { withFileTypes: true });
  const skills = [];
  for (const item of items) {
    if (!item.isDirectory() || item.name.startsWith('.')) {
      continue;
    }
    const groupPath = join(repoSkillsDir, item.name);
    if (SKILL_GROUPS.includes(item.name)) {
      if (groups && !groups.includes(item.name)) {
        continue;
      }
      const groupItems = await readdir(groupPath, { withFileTypes: true });
      for (const groupItem of groupItems) {
        if (!groupItem.isDirectory() || groupItem.name.startsWith('.')) {
          continue;
        }
        skills.push({
          name: groupItem.name,
          path: join(groupPath, groupItem.name)
        });
      }
      continue;
    }
    if (groups) {
      continue;
    }
    skills.push({
      name: item.name,
      path: groupPath
    });
  }
  return skills;
}
