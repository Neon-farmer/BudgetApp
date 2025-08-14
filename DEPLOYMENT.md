# MonsterASP Deployment Configuration

## Overview
This React application is built with Vite and requires Node.js for building. The production deployment consists of static files that can be served by any web server.

## System Requirements
- Node.js 18 or later
- npm (comes with Node.js)

## Deployment Methods

### Method 1: GitHub Actions (Automated)
1. Push to GitHub repository
2. GitHub Actions automatically builds and deploys
3. Requires setting up secrets in GitHub repository settings

### Method 2: Local Build + Manual Upload
1. Run build script locally
2. Upload `dist/` contents to MonsterASP
3. Configure web server

### Method 3: MonsterASP Node.js Environment
If MonsterASP supports Node.js hosting:
1. Upload source code
2. Install dependencies: `npm ci`
3. Build application: `npm run build`
4. Serve from `dist/` directory

## Build Commands

### Install Dependencies
```bash
npm ci
```
This installs exact versions from package-lock.json (recommended for production)

Alternative (if npm ci fails):
```bash
npm install
```

### Build for Production
```bash
npm run build
```

### Test Build Locally
```bash
npm run preview
```

## Environment Variables

### Required
- `VITE_API_BASE_URL`: Your production API endpoint

### Example .env file for production:
```
VITE_API_BASE_URL=https://your-api-domain.com
```

## Web Server Configuration

### For Apache (.htaccess)
```apache
RewriteEngine On
RewriteBase /

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy strict-origin-when-cross-origin

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

### For Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## File Structure After Build
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js # JavaScript bundle
│   ├── index-[hash].css # CSS bundle
│   └── [other assets]  # Images, icons, etc.
└── vite.svg           # Favicon
```

## Deployment Checklist

### Pre-deployment
- [ ] Update API URLs in environment variables
- [ ] Test build locally with `npm run preview`
- [ ] Verify all assets load correctly
- [ ] Test authentication flow with production settings

### Deployment
- [ ] Upload all files from `dist/` directory
- [ ] Configure web server redirects for SPA
- [ ] Set up environment variables
- [ ] Configure HTTPS/SSL
- [ ] Test production deployment

### Post-deployment
- [ ] Verify application loads
- [ ] Test authentication flow
- [ ] Check API connectivity
- [ ] Monitor for any console errors
- [ ] Test on different devices/browsers

## Troubleshooting

### Build Fails
1. Check Node.js version: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm ci`
4. Check for TypeScript errors

### App Won't Load
1. Check browser console for errors
2. Verify all assets are uploaded
3. Check web server configuration
4. Verify environment variables

### Authentication Issues
1. Check Azure AD redirect URLs
2. Verify API endpoints
3. Check CORS settings
4. Verify environment variables

## MonsterASP Specific Notes

### If MonsterASP supports Node.js:
1. Upload source code to your hosting directory
2. SSH/terminal into your hosting account
3. Run: `npm ci && npm run build`
4. Point domain to serve from `dist/` directory

### If MonsterASP only supports static hosting:
1. Build locally or via GitHub Actions
2. Upload only the `dist/` directory contents
3. Configure web server to serve index.html for all routes

### Environment Variables on MonsterASP:
- Check MonsterASP control panel for environment variable settings
- May need to rebuild after changing environment variables
- Some hosts require restart after environment changes

## Contact Support
If you encounter MonsterASP-specific issues:
1. Check MonsterASP documentation for Node.js support
2. Contact MonsterASP support for deployment assistance
3. Verify hosting plan includes Node.js capabilities
