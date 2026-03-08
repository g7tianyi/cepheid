# Deployment Check Skill

You are performing pre-deployment validation. Run through this comprehensive checklist:

## 1. Code Quality

- [ ] All tests pass
- [ ] Linter passes with no warnings
- [ ] Type checking passes (TypeScript/Flow)
- [ ] No console.log or debugging code
- [ ] No commented-out code blocks
- [ ] Code coverage meets threshold

## 2. Build & Dependencies

- [ ] Production build succeeds
- [ ] No dependency vulnerabilities (npm audit / yarn audit)
- [ ] Dependencies are up to date
- [ ] Package-lock.json / yarn.lock is committed
- [ ] Bundle size is acceptable
- [ ] No dev dependencies in production build

## 3. Configuration

- [ ] Environment variables are documented
- [ ] Secrets are in environment, not in code
- [ ] Configuration for production environment exists
- [ ] Database migrations are ready
- [ ] Feature flags are set correctly

## 4. Database

- [ ] Migrations tested in staging
- [ ] Rollback plan exists
- [ ] Backup completed before migration
- [ ] No breaking schema changes without migration path
- [ ] Indexes are created for new queries

## 5. API & Backwards Compatibility

- [ ] No breaking API changes (or properly versioned)
- [ ] Deprecated endpoints still work
- [ ] API documentation is updated
- [ ] Client SDKs are compatible

## 6. Security

- [ ] No exposed secrets or API keys
- [ ] Authentication/authorization working correctly
- [ ] Input validation in place
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] Security headers configured

## 7. Monitoring & Logging

- [ ] Error tracking configured (Sentry, etc.)
- [ ] Logging level appropriate for production
- [ ] Key metrics are tracked
- [ ] Alerts configured for critical issues
- [ ] Health check endpoint working

## 8. Performance

- [ ] Load testing completed
- [ ] No N+1 queries
- [ ] Caching configured
- [ ] CDN configured for static assets
- [ ] Images optimized
- [ ] Database queries optimized

## 9. Documentation

- [ ] CHANGELOG updated
- [ ] Version number bumped
- [ ] Release notes prepared
- [ ] Deployment runbook updated
- [ ] Rollback procedure documented

## 10. Deployment Process

- [ ] Staging deployment successful
- [ ] Smoke tests pass in staging
- [ ] Deployment scheduled (avoid peak hours)
- [ ] Team notified
- [ ] On-call person identified
- [ ] Rollback plan ready

## Post-Deployment Validation

After deploying:
- [ ] Health check returns 200
- [ ] Key user flows work
- [ ] Logs show no errors
- [ ] Metrics look normal
- [ ] Database migrations completed successfully

## Rollback Criteria

Immediately rollback if:
- Error rate spikes above X%
- Response time increases by Y%
- Critical feature is broken
- Database migration fails

## Deployment Report Template

```markdown
## Deployment: [Version/Feature Name]

**Date**: YYYY-MM-DD
**Deployed by**: [Name]
**Environment**: Production

### Changes
- Change 1
- Change 2

### Pre-deployment Checklist
- [x] All items verified

### Deployment Steps
1. Step 1 - [Timestamp] ✅
2. Step 2 - [Timestamp] ✅

### Post-deployment Validation
- [x] Health check passed
- [x] Smoke tests passed
- [x] Metrics normal

### Issues Encountered
None / [List issues]

### Rollback Plan
[If needed, steps taken]
```
