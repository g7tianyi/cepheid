import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { getBundledSkillsDir } from '../config/paths';

export interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  category: string;
  author?: string;
  tags?: string[];
  keywords?: string[];
}

export interface Skill {
  metadata: SkillMetadata;
  content: string;
  path: string;
}

/**
 * Load skill metadata from skill.yaml
 */
async function loadSkillMetadata(skillDir: string): Promise<SkillMetadata | null> {
  const metadataPath = path.join(skillDir, 'skill.yaml');

  try {
    if (await fs.pathExists(metadataPath)) {
      const content = await fs.readFile(metadataPath, 'utf8');
      return yaml.load(content) as SkillMetadata;
    }
  } catch (error) {
    console.error(`Error loading metadata for ${skillDir}:`, error);
  }

  return null;
}

/**
 * Load skill content from skill.md
 */
async function loadSkillContent(skillDir: string): Promise<string | null> {
  const contentPath = path.join(skillDir, 'skill.md');

  try {
    if (await fs.pathExists(contentPath)) {
      return await fs.readFile(contentPath, 'utf8');
    }
  } catch (error) {
    console.error(`Error loading content for ${skillDir}:`, error);
  }

  return null;
}

/**
 * List all available skills
 */
export async function listAvailableSkills(): Promise<Skill[]> {
  const skillsDir = getBundledSkillsDir();

  if (!(await fs.pathExists(skillsDir))) {
    return [];
  }

  const categories = await fs.readdir(skillsDir);
  const skills: Skill[] = [];

  for (const category of categories) {
    const categoryPath = path.join(skillsDir, category);
    const stat = await fs.stat(categoryPath);

    if (!stat.isDirectory()) continue;

    const skillDirs = await fs.readdir(categoryPath);

    for (const skillName of skillDirs) {
      const skillPath = path.join(categoryPath, skillName);
      const skillStat = await fs.stat(skillPath);

      if (!skillStat.isDirectory()) continue;

      const metadata = await loadSkillMetadata(skillPath);
      const content = await loadSkillContent(skillPath);

      if (metadata && content) {
        skills.push({
          metadata,
          content,
          path: skillPath,
        });
      }
    }
  }

  return skills;
}

/**
 * Get a specific skill by name
 */
export async function getSkill(name: string): Promise<Skill | null> {
  const skills = await listAvailableSkills();
  return skills.find(s => s.metadata.name === name) || null;
}

/**
 * Search skills by keyword
 */
export async function searchSkills(query: string): Promise<Skill[]> {
  const skills = await listAvailableSkills();
  const lowerQuery = query.toLowerCase();

  return skills.filter(skill => {
    const { name, description, category, tags = [], keywords = [] } = skill.metadata;

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
 * Get skills by category
 */
export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const skills = await listAvailableSkills();
  return skills.filter(s => s.metadata.category === category);
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<string[]> {
  const skills = await listAvailableSkills();
  const categories = new Set(skills.map(s => s.metadata.category));
  return Array.from(categories).sort();
}
