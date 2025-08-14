# Security Configuration Guide

This document outlines how to handle sensitive data in this React application.

## Protected Files

The following files contain sensitive information and are excluded from version control:

### Environment Variables
- `.env` - Contains environment-specific configuration
- `.env.local`, `.env.*.local` - Environment-specific overrides
- **Template**: Use `.env.example` as a starting point

### Configuration Files
- `src/config/apiConfig.ts` - API endpoints and configuration
- `src/config/authConfig.js` - Azure AD/authentication configuration
- **Templates**: Use the `.example` versions as starting points

## Setup Instructions

### 1. Environment Variables
```bash
# Copy the template
cp .env.example .env

# Edit with your actual values
# Never commit .env to git
```

### 2. Authentication Configuration
```bash
# Copy the template
cp src/config/authConfig.js.example src/config/authConfig.js

# Update with your Azure AD configuration:
# - clientId: Your Azure AD application client ID
# - authority: Your Azure AD tenant authority URL
# - scopes: Your API scopes
```

### 3. API Configuration
The `apiConfig.ts` file should contain:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:7083";
```

## Security Best Practices

### What to Keep Secret
- API keys and tokens
- Database connection strings
- Azure AD client secrets (server-side only)
- Third-party service credentials
- Production URLs and endpoints

### What's Safe to Commit
- Client IDs (these are public identifiers)
- Public API endpoints (if intended to be public)
- Configuration structure/templates
- Environment variable names (without values)

### Environment Variables
- Prefix React environment variables with `VITE_`
- Use `.env.example` to document required variables
- Never commit actual `.env` files
- Use different values for development/staging/production

### Azure AD Configuration
- Client ID can be public (it's designed to be)
- Never commit client secrets (but this is a SPA, so you shouldn't have any)
- Authority URLs can be public
- API scopes can be public

## Deployment Considerations

### Development
- Use `localhost` URLs
- Test credentials/client IDs
- Development Azure AD app registration

### Production
- Production API URLs
- Production Azure AD app registration
- Environment-specific client IDs
- Secure redirect URLs (HTTPS only)

## Recovery

If sensitive data was accidentally committed:

1. **Change all exposed credentials immediately**
2. **Remove from git history**:
   ```bash
   # Remove file from history
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch path/to/sensitive/file' --prune-empty --tag-name-filter cat -- --all
   
   # Force push (dangerous - coordinate with team)
   git push origin --force --all
   ```
3. **Rotate all API keys and credentials**
4. **Update Azure AD app registrations if needed**

## Monitoring

- Review `.gitignore` regularly
- Audit commits for sensitive data
- Use tools like `git-secrets` to prevent accidental commits
- Enable branch protection rules in production repositories

## Contact

If you discover sensitive data in the repository:
1. **DO NOT** pull or clone the repository
2. Immediately notify the development team
3. Change all potentially exposed credentials
