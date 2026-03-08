# Best Practices for Using Cepheid

A comprehensive guide to maximizing productivity and code quality with Cepheid, Claude Code's package manager.

## Table of Contents

1. [Getting Started Right](#getting-started-right)
2. [Profile Selection Strategy](#profile-selection-strategy)
3. [Skill Management Best Practices](#skill-management-best-practices)
4. [Plugin Management Best Practices](#plugin-management-best-practices)
5. [Permission Template Strategy](#permission-template-strategy)
6. [Workflow Integration](#workflow-integration)
7. [Configuration Management](#configuration-management)
8. [Performance Optimization](#performance-optimization)
9. [Security Best Practices](#security-best-practices)
10. [Team Collaboration](#team-collaboration)

---

## Getting Started Right

### ✅ DO: Start with a Profile

**Bad approach:**
```bash
# Installing random skills without strategy
cepheid install skill1 skill2 skill3 skill4 skill5...
```

**Good approach:**
```bash
# Start with a curated profile matching your role
cepheid profile install developers

# Check what was installed
cepheid skill enabled

# Add specific skills as needed
cepheid install confidence-check
```

**Why:** Profiles are curated collections tested to work well together. They provide a coherent workflow rather than a hodgepodge of random skills.

### ✅ DO: Preview Before Installing

```bash
# Always preview profiles before installing
cepheid profile preview developers

# Check skill details before installing
cepheid skills info confidence-check

# Review plugin information
cepheid plugin info superclaude
```

**Why:** Understand what you're installing, its requirements, and potential conflicts.

### ❌ DON'T: Install Everything at Once

```bash
# Bad: Installing every available skill
cepheid install $(cepheid skills list | grep "○" | awk '{print $2}')
```

**Why:**
- Overwhelming number of skills confuses Claude
- Slower Claude Code startup
- Conflicting advice from different skills
- Harder to learn what each skill does

**Instead:** Start minimal, add incrementally as you discover needs.

---

## Profile Selection Strategy

### Choosing the Right Profile

| Your Role | Recommended Profile | Why |
|-----------|-------------------|-----|
| Full-Stack Developer | `developers` | TDD, code review, testing, debugging |
| System Architect | `architects` | Design patterns, system architecture, documentation |
| DevOps Engineer | `developers` + selective skills | Core dev skills + deployment-patterns |
| Tech Lead | `developers` + `architects` | Both development and architecture skills |
| Security Engineer | `security` | Security review, vulnerability scanning |
| Content Writer | `content-creators` | Writing, design, presentations |
| Researcher | `learning` | Research, education, knowledge building |
| Entrepreneur | `entrepreneurs` | Fundraising, pitching, market research |

### Combining Profiles

```bash
# Install base profile for your primary role
cepheid profile install developers

# Add complementary skills from other profiles
cepheid skill enable everything-claude-code/deployment-patterns
cepheid skill enable anthropic-agent-skills/mcp-builder

# Or install a second profile if roles overlap
cepheid profile install architects
```

**Best practice:** Start with one profile, learn it thoroughly, then expand.

### Profile Customization

```bash
# After installing a profile, disable skills you don't use
cepheid skill disable skill-name

# Add your own custom skills
cepheid skills add my-workflow https://example.com/my-skill.md

# Create a backup of your customized setup
cepheid backup save my-custom-dev-setup
```

---

## Skill Management Best Practices

### Skill Lifecycle Management

#### 1. Discovery Phase

```bash
# Browse available skills
cepheid skills list

# Search for specific needs
cepheid skills search "test"

# Check skill categories
cepheid skills list --category quality
```

#### 2. Evaluation Phase

```bash
# Read skill details before installing
cepheid skills info confidence-check

# Check requirements and ratings
# - Look for star ratings (5 stars = highly recommended)
# - Check requirements (runtime, API keys, etc.)
# - Read warnings and notes
```

#### 3. Installation Phase

```bash
# Install one skill at a time initially
cepheid install confidence-check

# Test the skill with Claude Code
# (Ask Claude to use the skill)

# If useful, install related skills
cepheid install self-check-protocol
```

#### 4. Usage Phase

```bash
# List enabled skills to remember what's available
cepheid skill enabled

# Reference skills explicitly in prompts
"Use the confidence-check skill before starting this task"
```

#### 5. Maintenance Phase

```bash
# Periodically update skills
cepheid update

# Remove unused skills
cepheid skill disable unused-skill
cepheid uninstall unused-skill

# Back up your configuration
cepheid backup save weekly-backup-$(date +%Y%m%d)
```

### Skill Organization Strategy

**Organize by workflow stage:**

```
Pre-implementation:
  → confidence-check (assess before starting)
  → evidence-based-dev (research and verify)

During implementation:
  → wave-execution (parallel operations)
  → tdd-workflow (test-driven development)

Post-implementation:
  → self-check-protocol (validate completion)
  → code-reviewer (review before commit)
```

**Create mental checklists:**

```markdown
My Development Workflow:
1. New task? → confidence-check
2. Confidence <90%? → evidence-based-dev
3. Multi-file work? → wave-execution
4. Implementation? → tdd-workflow
5. Before commit? → self-check-protocol
6. Before PR? → code-reviewer
```

---

## Plugin Management Best Practices

### Essential Plugins Hierarchy

**Tier 1: Foundation (Install First)**
```bash
# Official Anthropic skills - production quality
cepheid plugin install anthropic-agent-skills
```

**Tier 2: Comprehensive Framework (Choose One)**
```bash
# TypeScript/Node.js users
cepheid plugin install everything-claude-code

# Python users or want MCP integration
pipx install superclaude && superclaude install
```

**Tier 3: Specialized Tools (As Needed)**
```bash
# Need persistent memory?
cepheid plugin install claude-mem

# Want enforced workflows?
cepheid plugin install superpowers
```

### Plugin Conflict Resolution

**Problem:** Multiple plugins with similar skills

**Solution 1: Selective Skill Enablement**
```bash
# Install both plugins
cepheid plugin install everything-claude-code
cepheid plugin install anthropic-agent-skills

# But only enable specific skills from each
cepheid skill enable everything-claude-code/tdd-workflow
cepheid skill enable anthropic-agent-skills/webapp-testing

# Disable overlapping skills to avoid confusion
cepheid skill disable duplicate-skill
```

**Solution 2: Plugin Prioritization**
```bash
# Decide which plugin's version of a skill you prefer
# Disable the other version

# Example: Both have code review skills
cepheid skill disable anthropic-code-review
# Keep: everything-claude-code/code-reviewer
```

### Plugin Update Strategy

```bash
# Check plugin info before updating
cepheid plugin info everything-claude-code

# Update specific plugin
cepheid plugin update everything-claude-code

# Update all plugins
cepheid plugin update

# After update, verify skills still work
cepheid skill enabled
```

**Best practice:** Update plugins one at a time, test after each update.

---

## Permission Template Strategy

### Template Selection Guide

| Template | Best For | Risk Level | Approval Frequency |
|----------|----------|------------|-------------------|
| `strict` | Production code, critical systems | Lowest | High (approve most operations) |
| `balanced` | Daily development | Low | Medium (approve risky ops) |
| `development` | Active coding sessions | Medium | Low (approve destructive ops) |
| `permissive` | Prototypes, experiments | High | Very Low (minimal approvals) |

### Environment-Based Strategy

```bash
# Production work
cepheid permissions apply strict

# Main development branch
cepheid permissions apply balanced

# Feature branch development
cepheid permissions apply development

# Spike/prototype work
cepheid permissions apply permissive
```

### Custom Permission Templates

```bash
# Export current permissions as a template
cepheid permissions export my-team-standard

# Share template with team (add to version control)
# Team members can apply:
cepheid permissions apply my-team-standard
```

**Use cases for custom templates:**
- Team-specific workflows
- Company security policies
- Project-specific requirements
- Language-specific patterns

### Permission Fine-Tuning

```bash
# Start with a base template
cepheid permissions apply balanced

# Add specific approvals for your workflow
cepheid permissions add "Bash(npm run deploy:*)"
cepheid permissions add "Bash(docker-compose:*)"

# Remove overly permissive rules
cepheid permissions remove "Bash(*)"

# Export customized template
cepheid permissions export my-balanced-plus
```

---

## Workflow Integration

### The Optimal Development Workflow

#### 1. Session Start

```bash
# Check what skills are enabled
cepheid skill enabled

# Apply appropriate permissions
cepheid permissions apply balanced

# Review installed plugins
cepheid plugin list --installed
```

#### 2. Before Starting a Task

**Use confidence-check skill:**
```
Me: "I need to add authentication to the API.
     Use the confidence-check skill first."

Claude: [Assesses confidence, identifies unknowns,
         asks clarifying questions if confidence < 90%]
```

**If confidence < 90%, use evidence-based-dev:**
```
Me: "Investigate authentication approaches using
     evidence-based-dev skill."

Claude: [Researches official docs, existing patterns,
         provides evidence-backed recommendations]
```

#### 3. During Implementation

**Use wave-execution for multi-file changes:**
```
Me: "Update error handling across all API endpoints.
     Use wave-execution pattern."

Claude: [Reads all files in parallel → Checkpoint →
         Applies changes in parallel → Verifies]
```

**Use TDD workflow:**
```
Me: "Implement user registration with TDD workflow."

Claude: [Writes tests first → Implements → Verifies → Refactors]
```

#### 4. Before Committing

**Use self-check-protocol:**
```
Me: "Run self-check-protocol before committing."

Claude: [4 questions + 7 red flags →
         Verifies tests, requirements, assumptions, evidence]
```

**Use code-reviewer (if enabled):**
```
Me: "Review the changes before committing."

Claude: [Systematic code review →
         Identifies issues → Suggests improvements]
```

#### 5. Session End

```bash
# Back up your configuration
cepheid backup save daily-$(date +%Y%m%d)

# Review what was accomplished
# (Check git log, test results, etc.)
```

### Workflow Automation with Hooks

If using everything-claude-code hooks:

```bash
# Enable strategic-compact hook for token efficiency
# Enable verification-loop for continuous validation
# Enable memory-persistence for session context

# Configure via .env or ECC_* environment variables
```

---

## Configuration Management

### Backup Strategy

**Daily backups:**
```bash
# Create automated backup script
cat > ~/backup-cepheid.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
cepheid backup save auto-backup-$DATE
# Keep last 7 days, delete older
find ~/.config/cepheid/backups -name "auto-backup-*" -mtime +7 -delete
EOF

chmod +x ~/backup-cepheid.sh
```

**Project-specific backups:**
```bash
# Before major changes
cepheid backup save before-major-refactor

# After finding optimal setup
cepheid backup save project-x-optimal-setup

# For team sharing
cepheid backup save team-standard-2024
```

### Configuration Sync Across Machines

```bash
# On machine 1 (export)
cepheid backup save my-setup
# Copy ~/.config/cepheid/backups/my-setup.json to shared location

# On machine 2 (import)
# Copy backup file to ~/.config/cepheid/backups/
cepheid backup restore my-setup
```

**Version control approach:**
```bash
# Add to your dotfiles repository
~/.dotfiles/
  └── cepheid/
      ├── config.json
      ├── custom-skills.json
      └── backups/
          └── standard-setup.json

# Restore on new machine
cepheid backup restore standard-setup
```

### Multi-Project Configuration

**Strategy:** Different skill sets for different projects

```bash
# Web app project
cepheid backup restore web-dev-setup
# (Includes: frontend-patterns, webapp-testing, etc.)

# CLI tool project
cepheid backup restore cli-tool-setup
# (Includes: testing, documentation, deployment)

# Data science project
cepheid backup restore data-science-setup
# (Includes: research, analysis, visualization)
```

---

## Performance Optimization

### Skill Loading Performance

**Problem:** Too many skills slow down Claude Code startup

**Solution:**
```bash
# Audit enabled skills
cepheid skill enabled

# Disable skills you haven't used in a month
cepheid skill disable rarely-used-skill

# Use profiles instead of individual skills (more efficient)
cepheid profile install developers
# vs
cepheid install skill1 skill2 skill3 skill4...
```

### Token Efficiency Best Practices

**Use confidence-check for token savings:**
```
ROI: 100-200 token investment → Save 5,000-50,000 tokens
(By preventing work in wrong direction)
```

**Use wave-execution for speed:**
```
Speed: 3.5x to 6x faster than sequential operations
(Parallel file operations, searches, tests)
```

**Use strategic-compact hook (if using everything-claude-code):**
```
Automatically compacts conversation history
Reduces token usage in long sessions
```

### Claude Code Optimization

```bash
# Minimize skill count
# Aim for: 5-15 skills, not 50+

# Disable skills during focused work
cepheid skill disable-all plugin-name
# Enable only what you need for current task
cepheid skill enable plugin-name/specific-skill

# Re-enable when needed
cepheid profile install developers  # Restores profile skills
```

---

## Security Best Practices

### Permission Template Discipline

**NEVER use permissive template for:**
- Production deployments
- Sensitive data handling
- Third-party API integrations
- Database migrations
- Security-related code

**Use strict template for:**
```bash
# Production deployments
cepheid permissions apply strict

# Security reviews
cepheid permissions apply strict

# Critical infrastructure changes
cepheid permissions apply strict
```

### Skill Source Verification

**Before installing skills:**

1. **Check source reputation**
   ```bash
   cepheid skills info skill-name
   # Look for:
   # - Star rating (prefer 4-5 stars)
   # - Official sources (Anthropic, Cepheid)
   # - Community trust indicators
   ```

2. **Review skill content**
   ```bash
   # Check the actual skill file before installing
   curl https://raw.githubusercontent.com/user/repo/main/skill.md
   # Read through the prompts - do they look safe?
   ```

3. **Start with official sources**
   - anthropic-agent-skills (official)
   - Cepheid bundled skills (confidence-check, etc.)
   - Highly-rated community skills (5 stars)

### API Key Management

**Never store API keys in skills or configs!**

```bash
# Bad: Hardcoded in skill
apiKey: "sk-1234567890abcdef"

# Good: Environment variables
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-..."

# Use .env files (git ignored)
echo "OPENAI_API_KEY=sk-..." >> .env
echo ".env" >> .gitignore
```

### Plugin Trust Levels

**Tier 1: Official (Highest Trust)**
- anthropic-agent-skills
- Cepheid bundled skills

**Tier 2: Community Verified (High Trust)**
- everything-claude-code (65k stars)
- superclaude (21k stars)

**Tier 3: Community (Medium Trust)**
- Well-maintained plugins (3+ months old)
- Active community (regular commits)
- Clear license

**Tier 4: Experimental (Low Trust)**
- New plugins (<3 months)
- No license
- Single maintainer
- Use with caution!

---

## Team Collaboration

### Standardized Team Setup

**Create team standard configuration:**

```bash
# Team lead sets up optimal configuration
cepheid profile install developers
cepheid permissions apply balanced
cepheid plugin install everything-claude-code
cepheid skill enable everything-claude-code/tdd-workflow
cepheid skill enable anthropic-agent-skills/code-reviewer

# Export as team standard
cepheid backup save team-standard-v1
```

**Team members replicate:**

```bash
# Share team-standard-v1.json via git/docs
# Each team member:
cepheid backup restore team-standard-v1
```

### Code Review Integration

**Before creating PR:**

```bash
# Run self-check-protocol
"Use self-check-protocol to verify this PR is ready"

# Run code-reviewer skill (if enabled)
"Review all changes in this branch"

# Verify all tests pass
npm test

# Ensure no untracked files
git status
```

### Onboarding New Team Members

**Day 1 Setup Script:**

```bash
#!/bin/bash
# new-developer-setup.sh

echo "Installing Cepheid..."
npm install -g cepheid

echo "Applying team standard configuration..."
cepheid backup restore team-standard-v1

echo "Installing team plugins..."
cepheid plugin install everything-claude-code
cepheid plugin install anthropic-agent-skills

echo "Verifying setup..."
cepheid skill enabled
cepheid permissions show

echo "Setup complete! Read BEST_PRACTICES.md for usage guidelines."
```

### Shared Skill Library

**Team-specific skills repository:**

```
company-claude-skills/
├── README.md
├── skills/
│   ├── company-code-review.md
│   ├── company-security-checklist.md
│   ├── company-deployment-procedure.md
│   └── company-api-standards.md
└── profiles/
    └── company-standard.json
```

**Team members install:**
```bash
cepheid skills add company-review https://github.com/company/skills/blob/main/skills/company-code-review.md
cepheid skills add company-security https://github.com/company/skills/blob/main/skills/company-security-checklist.md
```

---

## Quick Reference: Daily Workflows

### Morning Setup
```bash
cepheid skill enabled              # Check active skills
cepheid permissions apply balanced # Set permissions
```

### Starting a Task
```bash
# Ask Claude: "Use confidence-check skill"
# If <90% confidence: "Use evidence-based-dev skill to investigate"
```

### Multi-File Refactoring
```bash
# Ask Claude: "Use wave-execution pattern for this refactoring"
```

### Before Committing
```bash
# Ask Claude: "Run self-check-protocol"
npm test                           # Verify tests
```

### End of Day
```bash
cepheid backup save daily-$(date +%Y%m%d)
```

### Weekly Maintenance
```bash
cepheid update                     # Update all skills/plugins
cepheid plugin list --installed    # Review what's installed
# Remove unused skills
```

---

## Common Pitfalls to Avoid

### ❌ Pitfall 1: Installing Too Many Skills

**Problem:** 50+ skills enabled, Claude is confused about which to use

**Solution:**
- Start with a profile (5-15 curated skills)
- Add incrementally as you discover specific needs
- Disable unused skills regularly

### ❌ Pitfall 2: Ignoring Permission Templates

**Problem:** Using default permissions, getting approval fatigue

**Solution:**
- Choose appropriate template for your work context
- Customize templates for your workflow
- Switch templates based on task risk level

### ❌ Pitfall 3: Never Updating

**Problem:** Missing bug fixes and new features

**Solution:**
```bash
# Monthly update routine
cepheid backup save pre-update-backup
cepheid update
# Test that everything still works
```

### ❌ Pitfall 4: Not Using Profiles

**Problem:** Manually installing/configuring skills one by one

**Solution:**
- Use profiles as starting point
- Customize from there
- Share customized profiles with team

### ❌ Pitfall 5: Inconsistent Workflow

**Problem:** Sometimes using skills, sometimes not

**Solution:**
- Create checklist of when to use each skill
- Make it muscle memory (confidence-check → implement → self-check)
- Integrate into IDE/terminal prompts

---

## Measuring Success

### Track Your Productivity Gains

**Token Efficiency:**
```
Before confidence-check: 50,000 tokens wasted on wrong direction
After confidence-check: 100-200 tokens → correct direction
Savings: 99.6% token reduction on failed attempts
```

**Execution Speed:**
```
Before wave-execution: 10 files × 30s = 5 minutes
After wave-execution: max(30s) = 30 seconds
Speedup: 10x faster
```

**Code Quality:**
```
Before self-check-protocol: 40% of "complete" tasks had issues
After self-check-protocol: 5% of tasks needed rework
Quality improvement: 8x reduction in rework
```

### Continuous Improvement

**Monthly review:**
```bash
# What skills did I use most?
# What skills did I never use? (disable them)
# What workflows are still manual? (find/create skills)
# Is my permission template still appropriate?
```

**Adapt and evolve:**
```bash
# Try new skills
cepheid install new-skill

# Test for a week
# Keep if valuable, remove if not
cepheid uninstall new-skill
```

---

## Getting Help

### Resources

- **Documentation**: README.md, QUICKSTART.md
- **Development Guide**: CLAUDE.md
- **Contributing**: CONTRIBUTING.md
- **GitHub Issues**: https://github.com/g7tianyi/cepheid/issues

### Community

- Share your custom skills
- Contribute to profiles
- Submit plugin evaluations
- Report bugs and suggestions

### Best Practices Updates

This document will evolve with:
- New plugin discoveries
- Workflow optimizations
- Community feedback
- Claude Code updates

Check back regularly for updates!

---

**Remember:** Cepheid is a tool to amplify your productivity, not replace your judgment. Use skills as guides, but always apply critical thinking and adapt to your specific context.

**Happy coding!** 🚀
