import chalk from 'chalk';
import {
  loadProfiles,
  getProfile,
  getProfilesByCategory,
  getRequiredPlugins,
  getSkillCount,
} from '../profiles/manager';
import { installPlugin, isPluginInstalled } from '../plugins/installer';
import { enableSkill, isSkillEnabled } from '../skills/manager';
import { getPluginFromRegistry } from '../plugins/registry';

/**
 * List all available profiles
 */
export async function listProfiles() {
  try {
    const profilesByCategory = await getProfilesByCategory();

    console.log(chalk.bold('\nAvailable Profiles:\n'));

    for (const [category, profiles] of Object.entries(profilesByCategory)) {
      console.log(chalk.cyan.bold(`${category}:`));

      for (const profile of profiles) {
        const skillCount = getSkillCount(profile);
        const pluginCount = getRequiredPlugins(profile).length;

        console.log(`  ${chalk.bold(profile.name)}`);
        console.log(chalk.gray(`     ${profile.description}`));
        console.log(
          chalk.dim(`     ${skillCount} skills from ${pluginCount} plugin(s)`)
        );
        console.log();
      }
    }

    console.log(chalk.dim('Use: cepheid profile show <name> to see details'));
    console.log(chalk.dim('Use: cepheid profile install <name> to install'));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error listing profiles:'), error.message);
    process.exit(1);
  }
}

/**
 * Show details of a specific profile
 */
export async function showProfile(name: string) {
  try {
    const profile = await getProfile(name);

    if (!profile) {
      console.log(chalk.red(`Profile "${name}" not found.`));
      console.log(chalk.gray('Use: cepheid profile list'));
      return;
    }

    console.log(chalk.bold(`\n${profile.name}`));
    console.log(chalk.gray('='.repeat(profile.name.length)));
    console.log();
    console.log(`${chalk.bold('Description:')} ${profile.description}`);
    console.log(`${chalk.bold('Category:')} ${profile.category}`);
    console.log();

    console.log(chalk.bold('Plugins & Skills:\n'));

    for (const group of profile.skills) {
      console.log(chalk.cyan.bold(`  ${group.plugin}:`));

      for (const skillName of group.skills) {
        const enabled = await isSkillEnabled(skillName);
        const badge = enabled ? chalk.green('✓') : chalk.gray('○');
        console.log(`    ${badge} ${skillName}`);
      }
      console.log();
    }

    const skillCount = getSkillCount(profile);
    const pluginCount = getRequiredPlugins(profile).length;

    console.log(chalk.dim(`Total: ${skillCount} skills from ${pluginCount} plugin(s)`));
    console.log();
    console.log(chalk.dim(`Install with: cepheid profile install ${name}`));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error showing profile:'), error.message);
    process.exit(1);
  }
}

/**
 * Install a profile (install plugins and enable skills)
 */
export async function installProfile(name: string) {
  try {
    const profile = await getProfile(name);

    if (!profile) {
      console.log(chalk.red(`Profile "${name}" not found.`));
      console.log(chalk.gray('Use: cepheid profile list'));
      return;
    }

    console.log(chalk.bold(`\nInstalling profile: ${profile.name}\n`));
    console.log(chalk.gray(profile.description));
    console.log();

    const requiredPlugins = getRequiredPlugins(profile);
    const skillCount = getSkillCount(profile);

    console.log(chalk.dim(`This will:`));
    console.log(chalk.dim(`  • Install ${requiredPlugins.length} plugin(s)`));
    console.log(chalk.dim(`  • Enable ${skillCount} skill(s)`));
    console.log();

    // Step 1: Install all required plugins
    console.log(chalk.bold('Step 1: Installing plugins...\n'));

    for (const pluginName of requiredPlugins) {
      try {
        // Check if already installed
        if (await isPluginInstalled(pluginName)) {
          console.log(chalk.yellow(`  ⊙ Plugin "${pluginName}" already installed`));
          continue;
        }

        // Get plugin from registry
        const pluginMetadata = await getPluginFromRegistry(pluginName);

        if (!pluginMetadata) {
          console.log(chalk.red(`  ✗ Plugin "${pluginName}" not found in registry`));
          console.log(chalk.gray(`    Install manually: cepheid plugin install ${pluginName}`));
          continue;
        }

        // Install plugin
        console.log(chalk.dim(`  Installing ${pluginName}...`));
        await installPlugin(pluginMetadata.repo, pluginName);
        console.log(chalk.green(`  ✓ Installed ${pluginName}`));
      } catch (error: any) {
        console.log(chalk.red(`  ✗ Failed to install "${pluginName}": ${error.message}`));
      }
    }

    console.log();

    // Step 2: Enable all skills
    console.log(chalk.bold('Step 2: Enabling skills...\n'));

    let enabledCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const group of profile.skills) {
      for (const skillName of group.skills) {
        try {
          // Check if already enabled
          if (await isSkillEnabled(skillName)) {
            console.log(chalk.yellow(`  ⊙ Skill "${skillName}" already enabled`));
            skippedCount++;
            continue;
          }

          // Check if plugin is installed
          if (!(await isPluginInstalled(group.plugin))) {
            console.log(
              chalk.red(`  ✗ Cannot enable "${skillName}" - plugin "${group.plugin}" not installed`)
            );
            failedCount++;
            continue;
          }

          // Enable skill
          await enableSkill(group.plugin, skillName);
          enabledCount++;
        } catch (error: any) {
          console.log(chalk.red(`  ✗ Failed to enable "${skillName}": ${error.message}`));
          failedCount++;
        }
      }
    }

    console.log();
    console.log(chalk.bold('Installation complete!\n'));
    console.log(chalk.green(`  ✓ ${enabledCount} skill(s) enabled`));

    if (skippedCount > 0) {
      console.log(chalk.yellow(`  ⊙ ${skippedCount} skill(s) already enabled`));
    }

    if (failedCount > 0) {
      console.log(chalk.red(`  ✗ ${failedCount} skill(s) failed`));
    }

    console.log();
    console.log(chalk.dim('View enabled skills: cepheid skill enabled'));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error installing profile:'), error.message);
    process.exit(1);
  }
}

/**
 * Show what would be installed for a profile (dry run)
 */
export async function previewProfile(name: string) {
  try {
    const profile = await getProfile(name);

    if (!profile) {
      console.log(chalk.red(`Profile "${name}" not found.`));
      console.log(chalk.gray('Use: cepheid profile list'));
      return;
    }

    console.log(chalk.bold(`\nPreview: ${profile.name}\n`));
    console.log(chalk.gray(profile.description));
    console.log();

    const requiredPlugins = getRequiredPlugins(profile);

    console.log(chalk.bold('Plugins to install:\n'));

    for (const pluginName of requiredPlugins) {
      const installed = await isPluginInstalled(pluginName);
      const badge = installed ? chalk.green('✓') : chalk.gray('○');
      console.log(`  ${badge} ${pluginName}`);
    }

    console.log();
    console.log(chalk.bold('Skills to enable:\n'));

    for (const group of profile.skills) {
      console.log(chalk.cyan.bold(`  ${group.plugin}:`));

      for (const skillName of group.skills) {
        const enabled = await isSkillEnabled(skillName);
        const badge = enabled ? chalk.green('✓') : chalk.gray('○');
        console.log(`    ${badge} ${skillName}`);
      }
      console.log();
    }

    const skillCount = getSkillCount(profile);
    console.log(chalk.dim(`Total: ${skillCount} skills from ${requiredPlugins.length} plugin(s)`));
    console.log();
    console.log(chalk.dim(`Install with: cepheid profile install ${name}`));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error previewing profile:'), error.message);
    process.exit(1);
  }
}
