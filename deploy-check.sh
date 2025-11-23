#!/bin/bash

# Student Complaint Management System - Deployment Helper Script
# This script helps prepare your project for deployment

set -e

echo "🚀 Student Complaint Management System - Deployment Preparation"
echo "================================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Check if .env exists (optional but recommended for Supabase)
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found"
    echo "   If you're using Supabase, copy .env.example to .env and fill it in"
    echo "   Command: cp .env.example .env"
else
    echo "✅ .env file exists"
fi
echo ""

# Test build
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "   Output directory: build/"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
echo ""

# Check build output
if [ -d "build" ]; then
    BUILD_SIZE=$(du -sh build | cut -f1)
    FILE_COUNT=$(find build -type f | wc -l | xargs)
    echo "📊 Build Statistics:"
    echo "   Size: $BUILD_SIZE"
    echo "   Files: $FILE_COUNT"
else
    echo "❌ Build directory not found!"
    exit 1
fi
echo ""

# Git status check
if command -v git &> /dev/null && [ -d ".git" ]; then
    echo "📝 Git Status:"
    
    # Check for uncommitted changes
    if [[ -n $(git status -s) ]]; then
        echo "   ⚠️  You have uncommitted changes:"
        git status -s | head -5
        echo ""
        echo "   Consider committing before deployment"
    else
        echo "   ✅ Working directory clean"
    fi
    
    # Check if .env is ignored
    if git check-ignore .env &> /dev/null; then
        echo "   ✅ .env is properly ignored"
    else
        echo "   ⚠️  WARNING: .env might not be ignored! Check .gitignore"
    fi
else
    echo "📝 Git is not initialized or not installed"
    echo "   Recommendation: Initialize git for version control and CI/CD"
fi
echo ""

echo "================================================================"
echo "✨ Pre-deployment checks complete!"
echo ""
echo "Next Steps:"
echo "1. Push your code to GitHub/GitLab/Bitbucket"
echo "2. Choose a hosting platform (recommended: Vercel or Netlify)"
echo "3. Follow the DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "Quick Deploy Options:"
echo "  • Vercel: https://vercel.com/new"
echo "  • Netlify: https://app.netlify.com/start"
echo "  • Render: https://render.com/deploy"
echo ""
echo "Configuration files created:"
echo "  ✅ vercel.json"
echo "  ✅ netlify.toml"
echo "  ✅ render.yaml"
echo ""
echo "Need help? Read DEPLOYMENT_GUIDE.md for comprehensive instructions."
echo "================================================================"
