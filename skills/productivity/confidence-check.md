# Confidence Check

A systematic approach to assess task confidence before starting implementation, saving significant tokens and preventing wrong directions.

**Inspired by SuperClaude Framework's Confidence-First Implementation pattern.**

## Overview

Before implementing any non-trivial task, assess your confidence level (0-100%) and take appropriate action based on the threshold. This 100-200 token investment can save 5,000-50,000 tokens by preventing work in the wrong direction.

## When to Use This Skill

Use confidence check for:
- Non-trivial implementation tasks
- Unfamiliar codebases or technologies
- Requirements that aren't crystal clear
- Tasks involving external dependencies or APIs
- Architectural decisions
- Refactoring with unclear scope

**Do NOT use for:**
- Trivial changes (typo fixes, simple formatting)
- Well-understood, routine tasks
- When requirements are 100% clear with examples

## Process

### Step 1: Initial Assessment

Before starting ANY task, explicitly state your confidence level:

```
🎯 Confidence Assessment
Task: [Brief description]
Confidence Level: X%

Reasoning:
- [Factor 1 affecting confidence]
- [Factor 2 affecting confidence]
- [Factor 3 affecting confidence]
```

### Step 2: Decision Based on Confidence Level

#### ✅ High Confidence (≥90%)

**Action:** Proceed with implementation

**Indicators:**
- Clear understanding of requirements
- Know the exact approach to take
- Familiar with relevant APIs/libraries
- Have concrete examples or patterns to follow
- Can predict potential edge cases

**Example:**
```
Confidence: 95%
Reasoning:
- Requirement is clearly specified with examples
- I've implemented similar features before
- All necessary APIs are well-documented
- Test cases are provided
Ready to proceed with implementation.
```

#### 🔍 Medium Confidence (70-89%)

**Action:** Investigate before implementing

**What to do:**
1. **Read official documentation** for unfamiliar APIs/libraries
2. **Search existing codebase** for similar patterns
3. **Review test files** to understand expected behavior
4. **Check dependencies** and their versions
5. **Clarify edge cases** that aren't obvious

**Example:**
```
Confidence: 80%
Reasoning:
- General approach is clear
- But unfamiliar with specific API methods
- Need to check how similar features are implemented

Investigation needed:
1. Read [Library X] documentation for authentication methods
2. Search codebase for existing auth patterns
3. Review test files for expected error handling

Estimated investigation time: 5 minutes
```

After investigation, re-assess confidence. If ≥90%, proceed. If still <90%, continue investigation or ask questions.

#### ❌ Low Confidence (<70%)

**Action:** STOP and ask clarifying questions

**What to do:**
1. **List specific uncertainties** preventing high confidence
2. **Formulate clear questions** for the user
3. **Propose alternatives** if applicable
4. **DO NOT** proceed with implementation

**Example:**
```
Confidence: 60%
Reasoning:
- Requirement is ambiguous about error handling
- Unclear which database tables to modify
- Don't know if existing migration system should be used

Questions needed:
1. Should validation errors return 400 or 422 status code?
2. Which tables need the new 'status' column: users, orders, or both?
3. Should I create a new migration file or modify the existing one?

Proposing we clarify these before implementation.
```

### Step 3: Document Assumptions

Even at high confidence, document key assumptions:

```
Assumptions:
1. [Assumption 1] - based on [evidence/pattern]
2. [Assumption 2] - inferred from [existing code]
3. [Assumption 3] - following [convention]
```

This helps catch issues early and provides context for review.

### Step 4: Proceed with Confidence

Once confidence ≥90%, proceed with implementation while:
- Continuously validating assumptions against actual results
- Stopping if confidence drops below 70% during implementation
- Documenting unexpected findings

## Confidence Factors

### Factors that INCREASE confidence:
- ✅ Clear, specific requirements with examples
- ✅ Official documentation available
- ✅ Similar patterns exist in codebase
- ✅ Test cases provided or easily inferred
- ✅ APIs/libraries are familiar
- ✅ Edge cases are well-defined
- ✅ Success criteria are measurable

### Factors that DECREASE confidence:
- ❌ Vague or ambiguous requirements
- ❌ Unfamiliar technology/library
- ❌ No similar patterns in existing code
- ❌ Unclear edge case handling
- ❌ Missing or outdated documentation
- ❌ Conflicting information sources
- ❌ Multiple valid approaches without clear preference

## Examples

### Example 1: High Confidence

```
Task: Add logging to the authentication middleware

🎯 Confidence Assessment: 95%

Reasoning:
✅ Middleware structure is clear from existing code
✅ Logging library (winston) already configured
✅ Similar logging exists in other middlewares
✅ Requirements specify exact log levels and fields

Assumptions:
1. Use info level for successful auth, warn for failures
2. Include userId, timestamp, and IP in log context
3. Follow existing format: [timestamp] [level] [context]

Proceeding with implementation.
```

### Example 2: Medium Confidence → Investigation

```
Task: Implement rate limiting for API endpoints

🎯 Initial Confidence: 75%

Reasoning:
✅ General concept is clear (limit requests per time window)
❌ Unsure which rate limiting library is preferred
❌ Don't know if limits should be per-user or per-IP
❌ Unclear what happens when limit is exceeded

Investigation:
1. Checking package.json for existing rate-limit dependencies
   → Found: express-rate-limit v6.2.0
2. Searching codebase for "rate" and "limit"
   → Found: rate limiting on /api/auth/* endpoints (100 req/15min per IP)
3. Reading express-rate-limit docs
   → Understood: middleware config, response format

🎯 Updated Confidence: 92%

New understanding:
✅ Use express-rate-limit (already installed)
✅ Apply per-IP (matches existing pattern)
✅ Return 429 status with Retry-After header
✅ Pattern to follow: src/middleware/authRateLimit.ts

Proceeding with implementation.
```

### Example 3: Low Confidence → Questions

```
Task: Refactor user permissions system to support hierarchical roles

🎯 Confidence: 55%

Reasoning:
❌ "Hierarchical roles" not clearly defined
❌ Don't know if existing permissions should be preserved
❌ Unclear if this affects database schema
❌ No example of desired hierarchy provided

Critical questions:
1. What does "hierarchical" mean in this context?
   - Admin > Manager > User?
   - Role inheritance (Manager inherits User permissions)?
   - Multi-level tree structure?

2. Should existing role checks be backwards-compatible?
   - If code checks `user.role === 'admin'`, should this still work?

3. Database migration strategy:
   - Add new tables for role hierarchy?
   - Modify existing users table?
   - Migration path for existing data?

4. Can you provide an example scenario?
   - E.g., "An Editor should have all Viewer permissions plus X, Y, Z"

⛔ Stopping implementation until these are clarified.
```

## Red Flags

Stop and reassess if you notice:

- 🚩 **"I think this might work"** → Low confidence, investigate more
- 🚩 **Multiple false starts** → Requirements unclear, ask questions
- 🚩 **Guessing at API behavior** → Read documentation, don't assume
- 🚩 **"Let me try this approach"** → If experimenting, confidence is too low
- 🚩 **Changing approach mid-implementation** → Original confidence was misplaced
- 🚩 **Extensive commenting to explain "why"** → Complexity suggests uncertainty

## Benefits

### Token Efficiency
- **100-200 tokens** invested in confidence check
- **Saves 5,000-50,000 tokens** by avoiding wrong direction
- **ROI: 25x to 250x** in token savings

### Quality Improvements
- Fewer implementation errors from misunderstood requirements
- Faster development (no backtracking)
- Better documentation of assumptions
- Clear communication with users about uncertainties

### Risk Mitigation
- Catches ambiguities before implementation
- Prevents "works but wrong" implementations
- Reduces technical debt from hasty decisions

## Checklist

Before starting ANY non-trivial task:

- [ ] Explicitly assess confidence (0-100%)
- [ ] Document reasoning for confidence level
- [ ] If <70%: Formulate questions and STOP
- [ ] If 70-89%: Conduct investigation, then re-assess
- [ ] If ≥90%: Document assumptions and proceed
- [ ] Monitor confidence during implementation
- [ ] Stop if confidence drops below 70% mid-task

## Integration with Other Skills

This skill works well with:
- **Self-Check Protocol** - Validate after implementation
- **Evidence-Based Development** - Investigation phase requires evidence
- **TDD Workflow** - High confidence needed before writing tests
- **Code Review** - Documented assumptions help reviewers

---

**Remember:** Spending 100-200 tokens on a confidence check is always cheaper than spending 5,000-50,000 tokens going in the wrong direction. When in doubt, investigate or ask questions.
