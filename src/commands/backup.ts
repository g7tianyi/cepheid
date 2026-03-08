import chalk from 'chalk';
import {
  backupConfig,
  restoreConfig,
  listBackups as listBackupsAction,
} from '../config/manager';

export async function saveBackup(name: string) {
  try {
    const backupPath = await backupConfig(name);
    console.log(chalk.green(`✓ Backup saved: ${backupPath}`));
  } catch (error: any) {
    console.error(chalk.red('Error saving backup:'), error.message);
    process.exit(1);
  }
}

export async function restoreBackup(name: string) {
  try {
    await restoreConfig(name);
    console.log(chalk.green(`✓ Restored backup: ${name}`));
  } catch (error: any) {
    console.error(chalk.red('Error restoring backup:'), error.message);
    process.exit(1);
  }
}

export async function listBackups() {
  try {
    const backups = await listBackupsAction();

    if (backups.length === 0) {
      console.log(chalk.yellow('No backups found.'));
      return;
    }

    console.log(chalk.bold('\nAvailable Backups:\n'));
    backups.forEach(backup => console.log(`  • ${backup}`));
    console.log();
  } catch (error: any) {
    console.error(chalk.red('Error listing backups:'), error.message);
    process.exit(1);
  }
}
