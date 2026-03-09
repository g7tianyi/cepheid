import * as os from 'os';
import * as path from 'path';

/**
 * Get platform-specific configuration directory
 */
export function getConfigDir(): string {
  const homeDir = os.homedir();
  const platform = os.platform();

  switch (platform) {
    case 'darwin':
    case 'linux':
      return path.join(homeDir, '.config', 'cepheid');
    case 'win32':
      return path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'cepheid');
    default:
      return path.join(homeDir, '.cepheid');
  }
}

/**
 * Get Claude Code configuration directory
 */
export function getClaudeCodeConfigDir(): string {
  const homeDir = os.homedir();
  const platform = os.platform();

  switch (platform) {
    case 'darwin':
    case 'linux':
      return path.join(homeDir, '.claude');
    case 'win32':
      return path.join(homeDir, '.claude');
    default:
      return path.join(homeDir, '.claude');
  }
}

/**
 * Get Claude Code plugins directory
 */
export function getClaudeCodePluginsDir(): string {
  const homeDir = os.homedir();
  const platform = os.platform();

  switch (platform) {
    case 'darwin':
    case 'linux':
      return path.join(homeDir, 'plugins');
    case 'win32':
      return path.join(homeDir, 'plugins');
    default:
      return path.join(homeDir, 'plugins');
  }
}

/**
 * Get backups directory
 */
export function getBackupsDir(): string {
  return path.join(getConfigDir(), 'backups');
}

/**
 * Get skills installation directory
 */
export function getSkillsDir(): string {
  return path.join(getConfigDir(), 'installed-skills');
}

/**
 * Get plugins installation directory
 */
export function getPluginsDir(): string {
  return path.join(getConfigDir(), 'plugins');
}

/**
 * Get bundled skills directory (from package)
 */
export function getBundledSkillsDir(): string {
  // Assuming we're running from dist/ after build
  return path.join(__dirname, '..', '..', 'skills');
}

/**
 * Get templates directory (from package)
 */
export function getTemplatesDir(): string {
  return path.join(__dirname, '..', '..', 'templates');
}
