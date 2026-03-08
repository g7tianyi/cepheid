import chalk from 'chalk';
import {
  installPlugin,
  uninstallPlugin,
  listInstalledPlugins,
  updatePlugin,
  isPluginInstalled,
  getPluginInfo,
  linkPlugin,
  unlinkPlugin,
} from '../plugins/installer';
import {
  loadPluginsRegistry,
  searchPluginsRegistry,
  getPluginsByCategory,
  renderStars,
} from '../plugins/registry';

export async function installPlugins(repos: string[]) {
  try {
    console.log(chalk.bold(`\nInstalling ${repos.length} plugin(s)...\n`));

    for (const repo of repos) {
      try {
        await installPlugin(repo);
        console.log(chalk.green(`✓ Installed plugin from ${repo}`));
      } catch (error: any) {
        console.log(chalk.red(`✗ Failed to install ${repo}: ${error.message}`));
      }
    }

    console.log(chalk.bold('\nDone!\n'));
  } catch (error: any) {
    console.error(chalk.red('Error installing plugins:'), error.message);
    process.exit(1);
  }
}

export async function uninstallPlugins(plugins: string[]) {
  try {
    console.log(chalk.bold(`\nUninstalling ${plugins.length} plugin(s)...\n`));

    for (const pluginName of plugins) {
      try {
        await uninstallPlugin(pluginName);
        console.log(chalk.green(`✓ Uninstalled ${pluginName}`));
      } catch (error: any) {
        console.log(chalk.red(`✗ Failed to uninstall ${pluginName}: ${error.message}`));
      }
    }

    console.log(chalk.bold('\nDone!\n'));
  } catch (error: any) {
    console.error(chalk.red('Error uninstalling plugins:'), error.message);
    process.exit(1);
  }
}

export async function listPlugins(options?: { category?: string; installed?: boolean }) {
  try {
    let availablePlugins = await loadPluginsRegistry();

    if (options?.category) {
      availablePlugins = await getPluginsByCategory(options.category);
    }

    if (options?.installed) {
      // Show only installed plugins
      const installedList = await listInstalledPlugins();
      const installedNames = installedList.map(p => p.name);
      availablePlugins = availablePlugins.filter(p => installedNames.includes(p.name));

      if (availablePlugins.length === 0) {
        console.log(chalk.yellow('No plugins installed.'));
        console.log(chalk.gray('Install plugins with: cepheid plugin install <name>'));
        return;
      }
    }

    if (availablePlugins.length === 0) {
      console.log(chalk.yellow('No plugins found in registry.'));
      return;
    }

    console.log(chalk.bold('\nAvailable Plugins:\n'));

    // Group by category
    const byCategory: Record<string, typeof availablePlugins> = {};
    availablePlugins.forEach(plugin => {
      if (!byCategory[plugin.category]) {
        byCategory[plugin.category] = [];
      }
      byCategory[plugin.category].push(plugin);
    });

    for (const [category, plugins] of Object.entries(byCategory)) {
      console.log(chalk.cyan.bold(`${category}:`));

      for (const plugin of plugins) {
        const installed = await isPluginInstalled(plugin.name);
        const badge = installed ? chalk.green('✓') : chalk.gray('○');
        const stars = chalk.yellow(renderStars(plugin.stars));

        console.log(`  ${badge} ${chalk.bold(plugin.name)} ${stars}`);
        console.log(`    ${plugin.description}`);
        console.log(`    ${chalk.gray('by')} ${plugin.author} ${chalk.gray('•')} ${chalk.gray(plugin.repo)}`);
        console.log();
      }
    }

    console.log(chalk.gray('Install with: cepheid plugin install <name>'));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error listing plugins:'), error.message);
    process.exit(1);
  }
}

export async function updatePlugins(plugins: string[]) {
  try {
    let pluginsToUpdate = plugins;

    if (pluginsToUpdate.length === 0) {
      // Update all installed plugins
      const installed = await listInstalledPlugins();
      pluginsToUpdate = installed.map(p => p.name);
    }

    if (pluginsToUpdate.length === 0) {
      console.log(chalk.yellow('No plugins to update.'));
      return;
    }

    console.log(chalk.bold(`\nUpdating ${pluginsToUpdate.length} plugin(s)...\n`));

    for (const pluginName of pluginsToUpdate) {
      try {
        await updatePlugin(pluginName);
        console.log(chalk.green(`✓ Updated ${pluginName}`));
      } catch (error: any) {
        console.log(chalk.red(`✗ Failed to update ${pluginName}: ${error.message}`));
      }
    }

    console.log(chalk.bold('\nDone!\n'));
  } catch (error: any) {
    console.error(chalk.red('Error updating plugins:'), error.message);
    process.exit(1);
  }
}

export async function showPluginInfo(pluginName: string) {
  try {
    const plugin = await getPluginInfo(pluginName);

    if (!plugin) {
      console.log(chalk.red(`Plugin "${pluginName}" is not installed.`));
      return;
    }

    console.log(chalk.bold(`\n${plugin.name}`));
    console.log(chalk.gray('='.repeat(plugin.name.length)));
    console.log();
    console.log(`${chalk.bold('Repository:')} ${plugin.repo}`);
    console.log(`${chalk.bold('Path:')} ${plugin.path}`);
    console.log(`${chalk.bold('Installed:')} ${chalk.green('Yes')}`);
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error showing plugin info:'), error.message);
    process.exit(1);
  }
}

export async function linkPluginToClaudeCode(pluginName: string) {
  try {
    console.log(chalk.bold(`\nLinking ${pluginName} to Claude Code...\n`));

    await linkPlugin(pluginName);

    console.log(chalk.green(`✓ Linked ${pluginName} to ~/plugins/${pluginName}`));
    console.log(chalk.gray('Claude Code should now be able to load this plugin.'));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error linking plugin:'), error.message);
    process.exit(1);
  }
}

export async function unlinkPluginFromClaudeCode(pluginName: string) {
  try {
    console.log(chalk.bold(`\nUnlinking ${pluginName} from Claude Code...\n`));

    await unlinkPlugin(pluginName);

    console.log(chalk.green(`✓ Unlinked ${pluginName}`));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error unlinking plugin:'), error.message);
    process.exit(1);
  }
}
