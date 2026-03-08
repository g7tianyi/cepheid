import * as fs from 'fs-extra';
import * as path from 'path';

export interface PluginMetadata {
  name: string;
  repo: string;
  description: string;
  stars: number;
  category: string;
  author: string;
  tags?: string[];
  features?: string[];
  requirements?: {
    claudeCode?: string;
    node?: string;
  };
  notes?: string[];
}

/**
 * Get bundled plugins registry path
 */
function getRegistryPath(): string {
  // In development: cepheid/registry/plugins.json
  // In production: dist/../registry/plugins.json
  return path.join(__dirname, '..', '..', 'registry', 'plugins.json');
}

/**
 * Load plugins registry
 */
export async function loadPluginsRegistry(): Promise<PluginMetadata[]> {
  const registryPath = getRegistryPath();

  try {
    if (await fs.pathExists(registryPath)) {
      return await fs.readJson(registryPath);
    }
  } catch (error) {
    console.error('Failed to load plugins registry:', error);
  }

  return [];
}

/**
 * Get plugin from registry by name
 */
export async function getPluginFromRegistry(name: string): Promise<PluginMetadata | null> {
  const registry = await loadPluginsRegistry();
  return registry.find(p => p.name === name) || null;
}

/**
 * Search plugins in registry
 */
export async function searchPluginsRegistry(query: string): Promise<PluginMetadata[]> {
  const registry = await loadPluginsRegistry();
  const lowerQuery = query.toLowerCase();

  return registry.filter(plugin => {
    const { name, description, category, tags = [] } = plugin;
    return (
      name.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      category.toLowerCase().includes(lowerQuery) ||
      tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get plugins by category
 */
export async function getPluginsByCategory(category: string): Promise<PluginMetadata[]> {
  const registry = await loadPluginsRegistry();
  return registry.filter(p => p.category === category);
}

/**
 * Get all plugin categories
 */
export async function getPluginCategories(): Promise<string[]> {
  const registry = await loadPluginsRegistry();
  const categories = new Set(registry.map(p => p.category));
  return Array.from(categories).sort();
}

/**
 * Render star rating
 */
export function renderStars(stars: number): string {
  const fullStars = '★'.repeat(stars);
  const emptyStars = '☆'.repeat(5 - stars);
  return fullStars + emptyStars;
}
