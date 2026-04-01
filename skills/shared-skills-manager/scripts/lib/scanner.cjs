const path = require('path');
const { listDirSafe, existsFollow } = require('./fs-utils.cjs');

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

    // treat as group directory (recursive depth 1)
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

function collectFromSource(srcDir, selectedNames = null) {
  if (!existsFollow(srcDir)) {
    throw new Error(`Skills source dir not found: ${srcDir}`);
  }

  const selectedSet = selectedNames && selectedNames.length > 0 ? new Set(selectedNames) : null;
  let skillItems = scanAllSkills(srcDir);

  if (selectedSet) {
    skillItems = skillItems.filter(item => selectedSet.has(item.name));
  }

  const entries = {};
  for (const item of skillItems) {
    entries[item.name] = { dir: item.dir };
  }

  return entries;
}

module.exports = {
  scanAllSkills,
  collectFromSource
};
