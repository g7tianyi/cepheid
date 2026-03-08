# Wave Execution Pattern

A parallel execution strategy that achieves 3.5x faster completion compared to sequential workflows by executing independent operations concurrently, checkpointing results, then proceeding with the next wave.

**Inspired by SuperClaude Framework's Wave→Checkpoint→Wave execution pattern.**

## Overview

Instead of executing tasks sequentially (one after another), identify independent operations that can run in parallel, execute them as a "wave", checkpoint to analyze results collectively, then execute the next wave based on those results.

**Performance gain: 3.5x faster than sequential execution**

## When to Use This Skill

Use Wave Execution for:
- ✅ Multiple file reads/writes that don't depend on each other
- ✅ Running multiple search/grep operations
- ✅ Parallel test executions
- ✅ Independent code transformations
- ✅ Batch API calls
- ✅ Multi-file refactoring
- ✅ Concurrent data processing

**Do NOT use for:**
- ❌ Operations with dependencies (A needs result of B)
- ❌ Operations that must be atomic (database transactions)
- ❌ Single-file operations
- ❌ When order matters (sequential writes to same file)

## The Wave→Checkpoint→Wave Pattern

### Structure

```
Wave 1 (Parallel)
    ↓
Checkpoint (Analyze)
    ↓
Wave 2 (Parallel)
    ↓
Checkpoint (Analyze)
    ↓
Wave 3 (Parallel)
    ↓
Final Verification
```

### Three Phases

1. **Wave (Parallel Execution)**
   - Identify all independent operations
   - Execute them concurrently in a single message
   - Use multiple tool calls in one response

2. **Checkpoint (Collective Analysis)**
   - Review ALL results together
   - Identify patterns across results
   - Determine next steps based on collective findings
   - Make decisions affecting subsequent waves

3. **Repeat**
   - Execute next wave based on checkpoint analysis
   - Continue until task complete

## Process

### Step 1: Identify Independent Operations

Before starting, analyze which operations are truly independent:

```markdown
Task: Update error handling across 10 API endpoints

Independent operations (can parallelize):
✅ Read all 10 endpoint files
✅ Search for error handling patterns in each
✅ Apply same transformation to each file

Dependent operations (must be sequential):
❌ Read file → Transform → Write (within same file)
✅ But all 10 files are independent of each other!
```

**Independence Test:**
- Can operation A complete without knowing result of operation B?
- Do operations modify different resources?
- Are results used collectively (not individually)?

### Step 2: Execute Wave 1 (Parallel Operations)

Execute all independent operations in a **single message**:

```markdown
Wave 1: Reading all endpoint files

Executing 10 parallel Read operations:
1. Read src/api/users.ts
2. Read src/api/posts.ts
3. Read src/api/comments.ts
4. Read src/api/auth.ts
5. Read src/api/files.ts
6. Read src/api/notifications.ts
7. Read src/api/settings.ts
8. Read src/api/analytics.ts
9. Read src/api/webhooks.ts
10. Read src/api/admin.ts

[All operations execute concurrently]
```

**Key: Use multiple tool calls in ONE message for true parallelism**

### Step 3: Checkpoint - Analyze Results Collectively

After wave completes, analyze ALL results together:

```markdown
Checkpoint after Wave 1:

Collective analysis of 10 files:
- 7/10 files use try-catch blocks
- 3/10 files have no error handling
- 5/10 return generic "Internal Server Error"
- 2/10 have detailed error messages
- 0/10 log errors consistently

Pattern identified:
→ Inconsistent error handling approaches
→ Missing error logging
→ Need standardized error response format

Decision for Wave 2:
→ Apply consistent error handling pattern to all 10 files
→ Add error logging to all endpoints
→ Use standard error response format
```

**Important:** Don't process results one-by-one. Look for patterns across ALL results.

### Step 4: Execute Wave 2 Based on Checkpoint

Use checkpoint findings to inform next wave:

```markdown
Wave 2: Applying transformations to all files

Based on checkpoint, applying to all 10 files:
- Add try-catch if missing
- Add logger.error() calls
- Standardize error response format

Executing 10 parallel Edit operations:
1. Edit src/api/users.ts
2. Edit src/api/posts.ts
[... and so on ...]

[All operations execute concurrently]
```

### Step 5: Repeat Until Complete

Continue wave→checkpoint→wave until task done:

```markdown
Checkpoint after Wave 2:
✅ All 10 files transformed
✅ Error handling consistent
⚠️  Need to verify tests still pass

Wave 3: Verify tests
1. Run tests for users endpoint
2. Run tests for posts endpoint
[... parallel test execution ...]

Final Checkpoint:
✅ All tests passing
✅ Error handling unified
✅ Logging implemented
✅ Task complete
```

## Examples

### Example 1: Multi-File Refactoring (3.5x Speedup)

#### ❌ Sequential Approach (Slow)

```markdown
Sequential execution (10 minutes):

1. Read users.ts (30s)
2. Transform users.ts (60s)
3. Write users.ts (10s)
4. Read posts.ts (30s)
5. Transform posts.ts (60s)
6. Write posts.ts (10s)
[... 8 more files ...]

Total: ~10 minutes (600 seconds)
```

#### ✅ Wave Execution Approach (3.5x Faster)

```markdown
Wave execution (2.8 minutes):

Wave 1: Read all 10 files in parallel (30s)
  → Uses single message with 10 Read tool calls

Checkpoint: Analyze patterns across all files (20s)
  → One analysis of collective results

Wave 2: Transform all 10 files in parallel (60s)
  → Uses single message with 10 Edit tool calls

Checkpoint: Verify all transformations (20s)
  → Review all changes together

Wave 3: Run all 10 test suites in parallel (40s)
  → Single message with 10 Bash tool calls

Final Checkpoint: Verify success (10s)

Total: ~2.8 minutes (168 seconds)
Speedup: 600s / 168s = 3.57x faster! 🚀
```

### Example 2: API Endpoint Discovery

```markdown
Task: Find all API endpoints that use deprecated authentication method

Wave 1: Search all API files
- Grep pattern: "oldAuth" in src/api/*.ts (parallel)
- Grep pattern: "deprecatedAuth" in src/api/*.ts (parallel)
- Grep pattern: "legacyAuth" in src/api/*.ts (parallel)

Result (30 seconds instead of 90):
3 greps execute concurrently in one message

Checkpoint after Wave 1:
Found matches in:
- 12 files use "oldAuth"
- 3 files use "deprecatedAuth"
- 0 files use "legacyAuth"
- Total: 15 files need updating

Wave 2: Read all 15 files in parallel
Result (15 seconds instead of 225):
15 concurrent Read operations

Checkpoint after Wave 2:
Analyzed authentication patterns:
- 10 files: simple oldAuth() call → easy replacement
- 5 files: complex auth logic → needs careful refactoring

Wave 3a: Fix simple cases (10 files in parallel)
Wave 3b: Fix complex cases (5 files in parallel, after reviewing)

Total time: ~2 minutes vs ~8 minutes sequential
Speedup: 4x faster
```

### Example 3: Test Suite Optimization

```markdown
Task: Run tests across multiple packages

❌ Sequential (20 minutes):
1. cd package-1 && npm test (5 min)
2. cd package-2 && npm test (4 min)
3. cd package-3 && npm test (6 min)
4. cd package-4 && npm test (5 min)
Total: 20 minutes

✅ Wave Execution (6 minutes):

Wave 1: Start all test suites in parallel
Uses 4 concurrent Bash tool calls in one message:
1. npm test --prefix package-1
2. npm test --prefix package-2
3. npm test --prefix package-3
4. npm test --prefix package-4

Checkpoint after Wave 1 (longest test completes in 6 min):
Collective results:
- package-1: ✅ 45 tests passed
- package-2: ❌ 2 tests failed
- package-3: ✅ 78 tests passed
- package-4: ✅ 23 tests passed

Pattern: package-2 has failing tests related to auth

Wave 2: Investigate package-2 failures (targeted)
- Read failing test files
- Check recent changes

Total: ~6 minutes (3.3x faster)
```

## Patterns for Parallel Execution

### Pattern 1: File Operations

```markdown
✅ Parallel (Wave approach):
Wave 1: Read files A, B, C, D (all in one message)
Checkpoint: Analyze all contents
Wave 2: Edit files A, B, C, D (all in one message)

❌ Sequential:
Read A → Process A → Write A → Read B → Process B → Write B → ...
```

### Pattern 2: Search Operations

```markdown
✅ Parallel (Wave approach):
Wave 1:
  - Grep "pattern1" in src/**/*.ts
  - Grep "pattern2" in src/**/*.ts
  - Grep "pattern3" in lib/**/*.ts
  - Glob "**/*.config.js"
  (All in one message)

Checkpoint: Combine results, identify hotspots

❌ Sequential:
Grep pattern1 → analyze → Grep pattern2 → analyze → ...
```

### Pattern 3: Test Execution

```markdown
✅ Parallel (Wave approach):
Wave 1: Run all independent test suites
  - npm test --scope=api
  - npm test --scope=ui
  - npm test --scope=utils
  - npm test --scope=integration
  (All in one message)

Checkpoint: Identify which suites failed

Wave 2: Debug only failed suites (targeted)

❌ Sequential:
Run api tests → wait → Run ui tests → wait → ...
```

## Anti-Patterns (What NOT to Do)

### ❌ Anti-Pattern 1: False Parallelism

```markdown
WRONG - Still sequential despite multiple messages:

Message 1: "Let me read file A"
  [waits for response]
Message 2: "Now let me read file B"
  [waits for response]
Message 3: "Now let me read file C"

This is NOT parallel execution!
```

**Correct approach:**
```markdown
Message 1: "Let me read files A, B, and C"
  [Uses 3 Read tool calls in single message]
  [All execute in parallel]
```

### ❌ Anti-Pattern 2: Premature Individual Processing

```markdown
WRONG - Processing each result individually:

Wave 1: Read 10 files
Then immediately:
  - Process file 1 result
  - Process file 2 result
  - Process file 3 result
  ... (sequential processing)

Missing the checkpoint benefit!
```

**Correct approach:**
```markdown
Wave 1: Read 10 files
Checkpoint: Analyze ALL 10 results collectively
  - What patterns appear?
  - What's common across all files?
  - What's unique?
Wave 2: Apply batch transformation based on patterns
```

### ❌ Anti-Pattern 3: Dependencies Disguised as Independence

```markdown
WRONG - These are NOT independent:

Wave 1 "parallel" operations:
  - Read config.json
  - Parse config and create derived settings
  - Use settings to initialize database

These have clear dependencies! Must be sequential.
```

**Correct identification:**
```markdown
Sequential (has dependencies):
  1. Read config.json
  2. Parse config
  3. Initialize database

Parallel (truly independent):
  Wave 1: Read config.json, Read schema.sql, Read migrations/*.sql
  Checkpoint: Verify all files loaded
  Wave 2: Apply transformations
```

## Decision Matrix: When to Use Wave Execution

| Scenario | Independent? | Use Wave? | Pattern |
|----------|-------------|-----------|---------|
| Read 10 files for analysis | ✅ Yes | ✅ Yes | Single wave of 10 Reads |
| Read file → Transform → Write | ❌ No | ❌ No | Sequential |
| Read 10 files, transform each | ✅ Yes | ✅ Yes | Wave 1: Read, Wave 2: Transform |
| Run 5 test suites | ✅ Yes | ✅ Yes | Single wave of 5 Bash calls |
| Sequential database migrations | ❌ No | ❌ No | Must be sequential |
| Search 20 files for pattern | ✅ Yes | ✅ Yes | Single wave of Greps |
| Build depends on install | ❌ No | ❌ No | install → build (sequential) |

## Performance Calculation

Estimate speedup:

```
Sequential time = Sum of individual operation times
Parallel time = Max(operation times) + Checkpoint overhead

Speedup = Sequential time / Parallel time

Example:
10 file reads, each takes 30s
Sequential: 10 × 30s = 300s
Parallel: max(30s) + 20s checkpoint = 50s
Speedup: 300s / 50s = 6x faster! 🚀
```

## Best Practices

### 1. Maximize Wave Size

```markdown
✅ Better:
Wave 1: 20 parallel operations

❌ Worse:
Wave 1: 5 operations
Wave 2: 5 operations
Wave 3: 5 operations
Wave 4: 5 operations

If all 20 are independent, do them in one wave!
```

### 2. Meaningful Checkpoints

```markdown
✅ Good checkpoint:
"Analyzed all 15 files. Found 3 distinct patterns:
 - Pattern A in 8 files
 - Pattern B in 5 files
 - Pattern C in 2 files
 → Will apply unified transformation"

❌ Bad checkpoint:
"File 1 done. File 2 done. File 3 done..."
(This is just listing results, not analyzing collectively)
```

### 3. Batch Similar Operations

```markdown
✅ Good batching:
Wave 1: All Reads (20 files)
Wave 2: All Edits (20 files)
Wave 3: All Bash/test executions (5 suites)

❌ Poor batching:
Wave 1: Read, Edit, Bash, Read, Edit, Bash...
(Mixing operation types reduces parallelism benefits)
```

### 4. Handle Failures Gracefully

```markdown
✅ Robust wave execution:

Wave 1: 10 parallel operations
Checkpoint:
  - 8 succeeded
  - 2 failed (note which ones)

Wave 2:
  - Process 8 successful results
  - Retry or handle 2 failures separately

❌ Brittle approach:
Wave 1: 10 operations
One failure → entire wave considered failed
(Wastes the 9 successful operations)
```

## Quick Reference

```
╔═══════════════════════════════════════════════════════╗
║           WAVE EXECUTION CHECKLIST                    ║
╠═══════════════════════════════════════════════════════╣
║ Before executing:                                     ║
║  1. □ Identify all independent operations             ║
║  2. □ Verify no dependencies between them             ║
║  3. □ Group into logical waves                        ║
║                                                       ║
║ During Wave:                                          ║
║  4. □ Execute ALL parallel ops in ONE message         ║
║  5. □ Use multiple tool calls (not separate messages) ║
║                                                       ║
║ During Checkpoint:                                    ║
║  6. □ Analyze ALL results collectively                ║
║  7. □ Identify patterns across results                ║
║  8. □ Plan next wave based on findings                ║
║                                                       ║
║ Performance gain: 3-6x faster than sequential! 🚀    ║
╚═══════════════════════════════════════════════════════╝
```

## Integration with Other Skills

Wave Execution works well with:
- **Confidence Check** - High confidence needed for parallel operations
- **Self-Check Protocol** - Final checkpoint validates all results
- **Evidence-Based Development** - Checkpoints verify assumptions

---

**Remember:** If operations are truly independent, execute them in parallel within a single message for massive performance gains. The checkpoint phase is where you think collectively about all results.
