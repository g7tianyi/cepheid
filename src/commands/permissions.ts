import chalk from 'chalk';
import {
  listTemplates as listTemplatesRegistry,
  getTemplateInfo,
  createCustomTemplate,
} from '../permissions/templates';
import {
  applyTemplate as applyTemplateAction,
  getCurrentPermissions,
  addPermission as addPermissionAction,
  removePermission as removePermissionAction,
} from '../permissions/applier';
import { readCepheidConfig, writeCepheidConfig } from '../config/manager';

export async function listTemplates() {
  try {
    const templates = await listTemplatesRegistry();

    if (templates.length === 0) {
      console.log(chalk.yellow('No permission templates found.'));
      return;
    }

    const config = await readCepheidConfig();
    const current = config.currentTemplate;

    console.log(chalk.bold('\nAvailable Permission Templates:\n'));

    for (const templateName of templates) {
      const info = await getTemplateInfo(templateName);
      const isCurrent = templateName === current;
      const badge = isCurrent ? chalk.green('✓') : chalk.gray('○');

      if (info) {
        console.log(`  ${badge} ${chalk.bold(templateName)} - ${info.description}`);
      } else {
        console.log(`  ${badge} ${chalk.bold(templateName)}`);
      }
    }

    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error listing templates:'), error.message);
    process.exit(1);
  }
}

export async function showPermissions(templateName?: string) {
  try {
    if (templateName) {
      // Show specific template
      const template = await getTemplateInfo(templateName);
      if (!template) {
        console.log(chalk.red(`Template "${templateName}" not found.`));
        return;
      }

      console.log(chalk.bold(`\n${template.name}`));
      console.log(chalk.gray('='.repeat(template.name.length)));
      console.log(`\n${template.description}\n`);
      console.log(chalk.bold('Auto-approve rules:'));
      template.autoApprove.forEach(rule => console.log(`  • ${rule}`));
      console.log();
    } else {
      // Show current permissions
      const permissions = await getCurrentPermissions();

      if (permissions.length === 0) {
        console.log(chalk.yellow('No auto-approve permissions configured.'));
        return;
      }

      const config = await readCepheidConfig();
      console.log(
        chalk.bold(`\nCurrent Permissions (template: ${chalk.cyan(config.currentTemplate)}):\n`)
      );
      permissions.forEach(rule => console.log(`  • ${rule}`));
      console.log();
    }
  } catch (error: any) {
    console.error(chalk.red('Error showing permissions:'), error.message);
    process.exit(1);
  }
}

export async function applyTemplate(templateName: string) {
  try {
    await applyTemplateAction(templateName);

    const config = await readCepheidConfig();
    config.currentTemplate = templateName;
    await writeCepheidConfig(config);

    console.log(chalk.green(`✓ Applied permission template: ${templateName}`));
  } catch (error: any) {
    console.error(chalk.red('Error applying template:'), error.message);
    process.exit(1);
  }
}

export async function addPermission(rule: string) {
  try {
    await addPermissionAction(rule);
    console.log(chalk.green(`✓ Added permission rule: ${rule}`));
  } catch (error: any) {
    console.error(chalk.red('Error adding permission:'), error.message);
    process.exit(1);
  }
}

export async function removePermission(rule: string) {
  try {
    await removePermissionAction(rule);
    console.log(chalk.green(`✓ Removed permission rule: ${rule}`));
  } catch (error: any) {
    console.error(chalk.red('Error removing permission:'), error.message);
    process.exit(1);
  }
}

export async function exportTemplate(name: string) {
  try {
    const permissions = await getCurrentPermissions();

    if (permissions.length === 0) {
      console.log(chalk.yellow('No permissions to export.'));
      return;
    }

    await createCustomTemplate(name, `Custom template: ${name}`, permissions);

    console.log(chalk.green(`✓ Exported current permissions as template: ${name}`));
  } catch (error: any) {
    console.error(chalk.red('Error exporting template:'), error.message);
    process.exit(1);
  }
}
