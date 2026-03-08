import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { getTemplatesDir } from '../config/paths';

export interface PermissionTemplate {
  name: string;
  description: string;
  autoApprove: string[];
}

/**
 * Load a permission template
 */
export async function loadTemplate(name: string): Promise<PermissionTemplate | null> {
  const templatesDir = getTemplatesDir();
  const templatePath = path.join(templatesDir, `${name}.yaml`);

  try {
    if (await fs.pathExists(templatePath)) {
      const content = await fs.readFile(templatePath, 'utf8');
      return yaml.load(content) as PermissionTemplate;
    }
  } catch (error) {
    console.error(`Error loading template ${name}:`, error);
  }

  return null;
}

/**
 * List available templates
 */
export async function listTemplates(): Promise<string[]> {
  const templatesDir = getTemplatesDir();

  if (!(await fs.pathExists(templatesDir))) {
    return [];
  }

  const files = await fs.readdir(templatesDir);
  return files
    .filter(f => f.endsWith('.yaml'))
    .map(f => path.basename(f, '.yaml'))
    .sort();
}

/**
 * Get template metadata
 */
export async function getTemplateInfo(name: string): Promise<PermissionTemplate | null> {
  return await loadTemplate(name);
}

/**
 * Create custom template from current settings
 */
export async function createCustomTemplate(
  name: string,
  description: string,
  autoApprove: string[]
): Promise<void> {
  const templatesDir = getTemplatesDir();
  await fs.ensureDir(templatesDir);

  const template: PermissionTemplate = {
    name,
    description,
    autoApprove,
  };

  const templatePath = path.join(templatesDir, `${name}.yaml`);
  await fs.writeFile(templatePath, yaml.dump(template), 'utf8');
}
