import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export interface ProfileSkillGroup {
  plugin: string;
  skills: string[];
}

export interface Profile {
  name: string;
  description: string;
  category: string;
  skills: ProfileSkillGroup[];
}

/**
 * Get path to profiles registry
 */
function getProfilesRegistryPath(): string {
  // For CommonJS (TypeScript compiles to this)
  // __dirname is the directory of the compiled JS file in dist/
  // We need to go up to the project root, then into registry/
  return path.join(__dirname, '../../registry/profiles.json');
}

/**
 * Load all profiles
 */
export async function loadProfiles(): Promise<Profile[]> {
  const registryPath = getProfilesRegistryPath();

  if (!(await fs.pathExists(registryPath))) {
    throw new Error('Profiles registry not found. This may be a Cepheid installation issue.');
  }

  const content = await fs.readJson(registryPath);
  return content as Profile[];
}

/**
 * Get a specific profile by name
 */
export async function getProfile(name: string): Promise<Profile | null> {
  const profiles = await loadProfiles();
  return profiles.find(p => p.name === name) || null;
}

/**
 * List all profiles grouped by category
 */
export async function getProfilesByCategory(): Promise<Record<string, Profile[]>> {
  const profiles = await loadProfiles();
  const byCategory: Record<string, Profile[]> = {};

  for (const profile of profiles) {
    if (!byCategory[profile.category]) {
      byCategory[profile.category] = [];
    }
    byCategory[profile.category].push(profile);
  }

  return byCategory;
}

/**
 * Get all unique plugins required by a profile
 */
export function getRequiredPlugins(profile: Profile): string[] {
  const plugins = new Set<string>();

  for (const group of profile.skills) {
    plugins.add(group.plugin);
  }

  return Array.from(plugins);
}

/**
 * Get total skill count for a profile
 */
export function getSkillCount(profile: Profile): number {
  return profile.skills.reduce((sum, group) => sum + group.skills.length, 0);
}

/**
 * Search profiles by query
 */
export async function searchProfiles(query: string): Promise<Profile[]> {
  const profiles = await loadProfiles();
  const lowerQuery = query.toLowerCase();

  return profiles.filter(profile =>
    profile.name.toLowerCase().includes(lowerQuery) ||
    profile.description.toLowerCase().includes(lowerQuery) ||
    profile.category.toLowerCase().includes(lowerQuery)
  );
}
