# Self-Check Protocol

A systematic validation framework to verify implementations meet requirements and avoid common pitfalls before marking tasks complete.

**Inspired by SuperClaude Framework's SelfCheckProtocol with 7 red flag detections.**

## Overview

After completing any implementation, run through the Self-Check Protocol to validate correctness. This catches common errors that tests might miss and ensures genuine completion rather than false positives.

## When to Use This Skill

Use Self-Check Protocol:
- ✅ After completing any implementation task
- ✅ Before marking a task as "done"
- ✅ After tests pass (to verify tests are meaningful)
- ✅ Before committing code
- ✅ After refactoring to verify behavior unchanged
- ✅ When debugging to validate fixes

## The Four Fundamental Questions

Every completed implementation MUST answer YES to all four questions:

### 1. Are the tests passing?

**What to verify:**
- All existing tests still pass
- New tests for new functionality pass
- No tests were skipped or commented out
- Test output shows actual execution (not cached)

**How to verify:**
```bash
# Run tests and verify output
npm test

# Check for:
✅ All tests executed (not skipped)
✅ Clear pass/fail output visible
✅ No warnings about missing tests
✅ Coverage reports show new code tested
```

**Red flags:**
- 🚩 "Tests pass" but no test output shown
- 🚩 Tests were skipped with `.skip()` or `xit()`
- 🚩 Tests commented out to make build pass
- 🚩 Only tested "happy path", no edge cases

### 2. Do the changes meet ALL stated requirements?

**What to verify:**
- Every requirement in the task is addressed
- Edge cases mentioned are handled
- Performance requirements met (if specified)
- Security requirements satisfied
- Accessibility requirements fulfilled

**How to verify:**
```markdown
Requirements checklist:
- [x] Requirement 1: [Evidence of completion]
- [x] Requirement 2: [Evidence of completion]
- [x] Requirement 3: [Evidence of completion]
- [x] Edge case A: [How handled]
- [x] Edge case B: [How handled]
```

**Red flags:**
- 🚩 "Mostly done" or "except for X"
- 🚩 Partial implementation claiming completeness
- 🚩 Ignored requirements without discussion
- 🚩 "Will add X later" for core requirements

### 3. Are there any unverified assumptions?

**What to verify:**
- All assumptions documented during implementation
- Each assumption validated against evidence
- No guesses about API behavior or side effects
- External dependencies verified to work as expected

**How to verify:**
```markdown
Assumptions made:
1. [Assumption 1]
   Verified by: [Documentation link / test result / code inspection]

2. [Assumption 2]
   Verified by: [Official docs / existing pattern / API response]

3. [Assumption 3]
   Verified by: [Test case / manual verification / spec]
```

**Red flags:**
- 🚩 "Assuming this works because..."
- 🚩 "Should work in production" (without verification)
- 🚩 "Based on how I think it works"
- 🚩 Untested integration with external services

### 4. Can you provide evidence for all claims?

**What to verify:**
- Test output demonstrates claimed functionality
- Performance claims backed by benchmarks
- Security claims verified by specific tests
- Compatibility claims tested in target environments

**How to verify:**
```markdown
Evidence:
- "Handles 1000 requests/sec": [Benchmark results]
- "Prevents SQL injection": [Test case with injection attempt]
- "Works in Safari 14+": [Manual test results]
- "Reduces bundle size by 20%": [Bundle analyzer output]
```

**Red flags:**
- 🚩 Claims without supporting evidence
- 🚩 "Tested locally" without showing results
- 🚩 "Should be faster" without measurements
- 🚩 "More secure" without security tests

## The Seven Red Flags

If ANY of these appear, STOP and fix before claiming completion:

### 🚩 Red Flag 1: Tests Pass Without Output

**Symptom:**
- Claiming "tests pass" but no test output visible
- No execution logs or results shown
- Tests might be cached or not actually run

**Why it's dangerous:**
- Can't verify tests actually executed
- Might be looking at stale results
- Cached test runs hide new failures

**How to fix:**
```bash
# Clear test cache and run fresh
npm test -- --no-cache --verbose

# Show actual test output
npm test 2>&1 | tee test-output.log

# Verify tests executed by checking timestamps
```

### 🚩 Red Flag 2: Implementation Complete with Failing Tests

**Symptom:**
- Code changes are "done"
- But some tests are failing
- Claiming "almost ready, just need to fix tests"

**Why it's dangerous:**
- Implementation might be fundamentally wrong
- Tests reveal unhandled cases
- False sense of completion

**How to fix:**
- ALL tests must pass before claiming completion
- If tests fail, implementation is NOT done
- Fix implementation to make tests pass (not the other way around)

### 🚩 Red Flag 3: Tests Modified to Pass (When They Shouldn't Be)

**Symptom:**
- Changed test expectations to match new output
- Made tests less strict to pass
- Removed assertions that were "too strict"

**Why it's dangerous:**
- Tests might have been catching real bugs
- Lowering test standards hides regressions
- Original test intent lost

**How to fix:**
```markdown
Before changing any test:
1. Understand WHY the test is failing
2. Is the failure due to a bug in implementation?
3. Is the test expectation actually wrong?
4. Document reason for test change in commit message

Only change tests if:
✅ Original test expectation was incorrect
✅ Requirements explicitly changed
✅ Test was testing implementation details (not behavior)

Never change tests to:
❌ Make failing tests pass without fixing code
❌ Reduce test coverage
❌ Skip edge case validation
```

### 🚩 Red Flag 4: Assumptions About Undocumented Behavior

**Symptom:**
- "I think the API returns X format"
- "Probably works like this..."
- "Should behave similar to..."
- No documentation or evidence cited

**Why it's dangerous:**
- Undocumented behavior can change
- Assumptions might be wrong
- Leads to brittle code

**How to fix:**
```markdown
Replace assumptions with verification:

❌ Assumption: "API probably returns 404 on missing resource"
✅ Verification: "API documentation states: Returns 404 for missing resources"
✅ Evidence: [Link to docs] + [Test case demonstrating 404 response]

❌ Assumption: "This function likely handles null"
✅ Verification: Read function source code, confirmed null check on line 42
✅ Evidence: [Link to source] + [Test with null input]
```

### 🚩 Red Flag 5: "Works on My Machine" Without Cross-Environment Verification

**Symptom:**
- Only tested locally
- No CI/CD verification
- Different OS/browser not tested
- Database version differences ignored

**Why it's dangerous:**
- Environment-specific bugs missed
- Production might have different config
- Other developers can't reproduce

**How to fix:**
```markdown
Verification checklist:
- [ ] Tests pass in CI/CD environment
- [ ] Tested on target OS (if OS-specific code)
- [ ] Tested in target browsers (if frontend)
- [ ] Database migrations tested on same DB version as production
- [ ] Environment variables documented and tested
```

### 🚩 Red Flag 6: Partial Implementation Claimed as Complete

**Symptom:**
- "Implemented feature X (except for Y)"
- "Core functionality done, edge cases TODO"
- "Works for basic case, will handle errors later"

**Why it's dangerous:**
- Incomplete features cause bugs
- "Later" often never happens
- Unclear what remains to be done

**How to fix:**
```markdown
Option A: Complete the implementation
- Finish all requirements including edge cases
- Handle all error scenarios
- Add complete test coverage

Option B: Explicitly scope down and document
- "Implementing ONLY basic login flow"
- "Error handling will be separate task: #123"
- "Edge cases X, Y, Z deferred with user approval"
- Create tickets for remaining work
```

### 🚩 Red Flag 7: No Evidence for Performance/Security Claims

**Symptom:**
- "This is faster" (no benchmark)
- "More secure" (no security tests)
- "Optimized" (no before/after comparison)
- "Scales better" (no load tests)

**Why it's dangerous:**
- Claims might be false
- Can't verify improvements
- Regression goes undetected

**How to fix:**
```markdown
Every claim needs evidence:

Claim: "Reduced API response time by 40%"
Evidence:
- Before: 500ms average (benchmark results attached)
- After: 300ms average (benchmark results attached)
- Test: 1000 requests, p50/p95/p99 percentiles measured

Claim: "Prevents XSS attacks"
Evidence:
- Test case with <script> injection (sanitized correctly)
- Test case with event handlers (escaped properly)
- Security review checklist completed
- OWASP XSS prevention cheat sheet followed
```

## Self-Check Process

### Step 1: Run the Four Questions

Go through each question and provide explicit answers:

```markdown
## Self-Check Protocol

### 1. Are tests passing?
[YES/NO]
Evidence: [Test output / CI status]

### 2. Do changes meet ALL requirements?
[YES/NO]
Requirements checklist:
- [x] Requirement 1: [Evidence]
- [x] Requirement 2: [Evidence]

### 3. Any unverified assumptions?
[NONE/LIST]
Assumptions verified:
- [List with evidence]

### 4. Evidence for all claims?
[YES/NO]
Claims with evidence:
- [List with proof]
```

### Step 2: Scan for Red Flags

Check each of the seven red flags:

```markdown
## Red Flag Check

- [ ] 🚩 Tests pass without output?
- [ ] 🚩 Implementation complete with failing tests?
- [ ] 🚩 Tests modified to pass incorrectly?
- [ ] 🚩 Assumptions about undocumented behavior?
- [ ] 🚩 "Works on my machine" only?
- [ ] 🚩 Partial implementation claimed as complete?
- [ ] 🚩 Claims without evidence?

✅ All clear - no red flags detected
```

### Step 3: Fix Any Issues

If any question is NO or any red flag is present:
1. **STOP** - Do not claim task is complete
2. **Document** - What's missing or wrong
3. **Fix** - Address the specific issue
4. **Verify** - Run self-check again
5. **Repeat** - Until all checks pass

### Step 4: Document the Check

Include self-check results in commit message or PR:

```markdown
## Implementation Complete

✅ All tests passing (see test output below)
✅ All requirements met (checklist above)
✅ No unverified assumptions
✅ Evidence provided for all claims
✅ No red flags detected

Self-Check Protocol: PASSED
```

## Examples

### Example 1: Failed Self-Check (Tests Pass Without Output)

```markdown
Task: Add email validation to user registration

Initial claim:
"Implementation complete, all tests passing ✅"

Self-Check Protocol:

1. Are tests passing?
   ❌ NO - Claiming tests pass but no output shown

2. Do changes meet ALL requirements?
   ⏸️  Can't verify without test evidence

Red Flag Detected: 🚩 Tests pass without output

Action: Running tests with verbose output

$ npm test -- --verbose
  ✓ validates email format (45ms)
  ✓ rejects invalid emails (12ms)
  ✗ allows valid international emails
    Expected: true
    Received: false

Result: Tests are NOT actually passing! International email validation is broken.

Corrected status: Implementation NOT complete
Next step: Fix international email validation
```

### Example 2: Successful Self-Check

```markdown
Task: Implement pagination for user list API

Self-Check Protocol:

1. ✅ Are tests passing?
   YES - Test output:
   ```
   PASS  src/api/users.test.ts
     GET /api/users
       ✓ returns first page by default (34ms)
       ✓ returns requested page number (28ms)
       ✓ returns correct page size (22ms)
       ✓ handles page overflow gracefully (19ms)
       ✓ includes pagination metadata (15ms)

   Tests: 5 passed, 5 total
   ```

2. ✅ Do changes meet ALL requirements?
   YES - Requirements checklist:
   - [x] Default page size: 20 (verified in test: user.test.ts:45)
   - [x] Accepts ?page= parameter (verified in test: user.test.ts:52)
   - [x] Accepts ?pageSize= parameter (verified in test: user.test.ts:58)
   - [x] Returns total count in metadata (verified in test: user.test.ts:65)
   - [x] Returns empty array for page beyond last (verified in test: user.test.ts:71)

3. ✅ No unverified assumptions
   All assumptions verified:
   - Assumption: Sequelize offset/limit handles pagination
     Verified: Sequelize docs + existing pattern in posts.service.ts:123

   - Assumption: Client expects metadata in response.pagination
     Verified: API spec document + frontend code in UserList.tsx:78

4. ✅ Evidence for all claims
   - "Handles 1000 users efficiently": Load test shows <100ms response time
   - "Backward compatible": Existing API calls without pagination still work
   - "Follows REST conventions": Uses standard ?page and ?pageSize query params

Red Flag Check:
- [x] 🚩 Tests pass without output? NO - output shown above
- [x] 🚩 Implementation complete with failing tests? NO - all 5 tests pass
- [x] 🚩 Tests modified incorrectly? NO - no existing tests changed
- [x] 🚩 Undocumented assumptions? NO - all verified with evidence
- [x] 🚩 Works on my machine only? NO - passes in CI (run #1847)
- [x] 🚩 Partial implementation? NO - all requirements complete
- [x] 🚩 Claims without evidence? NO - evidence provided above

✅ Self-Check Protocol: PASSED
Implementation is genuinely complete.
```

### Example 3: Catching Unverified Assumption

```markdown
Task: Integrate with Stripe payment API

Initial claim:
"Payment processing implemented and tested ✅"

Self-Check Protocol:

1. ✅ Are tests passing?
   YES - All 8 tests pass (output shown)

2. ✅ Do changes meet requirements?
   YES - All requirements addressed

3. ❌ Unverified assumptions?
   RED FLAG DETECTED:

   Assumption: "Stripe webhooks are delivered within 5 seconds"
   Verification: None - just assumed based on testing

   Assumption: "Webhook signature validation prevents replay attacks"
   Verification: None - trusted Stripe library without checking

Red Flag: 🚩 Assumptions about undocumented behavior

Action: Verifying assumptions

Research findings:
1. Stripe webhook delivery time:
   - NOT guaranteed to be within 5 seconds
   - Can be delayed during incidents
   - Should handle delayed webhooks gracefully

2. Webhook signature validation:
   - DOES prevent tampering
   - Does NOT prevent replay attacks (no timestamp check)
   - Need to add timestamp validation

Result: Implementation NOT complete
Issues found:
- Need to handle delayed webhooks (don't timeout after 5 sec)
- Need to add replay attack prevention (check timestamp)

Next steps:
1. Remove 5-second timeout assumption
2. Add timestamp-based replay prevention
3. Re-run self-check protocol
```

## Integration with Other Skills

This skill complements:
- **Confidence Check** - Verify assumptions made during planning
- **TDD Workflow** - Validate tests are meaningful, not just passing
- **Code Review** - Provide evidence for reviewers
- **Evidence-Based Development** - All claims backed by evidence

## Quick Reference Card

Print this and keep it visible:

```
╔══════════════════════════════════════════════╗
║       SELF-CHECK PROTOCOL CHECKLIST          ║
╠══════════════════════════════════════════════╣
║ Before claiming ANY task is complete:        ║
║                                              ║
║ Four Questions:                              ║
║  1. □ Tests passing? (show output)           ║
║  2. □ ALL requirements met?                  ║
║  3. □ Assumptions verified?                  ║
║  4. □ Evidence for claims?                   ║
║                                              ║
║ Seven Red Flags:                             ║
║  1. □ Tests pass without output              ║
║  2. □ Complete with failing tests            ║
║  3. □ Tests modified incorrectly             ║
║  4. □ Undocumented assumptions               ║
║  5. □ "Works on my machine" only             ║
║  6. □ Partial implementation                 ║
║  7. □ Claims without evidence                ║
║                                              ║
║ ✅ ALL CHECKS MUST PASS                      ║
║ ❌ ANY FAILURE = NOT COMPLETE                ║
╚══════════════════════════════════════════════╝
```

---

**Remember:** Passing tests are necessary but not sufficient. The Self-Check Protocol ensures tests are meaningful and implementation is genuinely complete.
