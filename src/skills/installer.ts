import * as fs from 'fs-extra';
import * as path from 'path';
import * as https from 'https';
import { getSkillsDir } from '../config/paths';
import { readCepheidConfig, writeCepheidConfig } from '../config/manager';
import { getSkillSource, parseGitHubUrl, addCustomSkillSource, SkillSource } from './registry';

/**
 * Fetch content from URL
 */
async function fetchContent(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        if (res.headers.location) {
          fetchContent(res.headers.location).then(resolve).catch(reject);
          return;
        }
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch: ${res.statusCode} ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Download skill content from URL
 */
async function downloadSkill(url: string): Promise<string> {
  // Parse GitHub URL if needed
  const rawUrl = parseGitHubUrl(url) || url;

  try {
    const content = await fetchContent(rawUrl);
    return content;
  } catch (error: any) {
    throw new Error(`Failed to download skill from ${url}: ${error.message}`);
  }
}

/**
 * Install a skill from registry
 */
export async function installSkill(skillName: string): Promise<void> {
  // Check if it's a URL
  if (skillName.startsWith('http://') || skillName.startsWith('https://')) {
    await installSkillFromUrl(skillName, extractSkillName(skillName));
    return;
  }

  // Get skill from registry
  const skillSource = await getSkillSource(skillName);
  if (!skillSource) {
    throw new Error(`Skill "${skillName}" not found in registry. Use a URL to install custom skills.`);
  }

  // Download and install
  await installSkillFromUrl(skillSource.url, skillName);
}

/**
 * Install a skill from a direct URL
 */
export async function installSkillFromUrl(url: string, skillName?: string): Promise<void> {
  const name = skillName || extractSkillName(url);

  // Download skill content
  const content = await downloadSkill(url);

  // Create installation directory
  const installDir = getSkillsDir();
  await fs.ensureDir(installDir);

  // Save skill file
  const skillFileName = `${name}.md`;
  const installPath = path.join(installDir, skillFileName);
  await fs.writeFile(installPath, content, 'utf8');

  // Update Cepheid config
  const config = await readCepheidConfig();
  if (!config.installedSkills.includes(name)) {
    config.installedSkills.push(name);
    await writeCepheidConfig(config);
  }

  // Add to custom skills if not from registry
  const skillSource = await getSkillSource(name);
  if (!skillSource) {
    await addCustomSkillSource({
      name,
      url,
      type: url.includes('github.com') ? 'github' : 'url',
    });
  }
}

/**
 * Extract skill name from URL
 */
function extractSkillName(url: string): string {
  // Extract filename without extension
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace(/\.(md|txt)$/, '');
}

/**
 * Uninstall a skill
 */
export async function uninstallSkill(skillName: string): Promise<void> {
  const installDir = getSkillsDir();
  const skillFileName = `${skillName}.md`;
  const installPath = path.join(installDir, skillFileName);

  // Remove skill file
  if (await fs.pathExists(installPath)) {
    await fs.remove(installPath);
  }

  // Update Cepheid config
  const config = await readCepheidConfig();
  config.installedSkills = config.installedSkills.filter(s => s !== skillName);
  await writeCepheidConfig(config);
}

/**
 * Check if a skill is installed
 */
export async function isSkillInstalled(skillName: string): Promise<boolean> {
  const config = await readCepheidConfig();
  return config.installedSkills.includes(skillName);
}

/**
 * List installed skills
 */
export async function listInstalledSkills(): Promise<string[]> {
  const config = await readCepheidConfig();
  return config.installedSkills;
}

/**
 * Update a skill (reinstall with latest version)
 */
export async function updateSkill(skillName: string): Promise<void> {
  // Get skill source
  const skillSource = await getSkillSource(skillName);
  if (!skillSource) {
    throw new Error(`Skill "${skillName}" not found in registry. Cannot update.`);
  }

  // Reinstall
  await uninstallSkill(skillName);
  await installSkill(skillName);
}

/**
 * Install multiple skills
 */
export async function installMultipleSkills(skillNames: string[]): Promise<void> {
  for (const skillName of skillNames) {
    await installSkill(skillName);
  }
}

/**
 * Add a custom skill by name and URL
 */
export async function addSkill(name: string, url: string): Promise<void> {
  await installSkillFromUrl(url, name);
}
