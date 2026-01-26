import { existsSync } from 'fs';
import { mkdir, rename, rm } from 'fs/promises';
import { join } from 'path';
import { SKILL_GROUPS } from './constants.js';

export async function syncSkills(manager, options = {}) {
  manager.log(`Syncing ${manager.agentName} skills...`);
  manager.log(`Repo: ${manager.repoRoot}`);
  manager.log(`Target: ${manager.targetDir}`);
  if (options.groups && options.groups.length > 0) {
    manager.log(`Groups: ${options.groups.join(', ')}`);
  }

  await mkdir(manager.targetDir, { recursive: true });

  const skills = await manager.getRepoSkills({ groups: options.groups });

  for (const skill of skills) {
    const linkPath = join(manager.targetDir, skill.name);

    if (manager.pathExists(linkPath)) {
      const link = await manager.isLink(linkPath);
      if (link) {
        if (!existsSync(linkPath)) {
          await rm(linkPath, { recursive: true, force: true });
          manager.log(`Removed: ${skill.name} (broken link)`, 'warn');
        } else {
          manager.log(`Skip: ${skill.name} (already linked)`, 'info');
          continue;
        }
      } else {
        manager.log(`Skip: ${skill.name} (real directory exists)`, 'warn');
        continue;
      }
    }

    await manager.createLink(skill.path, linkPath);
    manager.log(`Linked: ${skill.name}`, 'success');
  }

  if (options.prune) {
    if (options.groups && options.groups.length > 0) {
      await manager.prune();
    } else {
      await manager.prune(skills.map(s => s.name));
    }
  }

  manager.log('Sync completed!', 'success');
}

export async function bootstrapSkills(manager) {
  manager.log(`Bootstrapping ${manager.agentName} skills...`);
  manager.log(`Repo: ${manager.repoRoot}`);
  manager.log(`Target: ${manager.targetDir}`);

  await mkdir(manager.targetDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] +
                    '-' + new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '');
  const backupDir = `${manager.targetDir}.backup-${timestamp}`;
  await mkdir(backupDir, { recursive: true });

  const skills = await manager.getRepoSkills();

  for (const skill of skills) {
    const targetPath = join(manager.targetDir, skill.name);
    if (manager.pathExists(targetPath)) {
      const backupPath = join(backupDir, skill.name);
      manager.log(`Backing up: ${skill.name}`, 'warn');
      await rename(targetPath, backupPath);
    }
  }

  for (const skill of skills) {
    const linkPath = join(manager.targetDir, skill.name);
    await manager.createLink(skill.path, linkPath);
    manager.log(`Linked: ${skill.name}`, 'success');
  }

  manager.log(`Backup saved to: ${backupDir}`, 'info');
  manager.log('Bootstrap completed!', 'success');
}

export async function adoptSkill(manager, skillName, options = {}) {
  if (!skillName) {
    throw new Error('Skill name is required');
  }

  const group = options.group || 'general';
  if (!SKILL_GROUPS.includes(group)) {
    throw new Error(`Invalid group: ${group}. Use ${SKILL_GROUPS.join(', ')}`);
  }

  manager.log(`Adopting skill: ${skillName}`);

  const sourcePath = join(manager.targetDir, skillName);
  const groupPath = join(manager.repoSkillsDir, group);
  const repoPath = join(groupPath, skillName);

  if (!existsSync(sourcePath)) {
    throw new Error(`Skill not found: ${sourcePath}`);
  }

  if (await manager.isLink(sourcePath)) {
    manager.log(`Already a link: ${skillName}`, 'warn');
    return;
  }

  if (existsSync(repoPath)) {
    throw new Error(`Skill already exists in repo: ${repoPath}`);
  }

  manager.log(`Moving to repo: ${skillName}`, 'info');
  await mkdir(groupPath, { recursive: true });
  await rename(sourcePath, repoPath);

  await manager.createLink(repoPath, sourcePath);
  manager.log(`Linked back: ${skillName}`, 'success');

  manager.log('Adopt completed!', 'success');
  manager.log('Remember to commit and push to Git!', 'warn');
}

export async function pruneSkills(manager, validSkills = null) {
  manager.log('Pruning old links...');

  if (!validSkills) {
    const skills = await manager.getRepoSkills();
    validSkills = skills.map(s => s.name);
  }

  const items = await manager.listTargetItems();

  for (const item of items) {
    if (item.name === '.system') {
      continue;
    }

    if (validSkills.includes(item.name)) {
      continue;
    }

    const fullPath = join(manager.targetDir, item.name);
    const link = await manager.isLink(fullPath);

    if (link) {
      await rm(fullPath, { recursive: true, force: true });
      manager.log(`Removed: ${item.name} (not in repo)`, 'warn');
    } else {
      manager.log(`Skip: ${item.name} (real directory)`, 'info');
    }
  }

  manager.log('Prune completed!', 'success');
}

export async function listSkills(manager) {
  manager.log(`Skills for ${manager.agentName}:\n`);

  const skills = await manager.getRepoSkills();
  for (const skill of skills) {
    const linkPath = join(manager.targetDir, skill.name);
    let status = '○ Not linked';

    if (existsSync(linkPath)) {
      if (await manager.isLink(linkPath)) {
        status = '● Linked';
      } else {
        status = '⚠ Real directory';
      }
    }

    console.log(`  ${status}  ${skill.name}`);
  }

  console.log('');
}
