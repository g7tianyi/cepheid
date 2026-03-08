import { readClaudeCodeConfig, writeClaudeCodeConfig } from '../config/manager';
import { loadTemplate } from './templates';

/**
 * Apply a permission template to Claude Code config
 */
export async function applyTemplate(templateName: string): Promise<void> {
  const template = await loadTemplate(templateName);
  if (!template) {
    throw new Error(`Template "${templateName}" not found`);
  }

  let config = await readClaudeCodeConfig();
  if (!config) {
    config = {};
  }

  // Apply permissions
  config.permissions = {
    ...config.permissions,
    autoApprove: template.autoApprove,
  };

  await writeClaudeCodeConfig(config);
}

/**
 * Get current permissions
 */
export async function getCurrentPermissions(): Promise<string[]> {
  const config = await readClaudeCodeConfig();
  return config?.permissions?.autoApprove || [];
}

/**
 * Add permission rule
 */
export async function addPermission(rule: string): Promise<void> {
  let config = await readClaudeCodeConfig();
  if (!config) {
    config = {};
  }

  if (!config.permissions) {
    config.permissions = { autoApprove: [] };
  }

  if (!config.permissions.autoApprove) {
    config.permissions.autoApprove = [];
  }

  if (!config.permissions.autoApprove.includes(rule)) {
    config.permissions.autoApprove.push(rule);
    await writeClaudeCodeConfig(config);
  }
}

/**
 * Remove permission rule
 */
export async function removePermission(rule: string): Promise<void> {
  const config = await readClaudeCodeConfig();
  if (!config?.permissions?.autoApprove) {
    return;
  }

  config.permissions.autoApprove = config.permissions.autoApprove.filter(r => r !== rule);
  await writeClaudeCodeConfig(config);
}

/**
 * Clear all permissions
 */
export async function clearPermissions(): Promise<void> {
  const config = await readClaudeCodeConfig();
  if (!config) {
    return;
  }

  if (config.permissions) {
    config.permissions.autoApprove = [];
    await writeClaudeCodeConfig(config);
  }
}
