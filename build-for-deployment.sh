#!/bin/bash

# Build script for MonsterASP deployment
# This script prepares your application for deployment

echo "🚀 Starting build process for MonsterASP deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔧 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files are in the 'dist' directory"
    echo ""
    echo "🎯 Next steps for MonsterASP deployment:"
    echo "1. Upload the contents of the 'dist' directory to your MonsterASP hosting"
    echo "2. Configure your web server to serve the files"
    echo "3. Set up environment variables in MonsterASP control panel"
    echo ""
    echo "📋 Environment variables needed:"
    echo "   - VITE_API_BASE_URL: Your production API URL"
    echo ""
    echo "🌐 Make sure to:"
    echo "   - Point your domain to the 'dist' directory contents"
    echo "   - Configure redirects for React Router (SPA)"
    echo "   - Set up HTTPS if not already configured"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
