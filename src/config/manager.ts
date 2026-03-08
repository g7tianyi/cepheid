import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { getClaudeCodeConfigDir, getConfigDir, getBackupsDir } from './paths';

export interface ClaudeCodeConfig {
  permissions?: {
    autoApprove?: string[];
  };
  [key: string]: any;
}

export interface PluginRecord {
  name: string;
  repo: string;
  path: string;
}

export interface CepheidConfig {
  installedSkills: string[];
  installedPlugins?: PluginRecord[];
  currentTemplate: string;
  lastBackup?: string;
}

/**
 * Read Claude Code configuration
 */
export async function readClaudeCodeConfig(): Promise<ClaudeCodeConfig | null> {
  const configDir = getClaudeCodeConfigDir();
  const configPath = path.join(configDir, 'config.json');

  try {
    if (await fs.pathExists(configPath)) {
      return await fs.readJson(configPath);
    }
    // Try YAML format
    const yamlPath = path.join(configDir, 'config.yaml');
    if (await fs.pathExists(yamlPath)) {
      const content = await fs.readFile(yamlPath, 'utf8');
      return yaml.load(content) as ClaudeCodeConfig;
    }
  } catch (error) {
    console.error('Error reading Claude Code config:', error);
  }

  return null;
}

/**
 * Write Claude Code configuration
 */
export async function writeClaudeCodeConfig(config: ClaudeCodeConfig): Promise<void> {
  const configDir = getClaudeCodeConfigDir();
  await fs.ensureDir(configDir);

  const configPath = path.join(configDir, 'config.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * Read Cepheid's own configuration
 */
export async function readCepheidConfig(): Promise<CepheidConfig> {
  const configDir = getConfigDir();
  const configPath = path.join(configDir, 'config.json');

  try {
    if (await fs.pathExists(configPath)) {
      return await fs.readJson(configPath);
    }
  } catch (error) {
    console.error('Error reading Cepheid config:', error);
  }

  return {
    installedSkills: [],
    currentTemplate: 'balanced',
  };
}

/**
 * Write Cepheid configuration
 */
export async function writeCepheidConfig(config: CepheidConfig): Promise<void> {
  const configDir = getConfigDir();
  await fs.ensureDir(configDir);

  const configPath = path.join(configDir, 'config.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * Backup current Claude Code configuration
 */
export async function backupConfig(name: string): Promise<string> {
  const config = await readClaudeCodeConfig();
  if (!config) {
    throw new Error('No Claude Code configuration found to backup');
  }

  const backupsDir = getBackupsDir();
  await fs.ensureDir(backupsDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${name}-${timestamp}.json`;
  const backupPath = path.join(backupsDir, backupName);

  await fs.writeJson(backupPath, config, { spaces: 2 });

  // Update Cepheid config
  const cepheidConfig = await readCepheidConfig();
  cepheidConfig.lastBackup = backupName;
  await writeCepheidConfig(cepheidConfig);

  return backupPath;
}

/**
 * Restore Claude Code configuration from backup
 */
export async function restoreConfig(name: string): Promise<void> {
  const backupsDir = getBackupsDir();
  const files = await fs.readdir(backupsDir);

  // Find backup file matching name
  const backupFile = files.find(f => f.startsWith(name));
  if (!backupFile) {
    throw new Error(`Backup "${name}" not found`);
  }

  const backupPath = path.join(backupsDir, backupFile);
  const config = await fs.readJson(backupPath);

  await writeClaudeCodeConfig(config);
}

/**
 * List all available backups
 */
export async function listBackups(): Promise<string[]> {
  const backupsDir = getBackupsDir();

  if (!(await fs.pathExists(backupsDir))) {
    return [];
  }

  const files = await fs.readdir(backupsDir);
  return files.filter(f => f.endsWith('.json')).sort().reverse();
}
