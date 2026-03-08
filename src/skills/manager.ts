import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { getPluginsDir, getClaudeCodeConfigDir } from '../config/paths';
import { readCepheidConfig, writeCepheidConfig } from '../config/manager';

export interface EnabledSkill {
  name: string;
  plugin: string;
  path: string;
}

export interface PluginSkill {
  name: string;
  description?: string;
  path: string;
}

/**
 * Get Claude Code skills directory
 */
function getClaudeSkillsDir(): string {
  return path.join(getClaudeCodeConfigDir(), 'skills');
}

/**
 * List all skills available in a plugin
 */
export async function listPluginSkills(pluginName: string): Promise<PluginSkill[]> {
  const pluginDir = path.join(getPluginsDir(), pluginName);

  if (!(await fs.pathExists(pluginDir))) {
    throw new Error(`Plugin "${pluginName}" not found. Install it first with: cepheid plugin install ${pluginName}`);
  }

  const skillsDir = path.join(pluginDir, 'skills');
  if (!(await fs.pathExists(skillsDir))) {
    return [];
  }

  const skills: PluginSkill[] = [];
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillPath = path.join(skillsDir, entry.name);
      const skillFile = path.join(skillPath, 'SKILL.md');

      if (await fs.pathExists(skillFile)) {
        // Try to extract description from SKILL.md frontmatter
        let description: string | undefined;
        try {
          const content = await fs.readFile(skillFile, 'utf8');
          const match = content.match(/^---\n([\s\S]*?)\n---/);
          if (match) {
            const descMatch = match[1].match(/description:\s*(.+)/);
            if (descMatch) {
              description = descMatch[1].trim();
            }
          }
        } catch {
          // Ignore parsing errors
        }

        skills.push({
          name: entry.name,
          description,
          path: skillPath,
        });
      }
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Enable a skill from a plugin (create symlink to ~/.claude/skills/)
 */
export async function enableSkill(pluginName: string, skillName: string): Promise<void> {
  const pluginDir = path.join(getPluginsDir(), pluginName);
  const skillPath = path.join(pluginDir, 'skills', skillName);

  if (!(await fs.pathExists(skillPath))) {
    throw new Error(`Skill "${skillName}" not found in plugin "${pluginName}"`);
  }

  const claudeSkillsDir = getClaudeSkillsDir();
  await fs.ensureDir(claudeSkillsDir);

  const targetPath = path.join(claudeSkillsDir, skillName);

  // Check if already exists
  if (await fs.pathExists(targetPath)) {
    // Check if it's our symlink
    try {
      const stats = await fs.lstat(targetPath);
      if (stats.isSymbolicLink()) {
        const linkTarget = await fs.readlink(targetPath);
        if (linkTarget === skillPath) {
          console.log(chalk.yellow(`Skill "${skillName}" is already enabled from "${pluginName}"`));
          return;
        }
      }
      throw new Error(`Path "${targetPath}" already exists. Remove it manually to enable this skill.`);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        throw error;
      }
      // Other error, continue
    }
  }

  // Create symlink
  await fs.ensureSymlink(skillPath, targetPath, 'dir');

  // Track in config
  const config = await readCepheidConfig();
  if (!config.enabledSkills) {
    config.enabledSkills = [];
  }

  const existingIndex = config.enabledSkills.findIndex(
    (s: EnabledSkill) => s.name === skillName
  );

  if (existingIndex === -1) {
    config.enabledSkills.push({
      name: skillName,
      plugin: pluginName,
      path: skillPath,
    });
    await writeCepheidConfig(config);
  }

  console.log(chalk.green(`✓ Enabled skill "${skillName}" from "${pluginName}"`));
  console.log(chalk.dim(`  Linked to: ${targetPath}`));
}

/**
 * Disable a skill (remove symlink)
 */
export async function disableSkill(skillName: string): Promise<void> {
  const claudeSkillsDir = getClaudeSkillsDir();
  const targetPath = path.join(claudeSkillsDir, skillName);

  if (!(await fs.pathExists(targetPath))) {
    throw new Error(`Skill "${skillName}" is not enabled`);
  }

  // Check if it's a symlink
  const stats = await fs.lstat(targetPath);
  if (!stats.isSymbolicLink()) {
    throw new Error(`"${skillName}" is not a Cepheid-managed skill (not a symlink). Remove it manually.`);
  }

  // Remove symlink
  await fs.unlink(targetPath);

  // Update config
  const config = await readCepheidConfig();
  if (config.enabledSkills) {
    config.enabledSkills = config.enabledSkills.filter(
      (s: EnabledSkill) => s.name !== skillName
    );
    await writeCepheidConfig(config);
  }

  console.log(chalk.green(`✓ Disabled skill "${skillName}"`));
}

/**
 * List all enabled skills
 */
export async function listEnabledSkills(): Promise<EnabledSkill[]> {
  const config = await readCepheidConfig();
  return (config.enabledSkills as EnabledSkill[]) || [];
}

/**
 * Check if a skill is enabled
 */
export async function isSkillEnabled(skillName: string): Promise<boolean> {
  const enabledSkills = await listEnabledSkills();
  return enabledSkills.some(s => s.name === skillName);
}

/**
 * Enable multiple skills at once
 */
export async function enableMultipleSkills(
  pluginName: string,
  skillNames: string[]
): Promise<void> {
  for (const skillName of skillNames) {
    try {
      await enableSkill(pluginName, skillName);
    } catch (error: any) {
      console.error(chalk.red(`✗ Failed to enable "${skillName}": ${error.message}`));
    }
  }
}

/**
 * Disable all skills from a plugin
 */
export async function disablePluginSkills(pluginName: string): Promise<void> {
  const enabledSkills = await listEnabledSkills();
  const pluginSkills = enabledSkills.filter(s => s.plugin === pluginName);

  if (pluginSkills.length === 0) {
    console.log(chalk.yellow(`No enabled skills from plugin "${pluginName}"`));
    return;
  }

  for (const skill of pluginSkills) {
    try {
      await disableSkill(skill.name);
    } catch (error: any) {
      console.error(chalk.red(`✗ Failed to disable "${skill.name}": ${error.message}`));
    }
  }
}
