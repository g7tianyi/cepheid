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

## Fastest Way to Start: Install a Profile

**Profiles** are curated collections of skills grouped by persona/use-case. This is the easiest way to get productive quickly:

```bash
# See all available profiles
cepheid profile list

# Install a profile (automatically installs plugins and enables skills)
cepheid profile install developers

# Check what's now enabled
cepheid skill enabled
```

**Available profiles:**
- `commons` - Essential skills everyone needs (3 skills)
- `developers` - TDD, code review, testing, debugging (9 skills)
- `architects` - System design, patterns, documentation (7 skills)
- `work-efficiency` - Productivity and automation (6 skills)
- `learning` - Education and research (7 skills)
- `content-creators` - Writing, design, presentations (9 skills)
- `entrepreneurs` - Fundraising, pitching, market research (6 skills)
- `security` - Security review and vulnerability scanning (3 skills)

Preview before installing:
```bash
# See what would be installed
cepheid profile preview developers
```

## Alternative: Install Individual Skills

If you prefer to install skills one by one:

```bash
# Install a specific skill from the registry
cepheid install code-review

# Or install from a URL
cepheid install https://github.com/user/repo/blob/main/skill.md

# Verify it's installed
cepheid installed
```

Now when you work with Claude Code, you can invoke skills by asking:
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

### For Software Development
```bash
# Install the developers profile
cepheid profile install developers
cepheid permissions apply balanced
```

### For System Architecture
```bash
# Install the architects profile
cepheid profile install architects
cepheid permissions apply balanced
```

### For Learning & Research
```bash
# Install the learning profile
cepheid profile install learning
cepheid permissions apply permissive
```

### For Security Work
```bash
# Install the security profile
cepheid profile install security
cepheid permissions apply strict
```

## Next Steps

1. **Explore profiles**: `cepheid profile list`
2. **View profile details**: `cepheid profile show <profile-name>`
3. **Check enabled skills**: `cepheid skill enabled`
4. **Customize permissions**: `cepheid permissions show`
5. **Create backups**: `cepheid backup save <name>`

## Tips

- **Start with a profile**: Profiles give you a curated set of skills for your workflow - much easier than installing individually
- **Use balanced permissions**: The `balanced` permission template is recommended for most users
- **Preview before installing**: Use `cepheid profile preview <name>` to see what will be installed
- **Backup before experimenting**: Save your settings before trying new profiles or templates
- **Mix and match**: You can install multiple profiles or add individual skills on top of a profile

## Getting Help

```bash
# Main help
cepheid --help

# Command-specific help
cepheid profile --help
cepheid skill --help
cepheid plugin --help
cepheid permissions --help
cepheid backup --help
```

## What's Next?

Check out:
- **README.md** - Full documentation
- **CONTRIBUTING.md** - How to add your own skills
- **Available skills** - Browse `skills/` directory

Happy coding with Cepheid! 🌟
