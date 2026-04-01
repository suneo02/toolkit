const fs = require('fs');
const os = require('os');
const path = require('path');

function expandHome(value) {
  if (!value) return value;
  if (value === '~') return os.homedir();
  if (value.startsWith('~/') || value.startsWith('~\\')) {
    return path.join(os.homedir(), value.slice(2));
  }
  return value;
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

function resolveReal(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return null;
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

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function removePath(p, dryRun) {
  if (dryRun) {
    console.log(`DRY-RUN: remove ${p}`);
    return;
  }
  fs.rmSync(p, { recursive: true, force: true });
}

function createSymlink(target, linkPath, dryRun, relative = false) {
  let finalTarget = target;
  if (relative) {
    finalTarget = path.relative(path.dirname(linkPath), target);
  }
  if (dryRun) {
    console.log(`DRY-RUN: link ${linkPath} -> ${finalTarget}`);
    return;
  }
  // Windows: junction is more reliable for directories when using absolute paths
  const type = (process.platform === 'win32' && !relative) ? 'junction' : 'dir';
  fs.symlinkSync(finalTarget, linkPath, type);
}

module.exports = {
  expandHome,
  isSymlink,
  readLinkTarget,
  existsFollow,
  entryExists,
  resolveReal,
  listDirSafe,
  ensureDir,
  removePath,
  createSymlink
};
