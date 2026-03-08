# Debug Helper Skill

You are systematically debugging an issue. Follow this structured approach:

## Debugging Philosophy

**"Debugging is twice as hard as writing the code in the first place."** - Brian Kernighan

Key principles:
- Be systematic, not random
- Form hypotheses and test them
- Divide and conquer
- Reproduce reliably first
- Understand before fixing

## The Debugging Process

### 1. Reproduce the Bug

**Goal**: Get a reliable reproduction

```bash
# Can you make it happen consistently?
# - What are the exact steps?
# - What's the expected vs actual behavior?
# - Does it happen every time or intermittently?
```

**Create a minimal reproduction:**
- Remove unrelated code
- Simplify inputs
- Isolate the problem

### 2. Understand the Bug

**Gather information:**
- Error messages (read them carefully!)
- Stack traces (which line? which function?)
- Logs (what happened before the error?)
- Environment (browser, Node version, OS, etc.)
- Recent changes (what changed before it broke?)

**Questions to ask:**
- When did this start happening?
- What changed recently?
- Does it happen in all environments?
- Is there a pattern to when it occurs?

### 3. Form a Hypothesis

**Based on the evidence, what might be wrong?**

Example hypotheses:
- "The API is returning null instead of an array"
- "The variable is undefined because it's accessed before initialization"
- "The race condition happens when requests return out of order"

### 4. Test the Hypothesis

**Validate or disprove your hypothesis:**

```typescript
// Add logging
console.log('Value before:', value);
console.log('Type:', typeof value);
console.log('Is array?', Array.isArray(value));

// Add assertions
if (!value) {
  throw new Error('Value is null/undefined!');
}

// Use debugger
debugger; // Execution will pause here

// Write a failing test
test('should not return null', () => {
  const result = myFunction();
  expect(result).not.toBeNull();
});
```

### 5. Fix and Verify

- Make the minimal change to fix the issue
- Verify the fix works
- Ensure no regressions (run all tests)
- Add a test to prevent future regressions

## Debugging Techniques

### Binary Search

Cut the problem space in half repeatedly:

```typescript
// Problem is somewhere in this function with 100 lines
function complexFunction() {
  // ... 100 lines ...
}

// Add checkpoint in the middle
function complexFunction() {
  // ... 50 lines ...
  console.log('Checkpoint 1: variables =', { x, y, z });
  // ... 50 lines ...
}

// Bug is after checkpoint? Focus on second half
// Bug is before checkpoint? Focus on first half
```

### Rubber Duck Debugging

Explain the code line-by-line to someone (or a rubber duck):

```
"So this function takes a user object...
wait, what if user is undefined?
AH! I need to check if user exists first!"
```

### Add Logging

Strategic console.log placement:

```typescript
function processData(data) {
  console.log('processData input:', data);

  const filtered = data.filter(item => {
    console.log('filtering item:', item);
    return item.active;
  });

  console.log('filtered result:', filtered);
  return filtered;
}
```

### Use the Debugger

**Browser DevTools:**
```javascript
// Add breakpoint in code
debugger;

// Or use DevTools UI to add breakpoint
// Then inspect variables, step through code
```

**Node.js:**
```bash
node --inspect-brk script.js
# Then connect with Chrome DevTools or VS Code
```

**VS Code:**
- Set breakpoint (click line number)
- Press F5 to start debugging
- Use Step Over (F10), Step Into (F11), Continue (F5)

### Check Assumptions

```typescript
// What you assume:
const user = getUser(); // Always returns a user object

// Reality check:
const user = getUser();
console.assert(user !== null, 'User should not be null');
console.assert(user.email, 'User should have email');
```

### Bisect with Git

```bash
# Find which commit introduced the bug
git bisect start
git bisect bad  # Current version is broken
git bisect good <commit>  # This commit was working

# Git will check out commits for you to test
# Mark each as good or bad until bug is found
```

## Common Bug Categories

### 1. Null/Undefined Errors

```typescript
// Problem
user.email  // TypeError: Cannot read property 'email' of undefined

// Debug
console.log('user:', user);  // Is it undefined? null? wrong type?

// Fix
const email = user?.email || 'default@example.com';
```

### 2. Type Errors

```typescript
// Problem
const result = someFunction();
result.toUpperCase();  // TypeError: result.toUpperCase is not a function

// Debug
console.log('result type:', typeof result);
console.log('result value:', result);

// Fix - wrong type returned
// Check function implementation
```

### 3. Async Issues

```typescript
// Problem - race condition
async function loadData() {
  const result = await fetchAPI();  // Might be slow
  updateUI(result);
}

// Debug
console.log('Before fetch:', new Date());
const result = await fetchAPI();
console.log('After fetch:', new Date(), result);

// Common issues:
// - Forgot await
// - Wrong promise chain
// - Race between multiple async operations
```

### 4. Off-by-One Errors

```typescript
// Problem
for (let i = 0; i <= array.length; i++) {  // <= instead of <
  console.log(array[i]);  // undefined on last iteration
}

// Debug
console.log('array.length:', array.length);
console.log('i values:', i);

// Fix
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}
```

### 5. Scope Issues

```typescript
// Problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);  // Prints 3, 3, 3
}

// Debug - understand closure
console.log('What is i when timeout runs?');

// Fix
for (let i = 0; i < 3; i++) {  // Use let, not var
  setTimeout(() => console.log(i), 100);  // Prints 0, 1, 2
}
```

## Debugging Checklist

- [ ] Can you reproduce it reliably?
- [ ] Do you understand the error message?
- [ ] Have you read the stack trace?
- [ ] Have you checked recent changes (git log)?
- [ ] Have you checked similar working code?
- [ ] Have you googled the error message?
- [ ] Have you added logging?
- [ ] Have you used the debugger?
- [ ] Have you checked your assumptions?
- [ ] Have you taken a break? (Sometimes helps!)

## When You're Stuck

1. **Take a break** (seriously, walk away for 10 minutes)
2. **Explain it to someone** (or a rubber duck)
3. **Start from scratch** (minimal reproduction)
4. **Google it** (you're probably not the first person with this error)
5. **Ask for help** (but show what you've tried)

## After Fixing the Bug

- [ ] Write a test to prevent regression
- [ ] Document if it's a subtle issue
- [ ] Consider if similar bugs might exist elsewhere
- [ ] Share learning with team
- [ ] Commit with descriptive message explaining the bug and fix

Remember: **Every bug you fix makes you a better developer!**
