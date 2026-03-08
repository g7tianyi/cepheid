# Testing Skill

You are writing comprehensive tests. Follow these principles:

## Test Philosophy

- **Test behavior, not implementation**: Focus on what the code does, not how
- **Arrange-Act-Assert**: Clear test structure
- **One assertion per test**: Tests should be focused
- **Descriptive names**: Test names should describe the scenario and expected outcome

## Test Naming Convention

```
test_<function>_<scenario>_<expectedBehavior>
```

Examples:
- `test_login_withValidCredentials_returnsToken`
- `test_login_withInvalidPassword_throwsAuthError`
- `test_login_withMissingEmail_throwsValidationError`

## Test Coverage Strategy

### 1. Happy Path
Test the primary use case with valid inputs

### 2. Edge Cases
- Empty inputs
- Null/undefined values
- Very large/small numbers
- Boundary conditions
- Special characters

### 3. Error Cases
- Invalid inputs
- Network failures
- Timeout scenarios
- Permission errors

### 4. Integration Points
- API calls
- Database operations
- External service interactions

## Test Structure

```typescript
describe('ComponentName', () => {
  describe('functionName', () => {
    it('should do X when Y', () => {
      // Arrange: Set up test data
      const input = ...;

      // Act: Execute the code
      const result = functionName(input);

      // Assert: Verify expectations
      expect(result).toBe(expected);
    });
  });
});
```

## Best Practices

- **Isolate tests**: No shared state between tests
- **Fast tests**: Keep unit tests under 100ms
- **Deterministic**: Same input = same output, always
- **Clear failures**: When a test fails, the reason should be obvious
- **Mock external dependencies**: Don't hit real APIs or databases in unit tests
- **Test first**: Write failing test, then implement, then verify

## When Writing Tests

1. Read the code to understand what it does
2. Identify the public interface (what should be tested)
3. List all scenarios (happy path + edge cases + errors)
4. Write tests for each scenario
5. Run tests to verify they pass
6. Check coverage and add missing tests
