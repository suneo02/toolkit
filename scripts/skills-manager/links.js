import { existsSync, lstatSync } from 'fs';
import { symlink } from 'fs/promises';
import { platform } from 'os';

const isWindows = platform() === 'win32';

export function pathExists(path) {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

export async function isLink(path) {
  try {
    const stats = lstatSync(path);
    return stats.isSymbolicLink();
  } catch {
    return false;
  }
}

export async function createLink(target, linkPath) {
  if (isWindows) {
    await symlink(target, linkPath, 'junction');
  } else {
    await symlink(target, linkPath, 'dir');
  }
}

export function linkPathExists(path) {
  return existsSync(path);
}
