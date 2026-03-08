#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as skillCommands from './commands/skills';
import * as permissionCommands from './commands/permissions';
import * as backupCommands from './commands/backup';

const program = new Command();

program
  .name('cepheid')
  .description('CLI tool to manage Claude Code settings, permissions, and skills')
  .version('0.1.0');

// Skills commands
const skills = program.command('skills').description('Manage Claude Code skills');

skills
  .command('list')
  .description('List available skills')
  .option('-c, --category <category>', 'Filter by category')
  .action(skillCommands.listSkills);

skills
  .command('search <query>')
  .description('Search for skills')
  .action(skillCommands.searchSkills);

skills
  .command('info <name>')
  .description('Show detailed information about a skill')
  .action(skillCommands.showSkillInfo);

skills
  .command('categories')
  .description('List all skill categories')
  .action(skillCommands.listCategories);

skills
  .command('add <name> <url>')
  .description('Add a custom skill from URL')
  .action(skillCommands.addCustomSkill);

skills
  .command('update-registry')
  .description('Update the skill registry cache')
  .action(skillCommands.updateRegistryCache);

// Install command (top-level for convenience)
program
  .command('install <skills...>')
  .description('Install one or more skills')
  .action(skillCommands.installSkills);

program
  .command('uninstall <skills...>')
  .description('Uninstall one or more skills')
  .action(skillCommands.uninstallSkills);

program
  .command('installed')
  .description('List installed skills')
  .action(skillCommands.listInstalledSkills);

program
  .command('update [skills...]')
  .description('Update installed skills (or all if no skill specified)')
  .action(skillCommands.updateSkills);

// Permissions commands
const permissions = program
  .command('permissions')
  .alias('perms')
  .description('Manage Claude Code permissions');

permissions
  .command('list')
  .description('List available permission templates')
  .action(permissionCommands.listTemplates);

permissions
  .command('show [template]')
  .description('Show current permissions or a specific template')
  .action(permissionCommands.showPermissions);

permissions
  .command('apply <template>')
  .description('Apply a permission template')
  .action(permissionCommands.applyTemplate);

permissions
  .command('add <rule>')
  .description('Add a permission rule')
  .action(permissionCommands.addPermission);

permissions
  .command('remove <rule>')
  .description('Remove a permission rule')
  .action(permissionCommands.removePermission);

permissions
  .command('export <name>')
  .description('Export current permissions as a template')
  .action(permissionCommands.exportTemplate);

// Backup commands
const backup = program.command('backup').description('Backup and restore settings');

backup
  .command('save <name>')
  .description('Save current settings to a backup')
  .action(backupCommands.saveBackup);

backup
  .command('restore <name>')
  .description('Restore settings from a backup')
  .action(backupCommands.restoreBackup);

backup
  .command('list')
  .description('List all available backups')
  .action(backupCommands.listBackups);

// Error handling
program.exitOverride();

try {
  program.parse(process.argv);
} catch (error: any) {
  if (error.code !== 'commander.help' && error.code !== 'commander.version') {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

// Show help if no command specified
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
