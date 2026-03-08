import * as fs from 'fs-extra';
import * as path from 'path';
import { getSkillsDir } from '../config/paths';
import { readCepheidConfig, writeCepheidConfig } from '../config/manager';
import { getSkill, Skill } from './registry';

/**
 * Install a skill to Claude Code
 */
export async function installSkill(skillName: string): Promise<void> {
  // Get skill from registry
  const skill = await getSkill(skillName);
  if (!skill) {
    throw new Error(`Skill "${skillName}" not found in registry`);
  }

  // Create installation directory
  const installDir = getSkillsDir();
  await fs.ensureDir(installDir);

  // Copy skill file
  const skillFileName = `${skill.metadata.name}.md`;
  const installPath = path.join(installDir, skillFileName);
  await fs.writeFile(installPath, skill.content, 'utf8');

  // Update Cepheid config
  const config = await readCepheidConfig();
  if (!config.installedSkills.includes(skillName)) {
    config.installedSkills.push(skillName);
    await writeCepheidConfig(config);
  }
}

/**
 * Uninstall a skill
 */
export async function uninstallSkill(skillName: string): Promise<void> {
  const installDir = getSkillsDir();
  const skillFileName = `${skillName}.md`;
  const installPath = path.join(installDir, skillFileName);

  // Remove skill file
  if (await fs.pathExists(installPath)) {
    await fs.remove(installPath);
  }

  // Update Cepheid config
  const config = await readCepheidConfig();
  config.installedSkills = config.installedSkills.filter(s => s !== skillName);
  await writeCepheidConfig(config);
}

/**
 * Check if a skill is installed
 */
export async function isSkillInstalled(skillName: string): Promise<boolean> {
  const config = await readCepheidConfig();
  return config.installedSkills.includes(skillName);
}

/**
 * List installed skills
 */
export async function listInstalledSkills(): Promise<string[]> {
  const config = await readCepheidConfig();
  return config.installedSkills;
}

/**
 * Update a skill (reinstall with latest version)
 */
export async function updateSkill(skillName: string): Promise<void> {
  await uninstallSkill(skillName);
  await installSkill(skillName);
}

/**
 * Install multiple skills
 */
export async function installMultipleSkills(skillNames: string[]): Promise<void> {
  for (const skillName of skillNames) {
    await installSkill(skillName);
  }
}
