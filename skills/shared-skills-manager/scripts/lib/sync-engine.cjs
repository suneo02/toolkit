const path = require('path');
const {
  listDirSafe,
  isSymlink,
  readLinkTarget,
  existsFollow,
  removePath,
  entryExists,
  resolveReal,
  createSymlink
} = require('./fs-utils.cjs');

/**
 * Clean broken symlinks in the target directory.
 */
function prune(targetDir, dryRun) {
  const removed = [];
  for (const entry of listDirSafe(targetDir)) {
    const p = path.join(targetDir, entry.name);

    if (isSymlink(p)) {
      const rawTarget = readLinkTarget(p);
      const resolvedTarget = rawTarget ? path.resolve(path.dirname(p), rawTarget) : null;

      if (!resolvedTarget || !entryExists(resolvedTarget)) {
        removePath(p, dryRun);
        removed.push({ path: p, reason: 'broken' });
      }
    }
  }
  return removed;
}

function sync(targetDir, skillEntries, force, dryRun, relative) {
  const stats = { linked: 0, updated: 0, skipped: 0 };
  const linkedNames = Object.keys(skillEntries).sort();

  for (const name of linkedNames) {
    const sourceDir = skillEntries[name].dir;
    const linkPath = path.join(targetDir, name);

    if (entryExists(linkPath)) {
      if (!isSymlink(linkPath)) {
        if (!force) {
          throw new Error(`Path exists and is not a symlink: ${linkPath}. Use --force to replace it.`);
        }
        // If force is true, we remove the existing directory/file to make room for the link
        removePath(linkPath, dryRun);
        stats.updated++;
      } else {
        const rawTarget = readLinkTarget(linkPath);
        const resolvedCurrent = rawTarget
          ? path.resolve(path.dirname(linkPath), rawTarget)
          : null;
        const resolvedDesired = path.resolve(sourceDir);

        const currentReal = resolvedCurrent ? resolveReal(resolvedCurrent) : null;
        const desiredReal = resolveReal(resolvedDesired) || resolvedDesired;

        if (currentReal && desiredReal && currentReal === desiredReal) {
          stats.skipped++;
          continue;
        }

        if (!force) {
          throw new Error(`Skill link conflict: ${linkPath} points elsewhere. Use --force to replace.`);
        }

        removePath(linkPath, dryRun);
        stats.updated++;
      }
    } else {
      stats.linked++;
    }

    createSymlink(sourceDir, linkPath, dryRun, relative);
  }

  return stats;
}

module.exports = {
  prune,
  sync
};
