# Cepheid Quick Start

Get up and running with Cepheid in 5 minutes!

## Installation

```bash
npm install -g cepheid
```

Or use without installing:
```bash
npx cepheid --help
```

## Your First Skill

Install a skill to enhance Claude Code's capabilities:

```bash
# Install the code review skill
cepheid install code-review

# Verify it's installed
cepheid installed
```

Now when you work with Claude Code, you can invoke this skill by asking:
> "Please review this code using the code-review skill"

## Apply a Permission Template

Configure Claude Code's auto-approval settings:

```bash
# See available templates
cepheid permissions list

# Apply the balanced template (recommended)
cepheid permissions apply balanced

# View current permissions
cepheid permissions show
```

## Explore Available Skills

```bash
# List all skills
cepheid skills list

# List skills by category
cepheid skills list --category code-quality

# Search for skills
cepheid skills search "test"

# Get detailed info about a skill
cepheid skills info testing
```

## Backup Your Settings

```bash
# Save current settings
cepheid backup save my-setup

# List backups
cepheid backup list

# Restore from backup
cepheid backup restore my-setup
```

## Install Multiple Skills

```bash
# Install several skills at once
cepheid install code-review testing doc-generator deploy-check

# See what's installed
cepheid installed
```

## Common Workflows

### For Code Quality
```bash
cepheid install code-review testing refactor-safe
cepheid permissions apply balanced
```

### For Fast Prototyping
```bash
cepheid install debug-helper testing
cepheid permissions apply permissive
```

### For Production Work
```bash
cepheid install deploy-check code-review
cepheid permissions apply strict
```

## Next Steps

1. **Explore skills**: `cepheid skills list`
2. **Read skill descriptions**: `cepheid skills info <skill-name>`
3. **Customize permissions**: `cepheid permissions show`
4. **Create backups**: `cepheid backup save <name>`

## Tips

- **Start with balanced**: The `balanced` permission template is recommended for most users
- **Install as needed**: Don't install all skills at once - add them when you need them
- **Backup before experimenting**: Save your settings before trying new templates
- **Search is your friend**: Use `cepheid skills search` to find relevant skills

## Getting Help

```bash
# Main help
cepheid --help

# Command-specific help
cepheid skills --help
cepheid permissions --help
cepheid backup --help
```

## What's Next?

Check out:
- **README.md** - Full documentation
- **CONTRIBUTING.md** - How to add your own skills
- **Available skills** - Browse `skills/` directory

Happy coding with Cepheid! 🌟
