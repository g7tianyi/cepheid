# Cepheid

**A CLI tool to manage Claude Code settings, permissions, and skills**

Cepheid is your configuration manager for Claude Code - think of it as a package manager for Claude Code skills and permission templates. Install curated skills with one command, switch between permission profiles, and manage your Claude Code setup across machines.

## Features

- 🎯 **Skills Registry**: Curated library of reusable Claude Code skills
- ⚡ **One-Command Install**: `cepheid install code-review` - done!
- 🔐 **Permission Templates**: Pre-configured profiles (strict, balanced, permissive)
- 🔄 **Backup/Restore**: Save and sync your settings across machines
- 📦 **Project-Specific Configs**: Different permissions for different projects

## Installation

```bash
npm install -g cepheid
```

Or run directly with npx:

```bash
npx cepheid --help
```

## Quick Start

### Install a Skill

```bash
# Install a single skill
cepheid install code-review

# Install multiple skills
cepheid install testing documentation deployment

# List available skills
cepheid skills list

# Search for skills
cepheid skills search "test"
```

### Manage Permissions

```bash
# Apply a permission template
cepheid permissions apply balanced

# List available templates
cepheid permissions list

# Create custom template from current settings
cepheid permissions export my-template

# Show current permissions
cepheid permissions show
```

### Backup & Restore

```bash
# Backup current settings
cepheid backup save my-setup

# Restore from backup
cepheid backup restore my-setup

# List backups
cepheid backup list
```

## Available Skills

### Code Quality
- **code-review**: Systematic PR review workflow
- **testing**: Generate and run comprehensive tests
- **linting**: Code style and quality checks
- **refactor-safe**: Safe refactoring patterns

### Documentation
- **doc-generator**: Auto-generate documentation
- **api-docs**: API documentation builder
- **changelog**: Automated changelog generation

### Deployment
- **deploy-check**: Pre-deployment validation
- **rollback**: Safe rollback procedures
- **version-bump**: Semantic versioning automation

### Development
- **debug-helper**: Debugging workflow assistant
- **performance**: Performance profiling and optimization
- **security-scan**: Security vulnerability scanning

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

### Permissive
- Most operations auto-approved
- Only destructive system commands require approval
- Fast iteration, less friction
- Ideal for: Experimental projects, rapid prototyping

## Configuration

Cepheid stores settings in:
- **Linux/macOS**: `~/.config/cepheid/`
- **Windows**: `%APPDATA%\cepheid\`

Claude Code settings are typically in:
- **Linux/macOS**: `~/.config/claude-code/` or `~/.claude-code/`
- **Windows**: `%APPDATA%\claude-code\`

## Project Structure

```
cepheid/
├── src/
│   ├── cli.ts              # Main CLI entry point
│   ├── commands/           # CLI command handlers
│   │   ├── install.ts
│   │   ├── permissions.ts
│   │   └── backup.ts
│   ├── config/
│   │   ├── manager.ts      # Config file I/O
│   │   └── paths.ts        # Platform-specific paths
│   ├── skills/
│   │   ├── registry.ts     # Skill catalog
│   │   └── installer.ts    # Installation logic
│   └── permissions/
│       ├── templates.ts    # Permission profiles
│       └── applier.ts      # Apply permissions
├── skills/                 # Skill library
│   ├── code-review/
│   ├── testing/
│   └── ...
├── templates/              # Permission templates
│   ├── strict.yaml
│   ├── balanced.yaml
│   └── permissive.yaml
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Type check
npm run typecheck

# Clean build artifacts
npm run clean
```

## Contributing

We welcome contributions! To add a new skill:

1. Create a skill directory in `skills/`
2. Add a `skill.md` file with the skill prompt
3. Add metadata in `skill.yaml`
4. Submit a PR

See `CONTRIBUTING.md` for detailed guidelines.

## License

MIT

## Why "Cepheid"?

Cepheid variables are standard candles in astronomy - reliable reference points for measuring distances. Similarly, Cepheid provides standard reference configurations for Claude Code, making it easier to calibrate your setup across projects and machines.
