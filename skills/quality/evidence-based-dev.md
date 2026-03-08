# Evidence-Based Development

A rigorous development methodology where every decision, assumption, and claim is backed by verifiable evidence from official sources, existing code, or concrete tests.

**Inspired by SuperClaude Framework's "Never Assume, Always Verify" principle.**

## Overview

Replace assumptions and guesswork with evidence-based decisions. Before implementing any feature, verify behavior through official documentation, existing code patterns, and test results. Never assume how something works—prove it.

## Core Principle

**NEVER ASSUME → ALWAYS VERIFY**

Every statement about system behavior must have one of these evidence types:
- 📚 Official documentation
- 🔍 Existing code inspection
- ✅ Test results
- 🧪 Experimental verification
- 📊 Benchmark data

## When to Use This Skill

Use Evidence-Based Development:
- ✅ When working with unfamiliar APIs or libraries
- ✅ Before making architectural decisions
- ✅ When debugging unexpected behavior
- ✅ During code reviews
- ✅ When documenting system behavior
- ✅ For performance optimization claims
- ✅ When integrating external services

**Required for:**
- All production code
- Public APIs
- Performance-critical sections
- Security-sensitive features

## Process

### Step 1: Identify Assumptions

Before writing code, list all assumptions:

```markdown
Planned implementation: Add caching to API endpoint

Assumptions to verify:
1. ❓ Response can be safely cached
2. ❓ Cache TTL of 5 minutes is appropriate
3. ❓ Redis is available as cache backend
4. ❓ Cache key collisions won't occur
5. ❓ Cached responses don't include user-specific data
```

### Step 2: Gather Evidence for Each Assumption

For EACH assumption, provide evidence:

```markdown
Assumption 1: Response can be safely cached
❌ UNVERIFIED - Need to check:
  → Is response deterministic for same input?
  → Are there side effects?
  → Does it include timestamps or user-specific data?

Evidence gathering:
1. Read endpoint implementation: src/api/users.ts:45-78
   ✅ Response is {id, name, email, createdAt}
   ✅ No side effects (pure GET request)
   ⚠️ Includes createdAt (but not current time)

2. Check API documentation: docs/api.md
   ✅ "GET /users/:id is idempotent"
   ✅ "Returns user object without session data"

Conclusion: ✅ SAFE TO CACHE (backed by code inspection + docs)
```

### Step 3: Convert Assumptions to Facts

Replace each assumption with evidence-backed fact:

```markdown
❌ Before (Assumption):
"The API probably returns 404 for missing users"

✅ After (Evidence-Based Fact):
"The API returns 404 for missing users"
Evidence:
- API spec (docs/api.md:123): "Returns 404 if user not found"
- Existing test (users.test.ts:56): Verifies 404 response
- Code implementation (users.ts:67): return res.status(404)
```

### Step 4: Document Evidence Trail

Keep evidence trail for future reference:

```markdown
Implementation Decision Log:

Decision: Use Redis for caching
Evidence:
- Infrastructure: Redis already deployed (ops/k8s/redis.yaml)
- Performance: 10x faster than database (benchmark: benchmarks/cache.md)
- Team familiarity: 3 other services use Redis (auth, sessions, tokens)
- Documentation: Official Redis docs for TTL support

Alternatives considered:
- In-memory cache: ❌ Doesn't survive restarts (requirement: persist across deploys)
- Memcached: ❌ Less feature-rich, team unfamiliar
- Database: ❌ Too slow (benchmark shows 100ms vs 10ms)

Decision backed by: Infrastructure + Performance + Team knowledge
```

## Evidence Sources (Ranked by Reliability)

### Tier 1: Official Sources (Highest Reliability)

1. **Official Documentation**
   ```markdown
   Source: Official React documentation
   URL: https://react.dev/reference/react/useState
   Quote: "React guarantees that setState calls are batched"
   Reliability: ⭐⭐⭐⭐⭐ (Authoritative)
   ```

2. **API Specifications**
   ```markdown
   Source: OpenAPI Specification (api-spec.yaml:123)
   Field: "required: true" for email parameter
   Reliability: ⭐⭐⭐⭐⭐ (Contract)
   ```

3. **Source Code (Library/Framework)**
   ```markdown
   Source: express/lib/router.js:456
   Code: if (!next) throw new Error('callback required')
   Reliability: ⭐⭐⭐⭐⭐ (Implementation truth)
   ```

### Tier 2: Project Sources (High Reliability)

4. **Existing Code Patterns**
   ```markdown
   Source: src/services/auth.ts:89-102
   Pattern: All services use try-catch with logger.error
   Instances: Found in 12 other service files
   Reliability: ⭐⭐⭐⭐ (Established pattern)
   ```

5. **Test Cases**
   ```markdown
   Source: tests/api/users.test.ts:67
   Test: "returns 404 when user not found"
   Status: ✅ Passing
   Reliability: ⭐⭐⭐⭐ (Tested behavior)
   ```

6. **Configuration Files**
   ```markdown
   Source: .env.example, config/database.ts
   Setting: DATABASE_POOL_SIZE=20
   Reliability: ⭐⭐⭐⭐ (Explicit configuration)
   ```

### Tier 3: Experimental Evidence (Medium Reliability)

7. **Manual Testing**
   ```markdown
   Experiment: Sent POST request with invalid email
   Result: Got 400 Bad Request with validation error
   Reproducible: Yes (3/3 attempts)
   Reliability: ⭐⭐⭐ (Empirical, but environment-specific)
   ```

8. **Benchmarks**
   ```markdown
   Benchmark: scripts/benchmark-cache.ts
   Result: Redis 10ms, Database 100ms
   Conditions: 1000 requests, warm cache
   Reliability: ⭐⭐⭐ (Measured, but context-dependent)
   ```

### Tier 4: Secondary Sources (Low Reliability)

9. **Stack Overflow / Forums**
   ```markdown
   Source: Stack Overflow (upvoted answer)
   Note: Useful for exploration, MUST verify with Tier 1-2 sources
   Reliability: ⭐⭐ (Requires verification)
   Action: Use as hint, then verify with official docs
   ```

10. **Assumptions / "Common Knowledge"**
    ```markdown
    Source: "I think..." / "Usually..." / "Probably..."
    Reliability: ⭐ (Unreliable)
    Action: ❌ NEVER use without verification
    ```

## Evidence-Based Patterns

### Pattern 1: API Behavior Verification

```markdown
❌ Assumption-Based:
"The API probably returns JSON with {success: boolean}"

✅ Evidence-Based:

Step 1: Check API documentation
  Source: docs/api.md:234
  Quote: "All endpoints return {success: boolean, data?: any, error?: string}"

Step 2: Verify in existing code
  Source: src/api/posts.ts:45
  Example: return {success: true, data: posts}

Step 3: Confirm with test
  Source: tests/api.test.ts:89
  Test: expect(response.body).toHaveProperty('success')

Conclusion: ✅ VERIFIED from 3 sources (docs + code + tests)
```

### Pattern 2: Performance Claim Verification

```markdown
❌ Assumption-Based:
"This should be faster because we're using Redis"

✅ Evidence-Based:

Step 1: Run benchmark BEFORE changes
  Script: npm run benchmark:api
  Result: GET /users avg 120ms (n=1000)

Step 2: Implement Redis caching

Step 3: Run benchmark AFTER changes
  Script: npm run benchmark:api
  Result: GET /users avg 15ms (n=1000)

Step 4: Calculate improvement
  Improvement: 120ms → 15ms (8x faster)
  Statistical significance: p < 0.01

Conclusion: ✅ PROVEN 8x speedup (measured, statistically significant)
Evidence: benchmarks/results/cache-implementation.md
```

### Pattern 3: Security Claim Verification

```markdown
❌ Assumption-Based:
"This prevents SQL injection"

✅ Evidence-Based:

Step 1: Understand protection mechanism
  Source: pg library documentation
  Quote: "Parameterized queries prevent SQL injection"

Step 2: Verify using parameterized queries
  Source: src/db/users.ts:67
  Code: db.query('SELECT * FROM users WHERE id = $1', [userId])
  ✅ Uses parameterized query (not string concatenation)

Step 3: Test with injection attempt
  Test: tests/security.test.ts:123
  Input: "1 OR 1=1"
  Result: No records returned (injection failed)
  Status: ✅ Passing

Step 4: Security scan
  Tool: npm audit, Snyk scan
  Result: No SQL injection vulnerabilities detected

Conclusion: ✅ SQL INJECTION PREVENTED (verified 4 ways)
Evidence: Documentation + Code review + Attack test + Security scan
```

### Pattern 4: Library Version Compatibility

```markdown
❌ Assumption-Based:
"React 18 hooks should work the same as React 17"

✅ Evidence-Based:

Step 1: Check package.json
  Source: package.json:14
  Version: "react": "^18.2.0"

Step 2: Read migration guide
  Source: https://react.dev/blog/2022/03/29/react-v18
  Finding: "useEffect behavior changed in Strict Mode"

Step 3: Identify affected code
  Search: Grep for "useEffect" in src/
  Found: 23 instances

Step 4: Review each instance
  Result: 3 useEffects have double-execution issues in dev mode

Step 5: Test in React 18
  Action: Run tests, verify behavior
  Status: Tests passing, but console warnings

Conclusion: ⚠️ COMPATIBILITY ISSUES found (3 useEffects need cleanup)
Evidence: Migration guide + Code search + Testing
Action Items: Fix 3 useEffects to handle React 18 Strict Mode
```

## Verification Techniques

### Technique 1: Documentation Deep Dive

```markdown
When: Using unfamiliar API/library

Process:
1. Find official documentation
2. Read relevant sections thoroughly
3. Note exact quotes (don't paraphrase)
4. Check version compatibility
5. Look for gotchas/warnings

Example:
Library: Stripe API
Need: Verify webhook signature validation prevents replay attacks

Research:
1. Find docs: https://stripe.com/docs/webhooks/signatures
2. Read thoroughly: 10 minutes
3. Key quote: "Verify timestamp to prevent replay attacks"
4. Code example provided: shows timestamp check
5. Warning found: "Signatures alone don't prevent replays"

Conclusion: Need BOTH signature validation AND timestamp check
Evidence: Official Stripe documentation (linked above)
```

### Technique 2: Code Archaeology

```markdown
When: Understanding existing system behavior

Process:
1. Find similar implementations in codebase
2. Study patterns and conventions
3. Check git history for context
4. Review related tests

Example:
Task: Implement rate limiting

Research:
1. Search: grep -r "rateLimit" src/
   Found: src/middleware/authRateLimit.ts

2. Read implementation:
   - Uses express-rate-limit library
   - 100 requests per 15 minutes
   - Per-IP tracking
   - Returns 429 status

3. Check git history:
   - Added 6 months ago (commit abc123)
   - Commit message: "Add rate limiting to prevent brute force"
   - No issues reported since

4. Find tests:
   - tests/middleware/rateLimit.test.ts
   - Verifies 429 after 100 requests
   - Tests IP-based tracking

Conclusion: Established pattern exists, follow same approach
Evidence: Existing code + git history + tests
```

### Technique 3: Controlled Experiments

```markdown
When: Documentation unclear or conflicting information

Process:
1. Formulate hypothesis
2. Design minimal test
3. Run experiment
4. Document results
5. Verify reproducibility

Example:
Question: Does Redis cache TTL auto-refresh on access?

Hypothesis: TTL does NOT auto-refresh (expires at absolute time)

Experiment:
1. Set key with 60s TTL: SET mykey "value" EX 60
2. Wait 30 seconds
3. Access key: GET mykey (success)
4. Check TTL: TTL mykey (returns ~30, not 60)

Result: TTL did NOT refresh to 60
Conclusion: ✅ Hypothesis confirmed - TTL is absolute, not sliding

Reproducibility: 3/3 attempts, same result
Evidence: Experiment results documented in experiments/redis-ttl.md
```

### Technique 4: Test-Driven Verification

```markdown
When: Verifying expected behavior

Process:
1. Write test describing expected behavior
2. Run test (should fail if feature not implemented)
3. Implement feature
4. Test passes → behavior verified

Example:
Requirement: API should return 409 on duplicate email

Step 1: Write test first
```typescript
test('returns 409 when email already exists', async () => {
  await createUser({email: 'test@example.com'});
  const response = await createUser({email: 'test@example.com'});
  expect(response.status).toBe(409);
  expect(response.body.error).toContain('email already exists');
});
```

Step 2: Run test
  Result: ❌ FAIL - returns 500, not 409

Step 3: Implement duplicate check
  (Implementation code)

Step 4: Run test
  Result: ✅ PASS

Conclusion: Behavior verified through test
Evidence: Test case (tests/api/users.test.ts:123)
```

## Evidence Documentation Template

```markdown
## Implementation: [Feature Name]

### Requirements
- [Requirement 1]
- [Requirement 2]

### Assumptions Identified
1. [Assumption 1]
2. [Assumption 2]

### Evidence Gathered

#### [Assumption 1]
**Source:** [Documentation/Code/Test]
**Location:** [URL/File:Line]
**Quote/Code:**
```
[Exact quote or code snippet]
```
**Reliability:** ⭐⭐⭐⭐⭐
**Conclusion:** ✅ VERIFIED / ❌ REFUTED / ⚠️ PARTIALLY TRUE

#### [Assumption 2]
**Source:** ...
(Repeat for each assumption)

### Verification Tests
- [ ] Test case 1: [Description]
- [ ] Test case 2: [Description]

### Final Decision
**Chosen approach:** [Description]
**Evidence summary:** [Brief summary of supporting evidence]
**Confidence level:** [High/Medium/Low] based on [X sources of evidence]
```

## Red Flags Indicating Assumptions (Not Evidence)

Watch for these phrases—they signal unverified assumptions:

- 🚩 "I think..."
- 🚩 "Probably..."
- 🚩 "Should work..."
- 🚩 "Usually..."
- 🚩 "Typically..."
- 🚩 "Might..."
- 🚩 "Assuming..."
- 🚩 "Based on my experience..."
- 🚩 "It makes sense that..."
- 🚩 "Common practice is..."

**Action:** Replace each with "I verified that..." + evidence

## Examples

### Example 1: Database Query Optimization

```markdown
❌ Assumption-Based Approach:
"Adding an index should make this query faster"
(Implements index, claims success)

✅ Evidence-Based Approach:

Step 1: Measure baseline
  Query: SELECT * FROM users WHERE email = 'test@example.com'
  Execution time: 450ms (n=100 runs)
  Method: EXPLAIN ANALYZE output

Step 2: Check if index exists
  Query: \d users (PostgreSQL)
  Result: No index on email column
  Evidence: Database schema inspection

Step 3: Review query planner
  Tool: EXPLAIN ANALYZE
  Finding: Sequential scan on users table (150k rows)

Step 4: Add index
  SQL: CREATE INDEX idx_users_email ON users(email);

Step 5: Measure after change
  Same query execution time: 8ms (n=100 runs)
  Method: EXPLAIN ANALYZE output
  Query plan: Now uses Index Scan on idx_users_email

Step 6: Calculate improvement
  Before: 450ms → After: 8ms
  Speedup: 56x faster
  Verified: Yes (reproducible across 100 runs)

Conclusion: ✅ Index improved query performance by 56x
Evidence:
- Baseline benchmark: 450ms (documented)
- EXPLAIN ANALYZE shows index usage
- After benchmark: 8ms (documented)
- Query plan changed from SeqScan to IndexScan
```

### Example 2: Authentication Implementation

```markdown
Task: Implement JWT authentication

❌ Assumption-Based:
"JWTs are secure for authentication, let's use them"

✅ Evidence-Based:

Research Question 1: Are JWTs appropriate for this use case?

Evidence:
1. Project requirements (docs/requirements.md)
   - Stateless authentication ✅
   - Horizontal scaling ✅
   - Short-lived sessions ✅
   → JWT fits requirements

2. Security considerations
   - RFC 7519 (JWT spec) reviewed
   - Aware of XSS risks with localStorage
   - Plan: Use httpOnly cookies (XSS-resistant)

3. Existing patterns
   - Auth service already uses JWT (src/auth/jwt.ts)
   - Infrastructure supports JWT (verified: no session store)

Conclusion: ✅ JWT appropriate (backed by requirements + security review + existing pattern)

Research Question 2: What algorithm should we use?

Evidence:
1. Current implementation (src/auth/jwt.ts:12)
   - Uses RS256 (asymmetric)
   - Private key for signing, public key for verification

2. Security best practices (OWASP JWT Cheat Sheet)
   - RS256 recommended for microservices
   - Allows separate verification without shared secret

3. Infrastructure (ops/secrets/)
   - RSA key pair already generated
   - Keys rotated quarterly

Conclusion: ✅ Use RS256 (matches existing + best practices + infrastructure ready)

Implementation Decision:
- Algorithm: RS256 ✅ (Evidence: Current pattern + OWASP + Infrastructure)
- Storage: httpOnly cookie ✅ (Evidence: Security best practices + XSS protection)
- Expiry: 15 minutes ✅ (Evidence: Security requirements doc)
- Refresh token: Yes ✅ (Evidence: User experience requirements)

All decisions backed by evidence, not assumptions.
```

## Integration with Other Skills

Evidence-Based Development complements:
- **Confidence Check** - Evidence gathering raises confidence
- **Self-Check Protocol** - Question 3 verifies all assumptions have evidence
- **TDD** - Tests provide evidence of behavior

## Quick Reference

```
╔═══════════════════════════════════════════════════════════╗
║         EVIDENCE-BASED DEVELOPMENT CHECKLIST              ║
╠═══════════════════════════════════════════════════════════╣
║ Before implementing ANY feature:                          ║
║                                                           ║
║ 1. □ List all assumptions                                 ║
║ 2. □ For EACH assumption, gather evidence:                ║
║     - Official documentation?                             ║
║     - Existing code patterns?                             ║
║     - Test verification?                                  ║
║     - Experimental proof?                                 ║
║                                                           ║
║ 3. □ Document evidence sources                            ║
║ 4. □ Verify reliability of each source                    ║
║ 5. □ Replace assumptions with facts                       ║
║                                                           ║
║ Red flags (means you're assuming):                        ║
║  - "I think..."                                           ║
║  - "Probably..."                                          ║
║  - "Should work..."                                       ║
║  → If you see these, STOP and verify!                     ║
║                                                           ║
║ Golden Rule: NEVER ASSUME → ALWAYS VERIFY                 ║
╚═══════════════════════════════════════════════════════════╝
```

---

**Remember:** Every assumption is a potential bug. Evidence-based development replaces guesswork with proof, leading to more reliable, maintainable, and secure code.
