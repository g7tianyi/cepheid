# Documentation Generator Skill

You are generating comprehensive documentation. Follow these guidelines:

## Documentation Types

### README.md
Essential sections:
1. **Project Title & Description**: What it does (1-2 sentences)
2. **Features**: Key capabilities (bullet list)
3. **Installation**: Step-by-step setup
4. **Quick Start**: Minimal example to get running
5. **Usage Examples**: Common use cases with code
6. **Configuration**: Available options
7. **API Reference**: Link to detailed docs
8. **Contributing**: How to contribute
9. **License**: License information

### API Documentation
For each public function/class:
- **Purpose**: What it does
- **Parameters**: Name, type, description, required/optional
- **Returns**: Type and description
- **Throws**: Possible errors
- **Examples**: Usage examples
- **Notes**: Important considerations

### Architecture Documentation
- **Overview**: High-level system design
- **Components**: Main modules and their responsibilities
- **Data Flow**: How data moves through the system
- **Design Decisions**: Why things are done this way
- **Diagrams**: Visual representations (use Mermaid)

## Documentation Principles

### Be Clear and Concise
- Use simple language
- Avoid jargon (or explain it)
- Short sentences and paragraphs
- Active voice

### Be Complete
- Cover all public APIs
- Include edge cases
- Document error conditions
- Provide examples

### Be Accurate
- Keep docs in sync with code
- Test all code examples
- Update when changing behavior

### Be Helpful
- Explain the "why", not just the "what"
- Provide context
- Anticipate questions
- Include troubleshooting section

## Code Example Format

````markdown
```typescript
// Brief description of what this does
const result = myFunction(param1, param2);

// Explain any non-obvious behavior
console.log(result); // Expected output
```
````

## Common Documentation Patterns

### Function Documentation
```typescript
/**
 * Calculates the total price including tax
 *
 * @param price - Base price before tax
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Total price including tax
 * @throws {Error} If price or taxRate is negative
 *
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.08);
 * console.log(total); // 108
 * ```
 */
function calculateTotal(price: number, taxRate: number): number {
  // implementation
}
```

### Class Documentation
```typescript
/**
 * Manages user authentication and session handling
 *
 * @remarks
 * This class uses JWT tokens for authentication.
 * Tokens expire after 24 hours.
 *
 * @example
 * ```typescript
 * const auth = new AuthManager(config);
 * const token = await auth.login(email, password);
 * ```
 */
class AuthManager {
  // implementation
}
```

## When Generating Documentation

1. Analyze the code structure
2. Identify public APIs
3. Understand the purpose and context
4. Generate documentation following the appropriate template
5. Include practical examples
6. Add troubleshooting section if applicable
7. Ensure all links work
8. Verify code examples are correct
