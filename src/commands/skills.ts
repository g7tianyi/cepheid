import chalk from 'chalk';
import {
  listAvailableSkills,
  searchSkills as searchSkillsRegistry,
  getSkillSource,
  getCategories as getCategoriesRegistry,
  getSkillsByCategory,
  updateRegistry,
} from '../skills/registry';
import {
  installSkill,
  uninstallSkill,
  listInstalledSkills as listInstalled,
  updateSkill,
  isSkillInstalled,
  addSkill,
} from '../skills/installer';

export async function listSkills(options: { category?: string }) {
  try {
    let skills = await listAvailableSkills();

    if (options.category) {
      skills = await getSkillsByCategory(options.category);
    }

    if (skills.length === 0) {
      console.log(chalk.yellow('No skills found in registry.'));
      console.log(chalk.gray('Tip: Install skills from URLs with: cepheid install <url>'));
      return;
    }

    console.log(chalk.bold('\nAvailable Skills:\n'));

    const byCategory: Record<string, typeof skills> = {};
    skills.forEach(skill => {
      const category = skill.metadata?.category || 'uncategorized';
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(skill);
    });

    for (const [category, categorySkills] of Object.entries(byCategory)) {
      console.log(chalk.cyan.bold(`\n${category}:`));
      for (const skill of categorySkills) {
        const installed = await isSkillInstalled(skill.name);
        const badge = installed ? chalk.green('✓') : chalk.gray('○');
        const description = skill.metadata?.description || 'No description';
        console.log(`  ${badge} ${chalk.bold(skill.name)} - ${description}`);
      }
    }

    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error listing skills:'), error.message);
    process.exit(1);
  }
}

export async function searchSkills(query: string) {
  try {
    const skills = await searchSkillsRegistry(query);

    if (skills.length === 0) {
      console.log(chalk.yellow(`No skills found matching "${query}".`));
      return;
    }

    console.log(chalk.bold(`\nSkills matching "${query}":\n`));

    for (const skill of skills) {
      const installed = await isSkillInstalled(skill.name);
      const badge = installed ? chalk.green('✓') : chalk.gray('○');
      const category = skill.metadata?.category || 'uncategorized';
      const description = skill.metadata?.description || 'No description';
      console.log(
        `  ${badge} ${chalk.bold(skill.name)} (${category}) - ${description}`
      );
    }

    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error searching skills:'), error.message);
    process.exit(1);
  }
}

export async function showSkillInfo(name: string) {
  try {
    const skill = await getSkillSource(name);

    if (!skill) {
      console.log(chalk.red(`Skill "${name}" not found in registry.`));
      console.log(chalk.gray('Tip: Install from URL with: cepheid install <url>'));
      return;
    }

    const installed = await isSkillInstalled(name);

    console.log(chalk.bold(`\n${skill.name}`));
    console.log(chalk.gray('='.repeat(skill.name.length)));
    console.log();

    if (skill.metadata) {
      const { description, category, version, author, tags } = skill.metadata;
      console.log(`${chalk.bold('Description:')} ${description}`);
      console.log(`${chalk.bold('Category:')} ${category}`);
      console.log(`${chalk.bold('Version:')} ${version}`);
      if (author) {
        console.log(`${chalk.bold('Author:')} ${author}`);
      }
      if (tags && tags.length > 0) {
        console.log(`${chalk.bold('Tags:')} ${tags.join(', ')}`);
      }
    }

    console.log(`${chalk.bold('URL:')} ${skill.url}`);
    console.log(`${chalk.bold('Installed:')} ${installed ? chalk.green('Yes') : chalk.gray('No')}`);
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error showing skill info:'), error.message);
    process.exit(1);
  }
}

export async function listCategories() {
  try {
    const categories = await getCategoriesRegistry();

    if (categories.length === 0) {
      console.log(chalk.yellow('No categories found.'));
      return;
    }

    console.log(chalk.bold('\nSkill Categories:\n'));
    categories.forEach(cat => console.log(`  • ${cat}`));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error listing categories:'), error.message);
    process.exit(1);
  }
}

export async function installSkills(skills: string[]) {
  try {
    console.log(chalk.bold(`\nInstalling ${skills.length} skill(s)...\n`));

    for (const skillName of skills) {
      try {
        await installSkill(skillName);
        console.log(chalk.green(`✓ Installed ${skillName}`));
      } catch (error: any) {
        console.log(chalk.red(`✗ Failed to install ${skillName}: ${error.message}`));
      }
    }

    console.log(chalk.bold('\nDone!\n'));
  } catch (error: any) {
    console.error(chalk.red('Error installing skills:'), error.message);
    process.exit(1);
  }
}

export async function uninstallSkills(skills: string[]) {
  try {
    console.log(chalk.bold(`\nUninstalling ${skills.length} skill(s)...\n`));

    for (const skillName of skills) {
      try {
        await uninstallSkill(skillName);
        console.log(chalk.green(`✓ Uninstalled ${skillName}`));
      } catch (error: any) {
        console.log(chalk.red(`✗ Failed to uninstall ${skillName}: ${error.message}`));
      }
    }

    console.log(chalk.bold('\nDone!\n'));
  } catch (error: any) {
    console.error(chalk.red('Error uninstalling skills:'), error.message);
    process.exit(1);
  }
}

export async function listInstalledSkills() {
  try {
    const skills = await listInstalled();

    if (skills.length === 0) {
      console.log(chalk.yellow('No skills installed.'));
      console.log(chalk.gray('Install skills with: cepheid install <name-or-url>'));
      return;
    }

    console.log(chalk.bold('\nInstalled Skills:\n'));
    skills.forEach(skill => console.log(`  ${chalk.green('✓')} ${skill}`));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error listing installed skills:'), error.message);
    process.exit(1);
  }
}

export async function updateSkills(skills: string[]) {
  try {
    let skillsToUpdate = skills;

    if (skillsToUpdate.length === 0) {
      // Update all installed skills
      skillsToUpdate = await listInstalled();
    }

    if (skillsToUpdate.length === 0) {
      console.log(chalk.yellow('No skills to update.'));
      return;
    }

    console.log(chalk.bold(`\nUpdating ${skillsToUpdate.length} skill(s)...\n`));

    for (const skillName of skillsToUpdate) {
      try {
        await updateSkill(skillName);
        console.log(chalk.green(`✓ Updated ${skillName}`));
      } catch (error: any) {
        console.log(chalk.red(`✗ Failed to update ${skillName}: ${error.message}`));
      }
    }

    console.log(chalk.bold('\nDone!\n'));
  } catch (error: any) {
    console.error(chalk.red('Error updating skills:'), error.message);
    process.exit(1);
  }
}

export async function addCustomSkill(name: string, url: string) {
  try {
    console.log(chalk.bold(`\nAdding custom skill "${name}" from ${url}...\n`));

    await addSkill(name, url);

    console.log(chalk.green(`✓ Added custom skill: ${name}`));
    console.log(chalk.gray(`Installed to: ~/.config/cepheid/installed-skills/${name}.md`));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error adding custom skill:'), error.message);
    process.exit(1);
  }
}

export async function updateRegistryCache() {
  try {
    console.log(chalk.bold('\nUpdating skill registry...\n'));

    await updateRegistry();

    console.log(chalk.green('✓ Registry updated'));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error updating registry:'), error.message);
    process.exit(1);
  }
}
