import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { getConfigDir } from '../config/paths';

export interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  category: string;
  author?: string;
  tags?: string[];
  keywords?: string[];
}

export interface SkillSource {
  name: string;
  url: string;
  type: 'github' | 'url' | 'registry';
  metadata?: SkillMetadata;
}

export interface Skill {
  metadata: SkillMetadata;
  content: string;
  source: string;
}

/**
 * Default registry URL (can be overridden)
 */
const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/claude-code-community/cepheid-skills/main/registry.json';

/**
 * Get registry URL from config or use default
 */
async function getRegistryUrl(): Promise<string> {
  const configDir = getConfigDir();
  const registryConfigPath = path.join(configDir, 'registry.json');

  try {
    if (await fs.pathExists(registryConfigPath)) {
      const config = await fs.readJson(registryConfigPath);
      return config.registryUrl || DEFAULT_REGISTRY_URL;
    }
  } catch (error) {
    // Use default if config is invalid
  }

  return DEFAULT_REGISTRY_URL;
}

/**
 * Get path to bundled skills registry
 */
function getSkillsRegistryPath(): string {
  // For CommonJS (TypeScript compiles to this)
  // __dirname is the directory of the compiled JS file in dist/
  // We need to go up to the project root, then into registry/
  return path.join(__dirname, '../../registry/skills.json');
}

/**
 * Load bundled registry from local file
 */
async function loadBundledRegistry(): Promise<SkillSource[]> {
  const registryPath = getSkillsRegistryPath();

  try {
    if (await fs.pathExists(registryPath)) {
      const content = await fs.readJson(registryPath);
      return content as SkillSource[];
    }
  } catch (error) {
    console.error('Failed to load bundled skills registry:', error);
  }

  return [];
}

/**
 * Fetch registry from remote URL
 */
async function fetchRegistry(): Promise<SkillSource[]> {
  // For now, load from bundled registry
  // In the future, this can fetch from remote URL and merge with bundled
  return await loadBundledRegistry();
}

/**
 * Get cached registry (for offline use)
 */
async function getCachedRegistry(): Promise<SkillSource[]> {
  const configDir = getConfigDir();
  const cachePath = path.join(configDir, 'registry-cache.json');

  try {
    if (await fs.pathExists(cachePath)) {
      return await fs.readJson(cachePath);
    }
  } catch (error) {
    console.error('Failed to read cached registry:', error);
  }

  return [];
}

/**
 * Cache registry locally
 */
async function cacheRegistry(skills: SkillSource[]): Promise<void> {
  const configDir = getConfigDir();
  await fs.ensureDir(configDir);

  const cachePath = path.join(configDir, 'registry-cache.json');
  await fs.writeJson(cachePath, skills, { spaces: 2 });
}

/**
 * List all available skills from registry
 */
export async function listAvailableSkills(): Promise<SkillSource[]> {
  // Try to fetch from remote, fall back to cache
  let skills = await fetchRegistry();

  if (skills.length === 0) {
    skills = await getCachedRegistry();
  } else {
    // Cache the fetched registry
    await cacheRegistry(skills);
  }

  return skills;
}

/**
 * Get a specific skill by name from registry
 */
export async function getSkillSource(name: string): Promise<SkillSource | null> {
  const skills = await listAvailableSkills();
  return skills.find(s => s.name === name) || null;
}

/**
 * Search skills by keyword
 */
export async function searchSkills(query: string): Promise<SkillSource[]> {
  const skills = await listAvailableSkills();
  const lowerQuery = query.toLowerCase();

  return skills.filter(skill => {
    const metadata = skill.metadata;
    if (!metadata) return false;

    const { name, description, category, tags = [], keywords = [] } = metadata;

    return (
      name.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      category.toLowerCase().includes(lowerQuery) ||
      tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Parse GitHub URL to get raw content URL
 */
export function parseGitHubUrl(url: string): string | null {
  // Convert GitHub URLs to raw content URLs
  // https://github.com/user/repo/blob/main/skill.md -> https://raw.githubusercontent.com/user/repo/main/skill.md

  const githubPattern = /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/;
  const match = url.match(githubPattern);

  if (match) {
    const [, owner, repo, branch, filePath] = match;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  }

  // Already a raw URL
  if (url.includes('raw.githubusercontent.com')) {
    return url;
  }

  return null;
}

/**
 * Add a custom skill source
 */
export async function addCustomSkillSource(skill: SkillSource): Promise<void> {
  const configDir = getConfigDir();
  await fs.ensureDir(configDir);

  const customPath = path.join(configDir, 'custom-skills.json');

  let customSkills: SkillSource[] = [];
  if (await fs.pathExists(customPath)) {
    customSkills = await fs.readJson(customPath);
  }

  // Remove existing skill with same name
  customSkills = customSkills.filter(s => s.name !== skill.name);

  // Add new skill
  customSkills.push(skill);

  await fs.writeJson(customPath, customSkills, { spaces: 2 });
}

/**
 * Remove a custom skill source
 */
export async function removeCustomSkillSource(name: string): Promise<void> {
  const configDir = getConfigDir();
  const customPath = path.join(configDir, 'custom-skills.json');

  if (!(await fs.pathExists(customPath))) {
    return;
  }

  let customSkills: SkillSource[] = await fs.readJson(customPath);
  customSkills = customSkills.filter(s => s.name !== name);

  await fs.writeJson(customPath, customSkills, { spaces: 2 });
}

/**
 * Get all custom skill sources
 */
export async function getCustomSkillSources(): Promise<SkillSource[]> {
  const configDir = getConfigDir();
  const customPath = path.join(configDir, 'custom-skills.json');

  if (!(await fs.pathExists(customPath))) {
    return [];
  }

  return await fs.readJson(customPath);
}

/**
 * Get all categories from available skills
 */
export async function getCategories(): Promise<string[]> {
  const skills = await listAvailableSkills();
  const categories = new Set<string>();

  skills.forEach(skill => {
    if (skill.metadata?.category) {
      categories.add(skill.metadata.category);
    }
  });

  return Array.from(categories).sort();
}

/**
 * Get skills by category
 */
export async function getSkillsByCategory(category: string): Promise<SkillSource[]> {
  const skills = await listAvailableSkills();
  return skills.filter(s => s.metadata?.category === category);
}

/**
 * Update registry cache
 */
export async function updateRegistry(): Promise<void> {
  const skills = await fetchRegistry();
  if (skills.length > 0) {
    await cacheRegistry(skills);
  }
}
