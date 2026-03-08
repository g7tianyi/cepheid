# Claude Code Integration Guide for Cepheid

This document provides guidelines for Claude Code when working on the Cepheid codebase.

**Inspired by SuperClaude Framework's CLAUDE.md structure.**

## Project Overview

**Cepheid** is a CLI package manager for Claude Code skills and settings. It enables users to install community-maintained skills, manage plugins, apply permission templates, and sync configurations across machines.

**Think of it as:** npm for Claude Code

## Architecture Principles

### 1. TypeScript-First Development

- **Language**: TypeScript with strict mode enabled
- **Target**: ES2020 for modern Node.js compatibility
- **Build**: TypeScript compiler (`tsc`) outputs to `dist/`
- **Entry point**: `src/cli.ts` (CLI) and `dist/cli.js` (compiled)

### 2. Modular Command Structure

Commands are organized by domain:
```
src/commands/
├── skills.ts        # Skill installation and management
├── plugins.ts       # Plugin operations
├── profiles.ts      # Profile management
├── permissions.ts   # Permission templates
└── backup.ts        # Backup and restore
```

Each command module exports functions called by `src/cli.ts`.

### 3. Registry-Based Architecture

Cepheid uses JSON registries for discoverability:
```
registry/
├── plugins.json    # Community plugins (with ratings)
├── skills.json     # Community skills (with metadata)
└── profiles.json   # Curated skill collections
```

**Important**: Registries are bundled with the package and loaded from `registry/*.json` at runtime via `path.join(__dirname, '../../registry/*.json')`.

### 4. Configuration Management

User configurations stored in:
- **Linux/macOS**: `~/.config/cepheid/`
- **Windows**: `%APPDATA%\cepheid\`

Files:
- `config.json` - Installed skills list
- `custom-skills.json` - Custom skill sources
- `registry-cache.json` - Cached registry (future)
- `backups/` - Configuration backups

Claude Code settings in:
- **Linux/macOS**: `~/.config/claude-code/`
- **Windows**: `%APPDATA%\claude-code\`

### 5. Plugin vs Skill Distinction

**Skills**:
- Single Markdown files
- Prompt-based behaviors
- Lightweight
- Example: TDD workflow, code review checklist

**Plugins**:
- Full packages with `.claude-plugin/` manifest
- Can include: hooks, commands, agents, skills, scripts
- Complex behaviors
- Example: everything-claude-code, SuperClaude Framework

## Absolute Rules

### Code Style

1. **TypeScript Strict Mode**: Always use strict type checking
   - No `any` types without explicit justification
   - Prefer interfaces over type aliases for objects
   - Use async/await over raw promises

2. **File Organization**:
   - Commands in `src/commands/`
   - Core logic in domain-specific modules (`src/skills/`, `src/plugins/`, etc.)
   - Utilities in `src/utils/` (if needed)
   - Types in same file or `src/types/` for shared types

3. **Naming Conventions**:
   - Files: `kebab-case.ts`
   - Functions: `camelCase`
   - Classes: `PascalCase`
   - Constants: `UPPER_SNAKE_CASE`

4. **Error Handling**:
   ```typescript
   // ✅ Good
   try {
     await operationThatMightFail();
     console.log(chalk.green('✓ Success'));
   } catch (error: any) {
     console.error(chalk.red('Error:'), error.message);
     process.exit(1);
   }

   // ❌ Bad
   operationThatMightFail(); // No error handling
   ```

### Testing

1. **Test Coverage**: All new features require tests (when test infrastructure added)
2. **Build Verification**: Always run `npm run build` before committing
3. **Manual Testing**: Test CLI commands locally with `node dist/cli.js <command>`

### Git Workflow

1. **Commit Messages**: Follow Conventional Commits format
   ```
   feat: add profile installation command
   fix: handle missing registry file gracefully
   docs: update README with profile examples
   refactor: extract registry loading logic
   ```

2. **Evaluation Pattern**: When adding plugins/skills to registry:
   ```
   Evaluate <name>: APPROVED X/5 stars ⭐ (with notes)

   [Description]

   Rating: X/5 stars
   Category: [category]
   Repository: [url]

   ✅ Strengths:
   - [strength 1]
   - [strength 2]

   ⚠️ Warnings:
   - [warning 1]
   - [warning 2]

   Verdict: [summary]

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

3. **Branch Protection**: Always commit to `master` for this project (solo maintainer workflow)

### Dependencies

1. **Minimal Dependencies**: Only add dependencies when necessary
   - Current: `commander`, `chalk`, `fs-extra`, `js-yaml`
   - Prefer built-in Node.js modules when possible

2. **Version Pinning**: Use exact versions for critical dependencies
   ```json
   {
     "commander": "11.1.0",    // ✅ Exact version
     "chalk": "^4.1.2"         // ⚠️ Allow patches
   }
   ```

## Development Workflows

### Adding a New Command

1. **Create command function** in appropriate file (`src/commands/*.ts`)
2. **Register command** in `src/cli.ts`
3. **Test locally**: `npm run build && node dist/cli.js <command>`
4. **Update documentation** in README.md and QUICKSTART.md

Example:
```typescript
// src/commands/skills.ts
export async function installSkills(skills: string[]) {
  try {
    console.log(chalk.bold(`\nInstalling ${skills.length} skill(s)...\n`));

    for (const skillName of skills) {
      try {
        await installSkill(skillName);
        console.log(chalk.green(`✓ Installed ${skillName}`));
      } catch (error: any) {
        console.log(chalk.red(`✗ Failed to install ${skillName}: ${error.message}`));
      }
    }

    console.log(chalk.bold('\nDone!\n'));
  } catch (error: any) {
    console.error(chalk.red('Error installing skills:'), error.message);
    process.exit(1);
  }
}

// src/cli.ts
program
  .command('install <skills...>')
  .description('Install one or more skills')
  .action(skillCommands.installSkills);
```

### Adding a Plugin to Registry

1. **Research the plugin**:
   - GitHub stars, forks, commit activity
   - License (must be permissive)
   - Age (prefer 3+ months, exceptions for exceptional cases)
   - Features, requirements, compatibility

2. **Rate the plugin** (1-5 stars):
   - ⭐⭐⭐⭐⭐ (5): Official, exceptional, or >20k stars
   - ⭐⭐⭐⭐ (4): Excellent, mature, widely used
   - ⭐⭐⭐ (3): Good with some limitations
   - ⭐⭐ (2): Useful but significant concerns
   - ⭐ (1): Not recommended (rare)

3. **Add to `registry/plugins.json`** with comprehensive metadata:
   ```json
   {
     "name": "plugin-name",
     "repo": "https://github.com/owner/repo",
     "description": "One-line description",
     "stars": 4,
     "category": "category-name",
     "author": "author-name",
     "tags": ["tag1", "tag2"],
     "features": ["feature 1", "feature 2"],
     "requirements": {
       "claudeCode": ">=2.0.0"
     },
     "notes": [
       "Important note 1",
       "Warning 1",
       "Best for: use case"
     ]
   }
   ```

4. **Commit with evaluation message** (see Git Workflow)

### Adding a Skill to Registry

1. **Verify skill format**: Must be Markdown with prompt content
2. **Categorize appropriately**: `information`, `productivity`, `quality`, `performance`, etc.
3. **Add to `registry/skills.json`**:
   ```json
   {
     "name": "skill-name",
     "url": "https://raw.githubusercontent.com/owner/repo/main/skill.md",
     "type": "github",
     "stars": 3,
     "category": "category",
     "author": "author",
     "tags": ["tag1", "tag2"],
     "metadata": {
       "name": "skill-name",
       "version": "1.0.0",
       "description": "Description",
       "category": "category",
       "author": "author",
       "keywords": ["keyword1", "keyword2"]
     },
     "features": ["feature 1", "feature 2"],
     "requirements": {},
     "notes": ["note 1", "note 2"]
   }
   ```

4. **Test installation**: `node dist/cli.js install skill-name`

### Adding a Profile

1. **Design profile** around persona/use-case (developers, architects, etc.)
2. **Select skills** from existing plugins (anthropic-agent-skills, everything-claude-code)
3. **Add to `registry/profiles.json`**:
   ```json
   {
     "name": "profile-name",
     "description": "Profile description",
     "category": "category",
     "skills": [
       {
         "plugin": "plugin-name",
         "skills": ["skill1", "skill2"]
       }
     ]
   }
   ```

4. **Test**: `node dist/cli.js profile install profile-name`

## Common Patterns

### Loading Bundled Registry

Pattern used for profiles, plugins, skills:

```typescript
function getRegistryPath(): string {
  // __dirname in dist/ after compilation
  // Go up two levels to project root, then into registry/
  return path.join(__dirname, '../../registry/registry-name.json');
}

async function loadRegistry(): Promise<RegistryItem[]> {
  const registryPath = getRegistryPath();

  if (!(await fs.pathExists(registryPath))) {
    throw new Error('Registry not found');
  }

  const content = await fs.readJson(registryPath);
  return content as RegistryItem[];
}
```

### User Feedback with Chalk

```typescript
import chalk from 'chalk';

// Success
console.log(chalk.green('✓ Operation successful'));

// Error
console.error(chalk.red('✗ Operation failed'));

// Warning
console.log(chalk.yellow('⊙ Already installed'));

// Info
console.log(chalk.blue('ℹ Information'));

// Dim/Gray for hints
console.log(chalk.dim('Hint: Use --help for more info'));
console.log(chalk.gray('Optional detail'));

// Bold for headers
console.log(chalk.bold('\nSection Header\n'));

// Colored + Bold
console.log(chalk.cyan.bold('Category:'));
```

### File Operations with fs-extra

```typescript
import * as fs from 'fs-extra';
import * as path from 'path';

// Ensure directory exists
await fs.ensureDir(dirPath);

// Check if exists
if (await fs.pathExists(filePath)) {
  // File exists
}

// Read JSON
const data = await fs.readJson(filePath);

// Write JSON
await fs.writeJson(filePath, data, { spaces: 2 });

// Read text file
const content = await fs.readFile(filePath, 'utf8');

// Write text file
await fs.writeFile(filePath, content, 'utf8');

// Copy file
await fs.copy(sourcePath, destPath);

// Remove file/directory
await fs.remove(path);
```

## Debugging Tips

### Local Development

```bash
# Build TypeScript
npm run build

# Test command locally
node dist/cli.js --help
node dist/cli.js skills list
node dist/cli.js install ai-daily-digest

# Watch mode (auto-rebuild)
npm run dev  # If configured

# Type check without building
npm run typecheck  # If configured
```

### Common Issues

1. **Registry not found**:
   - Check path: `path.join(__dirname, '../../registry/name.json')`
   - Verify `__dirname` points to `dist/` after build
   - Ensure registry file exists in project root's `registry/`

2. **Command not recognized**:
   - Did you register in `src/cli.ts`?
   - Did you rebuild? (`npm run build`)
   - Check spelling and aliases

3. **Module not found**:
   - Run `npm install`
   - Check imports use correct paths
   - Rebuild after adding new files

## Integration with Skills

This repository includes extracted skills from SuperClaude Framework:

- **confidence-check** (`skills/productivity/`) - Assess task confidence before starting
- **self-check-protocol** (`skills/quality/`) - Validate implementations systematically
- **wave-execution** (`skills/performance/`) - Parallel execution pattern
- **evidence-based-dev** (`skills/quality/`) - Verify all assumptions with evidence

Use these skills when working on Cepheid:

```bash
# Before implementing a complex feature
cepheid install confidence-check

# Before marking a task complete
cepheid install self-check-protocol

# When doing multi-file operations
cepheid install wave-execution

# When researching APIs or libraries
cepheid install evidence-based-dev
```

## Documentation Maintenance

When making changes, update these files:

1. **README.md** - Main documentation, feature list, examples
2. **QUICKSTART.md** - Quick start guide for new users
3. **CONTRIBUTING.md** - Guidelines for contributors
4. **CLAUDE.md** (this file) - Claude Code integration guide
5. **package.json** - Version, dependencies, scripts

### Documentation Sync Checklist

When adding a new feature:
- [ ] Update README.md feature list
- [ ] Add to QUICKSTART.md if user-facing
- [ ] Update CLAUDE.md if affecting development workflow
- [ ] Add examples to README.md
- [ ] Update command help text in `src/cli.ts`

## Version Management

Follow Semantic Versioning (semver):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backwards-compatible
- **PATCH** (0.0.x): Bug fixes

Update version in:
1. `package.json`
2. `src/cli.ts` (program.version)
3. Git tag: `git tag v0.5.0`

## Quick Reference for Common Tasks

```bash
# Add new skill to registry
1. Edit registry/skills.json
2. npm run build
3. Test: node dist/cli.js skills list
4. Commit with evaluation message

# Add new plugin to registry
1. Research plugin (stars, license, age)
2. Edit registry/plugins.json
3. npm run build
4. Test: node dist/cli.js plugin list
5. Commit with evaluation message

# Add new profile
1. Design profile (persona + skills)
2. Edit registry/profiles.json
3. npm run build
4. Test: node dist/cli.js profile install <name>
5. Commit with descriptive message

# Update documentation
1. Edit relevant .md files
2. Ensure consistency across all docs
3. Commit with "docs: " prefix
```

## Questions or Issues?

- **User-facing issues**: Direct to GitHub Issues
- **Development questions**: Refer to this file, README.md, CONTRIBUTING.md
- **Unclear patterns**: Look for similar implementations in existing code

---

**Remember**: Cepheid aims to be simple, reliable, and user-friendly. Every change should make it easier for users to manage their Claude Code environment.

**Inspired by**: SuperClaude Framework's systematic approach to documentation and development workflows.
