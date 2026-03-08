# Contributing to Cepheid

Thank you for your interest in contributing to Cepheid! This guide will help you get started.

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the existing issues to see if it's already reported
2. Try to reproduce the issue with the latest version

When creating a bug report, include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior vs actual behavior
- Your environment (OS, Node version, etc.)
- Error messages and stack traces

### Suggesting Features

Feature suggestions are welcome! Please include:
- Clear description of the feature
- Use case (why is this useful?)
- Possible implementation approach (optional)

### Adding Skills

Skills are one of the most valuable contributions! To add a new skill:

1. **Choose a category** or create a new one:
   - `code-quality/` - Testing, review, refactoring
   - `documentation/` - Docs generation, API docs
   - `deployment/` - Deploy checks, versioning
   - `development/` - Debugging, performance

2. **Create skill directory**:
   ```
   skills/<category>/<skill-name>/
   ├── skill.yaml    # Metadata
   └── skill.md      # Skill prompt
   ```

3. **skill.yaml format**:
   ```yaml
   name: skill-name
   version: 1.0.0
   description: Brief description (one sentence)
   category: category-name
   author: Your Name
   tags:
     - tag1
     - tag2
   keywords:
     - keyword1
     - keyword2
   ```

4. **skill.md guidelines**:
   - Clear, actionable instructions
   - Structured with headings
   - Include examples
   - Checklists are great
   - Explain the "why", not just the "what"

5. **Test your skill**:
   ```bash
   npm run build
   ./dist/cli.js install <your-skill>
   # Test it with Claude Code
   ```

### Adding Permission Templates

To add a new permission template:

1. **Create template file**: `templates/<name>.yaml`

2. **Template format**:
   ```yaml
   name: template-name
   description: Brief description
   autoApprove:
     - Read(**)
     - Bash(git status:*)
     # ... more rules
   ```

3. **Guidelines**:
   - Name should describe use case (e.g., "backend-dev", "frontend-only")
   - Description should explain when to use it
   - Order rules from least to most permissive
   - Add comments for unusual rules

4. **Test the template**:
   ```bash
   npm run build
   ./dist/cli.js permissions apply <template-name>
   ./dist/cli.js permissions show
   ```

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/cepheid.git
cd cepheid

# Install dependencies
npm install

# Build
npm run build

# Run locally
./dist/cli.js --help

# Development mode (watch)
npm run dev
```

## Code Style

- Use TypeScript with strict mode
- Follow existing code patterns
- Prefer explicit types over `any`
- Use async/await over promises
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Pull Request Process

1. **Fork the repository**

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature
   # or
   git checkout -b skill/your-skill
   ```

3. **Make your changes**:
   - Follow the code style
   - Add tests if applicable
   - Update documentation

4. **Test your changes**:
   ```bash
   npm run build
   npm run typecheck
   # Test CLI commands
   ```

5. **Commit with clear messages**:
   ```bash
   git commit -m "Add skill: performance profiling"
   # or
   git commit -m "Fix: Handle missing config file gracefully"
   ```

6. **Push and create PR**:
   ```bash
   git push origin feature/your-feature
   ```

7. **In your PR description, include**:
   - What the change does
   - Why it's needed
   - How to test it
   - Screenshots (if UI changes)

## Skill Quality Guidelines

Good skills should:
- **Be focused**: One skill, one purpose
- **Be actionable**: Clear steps Claude Code can follow
- **Be structured**: Use headings, lists, code blocks
- **Provide context**: Explain why, not just what
- **Include examples**: Show concrete examples
- **Be thorough**: Cover edge cases and common pitfalls

Example skill structure:
```markdown
# Skill Name

Brief description of what this skill does.

## When to Use This Skill

Explain when this skill is appropriate.

## Process

### Step 1: First Thing
Details about first step...

### Step 2: Second Thing
Details about second step...

## Best Practices

- Tip 1
- Tip 2

## Common Pitfalls

- Pitfall 1 and how to avoid it
- Pitfall 2 and how to avoid it

## Examples

### Example 1
\`\`\`typescript
// Code example
\`\`\`

## Checklist

- [ ] Item 1
- [ ] Item 2
```

## Questions?

Feel free to open an issue for:
- Questions about contributing
- Help with development setup
- Clarification on guidelines

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming community

Thank you for contributing to Cepheid!
