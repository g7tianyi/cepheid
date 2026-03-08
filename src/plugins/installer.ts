import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getPluginsDir, getClaudeCodePluginsDir } from '../config/paths';
import { readCepheidConfig, writeCepheidConfig } from '../config/manager';

const execAsync = promisify(exec);

export interface PluginInfo {
  name: string;
  repo: string;
  installed: boolean;
  path?: string;
}

/**
 * Parse GitHub repo URL
 */
export function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  // Match: https://github.com/owner/repo
  const httpsPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
  // Match: git@github.com:owner/repo.git
  const sshPattern = /github\.com:([^\/]+)\/([^\/]+)/;

  const httpsMatch = url.match(httpsPattern);
  const sshMatch = url.match(sshPattern);

  const match = httpsMatch || sshMatch;
  if (!match) return null;

  let repo = match[2];
  // Remove .git extension if present
  repo = repo.replace(/\.git$/, '');

  return {
    owner: match[1],
    repo
  };
}

/**
 * Install a plugin from GitHub repository
 */
export async function installPlugin(repoUrl: string, targetDir?: string): Promise<void> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) {
    throw new Error(`Invalid GitHub repository URL: ${repoUrl}`);
  }

  const { owner, repo } = parsed;
  const pluginName = targetDir || repo;

  // Use Cepheid's plugins directory
  const pluginsDir = getPluginsDir();
  await fs.ensureDir(pluginsDir);

  const installPath = path.join(pluginsDir, pluginName);

  // Check if already installed
  if (await fs.pathExists(installPath)) {
    throw new Error(`Plugin "${pluginName}" is already installed at ${installPath}`);
  }

  // Clone the repository
  try {
    const cloneUrl = `https://github.com/${owner}/${repo}.git`;
    await execAsync(`git clone ${cloneUrl} "${installPath}"`);
  } catch (error: any) {
    throw new Error(`Failed to clone repository: ${error.message}`);
  }

  // Update config
  const config = await readCepheidConfig();
  if (!config.installedPlugins) {
    config.installedPlugins = [];
  }

  config.installedPlugins.push({
    name: pluginName,
    repo: repoUrl,
    path: installPath
  });

  await writeCepheidConfig(config);
}

/**
 * Uninstall a plugin
 */
export async function uninstallPlugin(pluginName: string): Promise<void> {
  const config = await readCepheidConfig();
  const plugin = config.installedPlugins?.find(p => p.name === pluginName);

  if (!plugin) {
    throw new Error(`Plugin "${pluginName}" is not installed`);
  }

  // Remove plugin directory
  if (plugin.path && await fs.pathExists(plugin.path)) {
    await fs.remove(plugin.path);
  }

  // Update config
  config.installedPlugins = config.installedPlugins?.filter(p => p.name !== pluginName) || [];
  await writeCepheidConfig(config);
}

/**
 * List installed plugins
 */
export async function listInstalledPlugins(): Promise<PluginInfo[]> {
  const config = await readCepheidConfig();
  return (config.installedPlugins || []).map(p => ({
    ...p,
    installed: true
  }));
}

/**
 * Check if a plugin is installed
 */
export async function isPluginInstalled(pluginName: string): Promise<boolean> {
  const config = await readCepheidConfig();
  return (config.installedPlugins || []).some(p => p.name === pluginName);
}

/**
 * Update a plugin (git pull)
 */
export async function updatePlugin(pluginName: string): Promise<void> {
  const config = await readCepheidConfig();
  const plugin = config.installedPlugins?.find(p => p.name === pluginName);

  if (!plugin) {
    throw new Error(`Plugin "${pluginName}" is not installed`);
  }

  if (!plugin.path || !(await fs.pathExists(plugin.path))) {
    throw new Error(`Plugin path not found: ${plugin.path}`);
  }

  // Git pull to update
  try {
    await execAsync(`cd "${plugin.path}" && git pull`);
  } catch (error: any) {
    throw new Error(`Failed to update plugin: ${error.message}`);
  }
}

/**
 * Get plugin info
 */
export async function getPluginInfo(pluginName: string): Promise<PluginInfo | null> {
  const config = await readCepheidConfig();
  const plugin = config.installedPlugins?.find(p => p.name === pluginName);

  if (!plugin) {
    return null;
  }

  return {
    ...plugin,
    installed: true
  };
}

/**
 * Link plugin to Claude Code plugins directory
 */
export async function linkPlugin(pluginName: string): Promise<void> {
  const config = await readCepheidConfig();
  const plugin = config.installedPlugins?.find(p => p.name === pluginName);

  if (!plugin || !plugin.path) {
    throw new Error(`Plugin "${pluginName}" is not installed`);
  }

  const claudePluginsDir = getClaudeCodePluginsDir();
  await fs.ensureDir(claudePluginsDir);

  const linkPath = path.join(claudePluginsDir, pluginName);

  // Create symlink
  try {
    // Check if link already exists
    if (await fs.pathExists(linkPath)) {
      const stats = await fs.lstat(linkPath);
      if (stats.isSymbolicLink()) {
        // Remove old symlink
        await fs.unlink(linkPath);
      } else {
        throw new Error(`Path already exists and is not a symlink: ${linkPath}`);
      }
    }

    await fs.symlink(plugin.path, linkPath, 'dir');
  } catch (error: any) {
    throw new Error(`Failed to create symlink: ${error.message}`);
  }
}

/**
 * Unlink plugin from Claude Code plugins directory
 */
export async function unlinkPlugin(pluginName: string): Promise<void> {
  const claudePluginsDir = getClaudeCodePluginsDir();
  const linkPath = path.join(claudePluginsDir, pluginName);

  if (await fs.pathExists(linkPath)) {
    const stats = await fs.lstat(linkPath);
    if (stats.isSymbolicLink()) {
      await fs.unlink(linkPath);
    }
  }
}
