# Cepheid

**A CLI package manager for Claude Code skills and settings**

Cepheid lets you install community-maintained Claude Code skills from remote repositories, manage permission templates, and sync your configuration across machines. Think of it as npm for Claude Code.

## Features

- 🌐 **Remote Skills Registry**: Install skills from GitHub, URLs, or a centralized registry
- 🔌 **Plugin Support**: Install full Claude Code plugins with hooks, commands, agents, and skills
- 🎯 **Selective Skills**: Enable only specific skills from plugins - perfect for minimalists
- ⚡ **One-Command Install**: `cepheid install <url-or-name>` - done!
- 🔐 **Permission Templates**: Pre-configured profiles (strict, balanced, permissive, development)
- 🔄 **Backup/Restore**: Save and sync your settings across machines
- 📦 **Lightweight**: No bundled content - install only what you need
- 🛠️ **Extensible**: Add your own skills and plugins from any URL

## Installation

```bash
npm install -g cepheid
```

Or run directly with npx:

```bash
npx cepheid --help
```

## Quick Start

### Install a Skill from URL

```bash
# Install from GitHub
cepheid install https://github.com/user/repo/blob/main/skill.md

# Install from raw URL
cepheid install https://raw.githubusercontent.com/user/repo/main/skill.md

# Verify it's installed
cepheid installed
```

### Install from Registry (when available)

```bash
# Install by name from registry
cepheid install code-review

# List available skills in registry
cepheid skills list

# Search for skills
cepheid skills search "test"
```

### Apply Permission Templates

```bash
# See available templates
cepheid permissions list

# Apply the balanced template (recommended)
cepheid permissions apply balanced

# View current permissions
cepheid permissions show
```

## Usage

### Plugin Management

```bash
# Install a plugin from GitHub
cepheid plugin install https://github.com/humanplane/homunculus

# List installed plugins
cepheid plugin list

# Update plugin (git pull)
cepheid plugin update homunculus

# Uninstall plugin
cepheid plugin uninstall homunculus

# Show plugin info
cepheid plugin info homunculus

# Link plugin to Claude Code (creates symlink in ~/plugins/)
cepheid plugin link homunculus

# Unlink plugin
cepheid plugin unlink homunculus
```

### Skills Management

```bash
# Install from URL (GitHub or direct)
cepheid install https://github.com/user/repo/blob/main/my-skill.md

# Install from registry (if available)
cepheid install skill-name

# Add custom skill with name
cepheid skills add my-skill https://example.com/skill.md

# List installed skills
cepheid installed

# Uninstall skill
cepheid uninstall skill-name

# Update installed skills
cepheid update              # Update all
cepheid update skill-name   # Update specific skill

# Browse available skills
cepheid skills list
cepheid skills list --category code-quality
cepheid skills search "debug"
cepheid skills info skill-name

# Update registry cache
cepheid skills update-registry
```

### Selective Skill Installation from Plugins

When you install a plugin like `everything-claude-code`, it may contain dozens of skills. Cepheid lets you enable only the skills you need:

```bash
# First, install the plugin
cepheid plugin install everything-claude-code

# Browse available skills in the plugin
cepheid skill browse everything-claude-code

# Enable specific skills (creates symlinks to ~/.claude/skills/)
cepheid skill enable everything-claude-code/tdd-workflow
cepheid skill enable everything-claude-code/security-review
cepheid skill enable everything-claude-code/code-reviewer

# List all enabled skills
cepheid skill enabled

# Disable a skill when you no longer need it
cepheid skill disable tdd-workflow

# Disable all skills from a plugin
cepheid skill disable-all everything-claude-code
```

**Benefits:**
- **Minimalist approach**: Only enable what you use
- **Better performance**: Fewer skills = faster Claude Code startup
- **Easy management**: Track which plugin each skill comes from
- **Automatic updates**: Enabled skills are symlinked, so plugin updates automatically update skills

### Permission Management

```bash
# List available templates
cepheid permissions list

# Show current permissions
cepheid permissions show

# Show specific template
cepheid permissions show balanced

# Apply template
cepheid permissions apply balanced

# Add custom permission rule
cepheid permissions add "Bash(npm test:*)"

# Remove permission rule
cepheid permissions remove "Bash(npm test:*)"

# Export current permissions as template
cepheid permissions export my-template
```

### Backup & Restore

```bash
# Save current settings
cepheid backup save my-setup

# List backups
cepheid backup list

# Restore from backup
cepheid backup restore my-setup
```

## Permission Templates

### Strict
- Read-only operations auto-approved
- All writes require confirmation
- No external API calls without approval
- Ideal for: Production environments, critical codebases

### Balanced (Recommended)
- Safe operations auto-approved (git status, tests, linting)
- Project-scoped writes auto-approved (code edits, commits)
- Risky operations require approval (force push, system changes)
- Ideal for: Most development workflows

### Development
- Development tools auto-approved (npm, git, build tools)
- Common dev operations streamlined
- Good balance for active coding sessions
- Ideal for: Daily development work

### Permissive
- Most operations auto-approved
- Only destructive system commands require approval
- Fast iteration, less friction
- Ideal for: Experimental projects, rapid prototyping

## Skills vs Plugins

Cepheid supports two types of Claude Code extensions:

### Skills
**Simple Markdown files** with prompts for Claude Code.
- Single `.md` file
- Prompt-based behaviors
- Easy to create and share
- Lightweight

**Use skills for**: Code review templates, testing workflows, documentation generators

### Plugins
**Full packages** with multiple components.
- Directory structure with `.claude-plugin/` manifest
- Can include: hooks, commands, agents, skills, scripts
- More powerful and complex
- GitHub repository

**Use plugins for**: Complex behaviors, observability, state management, integrated workflows

**Example plugin**: [Homunculus](https://github.com/humanplane/homunculus) - Learning plugin that evolves based on your coding patterns

## Creating Community Skills

Skills are simple Markdown files with prompts for Claude Code. Anyone can create and share them!

### Skill Format

Create a Markdown file with your skill prompt:

```markdown
# My Awesome Skill

You are helping with [specific task]. Follow these steps:

## Step 1: ...
Details here...

## Step 2: ...
More details...

## Best Practices
- Tip 1
- Tip 2
```

### Sharing Skills

1. **Host on GitHub**: Create a repo with your skill files
2. **Share the raw URL**: Users can install with:
   ```bash
   cepheid install https://github.com/you/repo/blob/main/skill.md
   ```

3. **Submit to Registry** (optional): Create a PR to add your skill to the community registry

### Example Skills Repository Structure

```
my-claude-skills/
├── README.md
├── code-review.md          # Code review workflow
├── testing.md              # Testing guidelines
├── debugging.md            # Debugging workflow
└── documentation.md        # Doc generation
```

Users install with:
```bash
cepheid install https://github.com/you/my-claude-skills/blob/main/code-review.md
```

## Community Registry

Cepheid supports a centralized registry for discovering community skills. The default registry is:
```
https://raw.githubusercontent.com/claude-code-community/cepheid-skills/main/registry.json
```

### Registry Format

```json
[
  {
    "name": "code-review",
    "url": "https://raw.githubusercontent.com/user/repo/main/code-review.md",
    "type": "github",
    "metadata": {
      "name": "code-review",
      "version": "1.0.0",
      "description": "Systematic PR and code review workflow",
      "category": "code-quality",
      "author": "Community",
      "tags": ["review", "pr", "quality"],
      "keywords": ["pull request", "code review"]
    }
  }
]
```

## Configuration

Cepheid stores configuration in:
- **Linux/macOS**: `~/.config/cepheid/`
- **Windows**: `%APPDATA%\cepheid\`

Files:
- `config.json` - Installed skills list
- `custom-skills.json` - Custom skill sources
- `registry-cache.json` - Cached registry
- `backups/` - Configuration backups

Claude Code settings are in:
- **Linux/macOS**: `~/.config/claude-code/`
- **Windows**: `%APPDATA%\claude-code\`

## Examples

### Daily Development Setup

```bash
# Install common skills
cepheid install https://github.com/claude-skills/code-review/blob/main/skill.md
cepheid install https://github.com/claude-skills/testing/blob/main/skill.md
cepheid install https://github.com/claude-skills/debugging/blob/main/skill.md

# Apply balanced permissions
cepheid permissions apply balanced

# Backup your setup
cepheid backup save dev-setup
```

### Experimental Project

```bash
# Use permissive mode for fast iteration
cepheid permissions apply permissive

# Install only what you need
cepheid install https://raw.githubusercontent.com/user/repo/main/prototype-helper.md
```

### Production Work

```bash
# Maximum safety
cepheid permissions apply strict

# Install only deployment and review skills
cepheid install https://github.com/skills/deploy-check/blob/main/skill.md
cepheid install https://github.com/skills/security-scan/blob/main/skill.md
```

## Development

```bash
# Clone repository
git clone https://github.com/g7tianyi/cepheid.git
cd cepheid

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/cli.js --help

# Link for global testing
npm link
cepheid --help
```

## Contributing

We welcome contributions! To share skills:

1. Create skill Markdown files
2. Host on GitHub or any public URL
3. Share the URL with the community
4. (Optional) Submit to the community registry

See `CONTRIBUTING.md` for detailed guidelines.

## Why "Cepheid"?

Cepheid variables are standard candles in astronomy - reliable reference points for measuring distances. Similarly, Cepheid provides standard reference configurations for Claude Code, making it easier to calibrate your setup across projects and machines.

## License

MIT

## Links

- **Repository**: https://github.com/g7tianyi/cepheid
- **Issues**: https://github.com/g7tianyi/cepheid/issues
- **npm**: https://www.npmjs.com/package/cepheid
