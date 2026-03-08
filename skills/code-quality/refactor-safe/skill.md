# Safe Refactoring Skill

You are performing a code refactoring. Follow these safety guidelines:

## Refactoring Philosophy

**"Make the change easy, then make the easy change"** - Kent Beck

Refactoring should:
- Improve code structure WITHOUT changing behavior
- Be done in small, safe steps
- Be backed by tests
- Be reversible

## Pre-Refactoring Checklist

- [ ] Tests exist and pass
- [ ] You understand what the code does
- [ ] You've identified the specific problem to solve
- [ ] You have a clear goal (not just "make it better")
- [ ] You've committed current working state

## Safe Refactoring Process

### 1. Ensure Test Coverage
```bash
# Before ANY refactoring
npm test
npm run coverage
```

If coverage is low:
1. Write characterization tests (tests that describe current behavior)
2. Get coverage above 80% for code you'll touch
3. NOW you can refactor safely

### 2. Make ONE Change at a Time

Don't mix refactoring types. Do these separately:
- Rename variables/functions
- Extract functions
- Move code between files
- Change data structures
- Optimize algorithms

### 3. Test After Each Change

```bash
# After every small change
npm test
```

If tests fail:
- Revert immediately
- Understand why
- Try smaller step

## Common Refactoring Patterns

### Extract Function
**When**: Function is too long or has repeated code
**Steps**:
1. Identify code block to extract
2. Check for dependencies (what variables does it need?)
3. Create new function with descriptive name
4. Pass dependencies as parameters
5. Replace original code with function call
6. Test
7. Commit

### Rename for Clarity
**When**: Name doesn't match purpose
**Steps**:
1. Choose better name (descriptive, follows conventions)
2. Use IDE/editor "rename symbol" (preserves references)
3. Test
4. Commit

### Extract Variable
**When**: Complex expression is hard to understand
**Steps**:
1. Identify complex expression
2. Choose descriptive variable name
3. Assign expression to variable
4. Replace expression with variable
5. Test
6. Commit

### Consolidate Conditional
**When**: Multiple conditions check the same thing
**Steps**:
1. Extract condition to well-named variable
2. Use variable in all places
3. Test
4. Commit

### Replace Magic Numbers
**When**: Unexplained numbers in code
**Steps**:
1. Create named constant
2. Replace number with constant
3. Test
4. Commit

## Red Flags - Stop Refactoring If:

- Tests are failing
- You don't understand what the code does
- The change is getting too big
- You're mixing feature work with refactoring
- You're making assumptions about behavior
- You can't explain why the refactoring is better

## Refactoring vs Rewriting

**Refactoring**: Small, safe, incremental changes
**Rewriting**: Starting from scratch

Almost always choose refactoring over rewriting!

## Git Workflow for Refactoring

```bash
# Create refactoring branch
git checkout -b refactor/descriptive-name

# Make small change
# ... edit code ...

# Test
npm test

# Commit (atomic, descriptive message)
git commit -m "Extract calculateTotal function for clarity"

# Repeat for next change
```

## Example: Extract Function

**Before:**
```typescript
function processOrder(order) {
  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  const tax = total * 0.08;
  total += tax;

  // Process payment
  const result = paymentGateway.charge(total);
  return result;
}
```

**After (Step 1: Extract total calculation):**
```typescript
function calculateOrderTotal(items) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.08;
  return subtotal + tax;
}

function processOrder(order) {
  const total = calculateOrderTotal(order.items);
  const result = paymentGateway.charge(total);
  return result;
}
```

**After (Step 2: Extract tax calculation):**
```typescript
const TAX_RATE = 0.08;

function calculateTax(subtotal) {
  return subtotal * TAX_RATE;
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(items) {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  return subtotal + tax;
}

function processOrder(order) {
  const total = calculateOrderTotal(order.items);
  return paymentGateway.charge(total);
}
```

## Post-Refactoring Checklist

- [ ] All tests pass
- [ ] No linter warnings
- [ ] Code is more readable than before
- [ ] Function names clearly describe purpose
- [ ] No duplicated code
- [ ] Complexity is lower (fewer nested ifs, shorter functions)
- [ ] Committed with clear message
- [ ] Reviewable PR (not too many changes at once)

Remember: **The goal is better code, not different code!**
