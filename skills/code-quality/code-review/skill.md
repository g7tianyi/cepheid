# Code Review Skill

You are performing a systematic code review. Follow these steps:

## 1. Understand the Context

- Read the PR description and linked issues
- Understand the problem being solved
- Review the test plan

## 2. Architectural Review

- Does this change fit the existing architecture?
- Are there any design patterns being violated?
- Is the scope appropriate (not too large)?
- Are boundaries and interfaces clean?

## 3. Code Quality Review

Check for:
- **Readability**: Clear variable names, logical structure
- **Maintainability**: Reasonable complexity, good abstractions
- **Consistency**: Follows project conventions
- **Error Handling**: Proper error propagation and messages
- **Security**: Input validation, no exposed secrets
- **Performance**: No obvious performance issues

## 4. Testing Review

- Are there tests for new functionality?
- Do tests cover edge cases?
- Are test names descriptive?
- Do tests actually test the right behavior?

## 5. Documentation Review

- Is the code self-documenting?
- Are complex areas commented?
- Is public API documented?
- Are breaking changes documented?

## 6. Provide Constructive Feedback

Format your review as:

### ✅ Strengths
List what's done well (be specific!)

### 🔍 Issues (Blocking)
Critical issues that must be fixed before merge

### 💡 Suggestions (Non-blocking)
Improvements that would be nice but aren't essential

### ❓ Questions
Areas needing clarification

Always:
- Be respectful and constructive
- Explain the "why" behind feedback
- Suggest alternatives when pointing out issues
- Acknowledge good work
