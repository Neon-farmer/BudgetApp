@echo off
REM Build script for MonsterASP deployment (Windows)
REM This script prepares your application for deployment

echo 🚀 Starting build process for MonsterASP deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or later.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    exit /b 1
)

echo 📦 Installing dependencies...
npm ci

echo 🔧 Building application...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build completed successfully!
    echo 📁 Build files are in the 'dist' directory
    echo.
    echo 🎯 Next steps for MonsterASP deployment:
    echo 1. Upload the contents of the 'dist' directory to your MonsterASP hosting
    echo 2. Configure your web server to serve the files
    echo 3. Set up environment variables in MonsterASP control panel
    echo.
    echo 📋 Environment variables needed:
    echo    - VITE_API_BASE_URL: Your production API URL
    echo.
    echo 🌐 Make sure to:
    echo    - Point your domain to the 'dist' directory contents
    echo    - Configure redirects for React Router ^(SPA^)
    echo    - Set up HTTPS if not already configured
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)
