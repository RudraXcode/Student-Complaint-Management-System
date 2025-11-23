# Comprehensive Deployment Guide
## Student Complaint Management System

---

## 📋 Project Overview

This is a **React + Vite** single-page application (SPA) with:
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (utility classes)
- **State Management**: React hooks + localStorage
- **Backend (Optional)**: Supabase serverless functions (Deno runtime)
- **Build Output**: Static files in `/build` directory

---

## 🎯 Deployment Options Analysis

### ✅ Recommended: Vercel (Best for this project)
**Why?**
- Native Vite support
- Zero configuration needed
- Free tier with generous limits
- Automatic HTTPS
- Environment variables support
- CDN + Edge caching
- Automatic deployments from Git

### ✅ Alternative: Netlify
**Why?**
- Easy drag-and-drop deployment
- Free tier available
- Good CI/CD integration
- Form handling and serverless functions

### ✅ Alternative: Render
**Why?**
- Free static site hosting
- Good for hobby projects
- Simple setup

### ❌ Not Recommended: AWS Amplify
**Why?**
- Overkill for this simple SPA
- More complex setup
- Better suited for AWS-native apps

### ❌ Not Recommended: Railway
**Why?**
- Better for backend services
- This is a static frontend (no server needed)

---

## 🚀 OPTION 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier)
- Your code pushed to a Git repository

### Step-by-Step Instructions

#### **Step 1: Prepare Your Project**

1. **Create a `.gitignore` file** (already exists, verify it includes):
   ```
   node_modules
   .env
   .env.local
   build
   dist
   ```

2. **Ensure package.json has correct build script** (already configured):
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build"
     }
   }
   ```

3. **Create environment variables file** (if using Supabase):
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials
   - **NEVER commit `.env` to Git!**

**Enable Microsoft (Azure) OAuth in Supabase (optional)**

If you want users to sign in with Microsoft (Azure AD) via Supabase, follow these steps:

1. Open your Supabase project dashboard → `Authentication` → `Providers`.
2. Find **Microsoft / Azure** and click to configure.
3. In the Microsoft app registration (Azure Portal) create an app and note the **Client ID** and **Client Secret**.
4. Set the Redirect URI in Azure to your app origin(s), for example:
  - `http://localhost:3000` (local dev)
  - `https://your-deployed-site.example.com` (production)
5. In Supabase provider settings, paste the **Client ID** and **Client Secret**, and add the same redirect URIs.
6. In your deployment platform (Vercel/Netlify/Render), ensure the environment variables are set:
  ```bash
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
7. The frontend will call Supabase OAuth and redirect back to the app origin; the app handles the redirected session automatically.

Note: For Azure, ensure the app registration has "Supported account types" set appropriately (e.g., "Accounts in any organizational directory and personal Microsoft accounts") if you want broad compatibility.

#### **Step 2: Push to GitHub**

```bash
# Initialize git (if not already done)
cd "/Users/saurabhkumarshukla/Desktop/Student Complaint Management System"
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Student Complaint Management System"

# Create repository on GitHub (https://github.com/new)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### **Step 3: Deploy to Vercel**

1. **Go to Vercel**: https://vercel.com/
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure build settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

6. **Add Environment Variables** (if using Supabase):
   - Click "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

7. **Click "Deploy"**

8. **Wait 2-3 minutes** for deployment to complete

9. **Your app will be live at**: `https://your-project-name.vercel.app`

#### **Step 4: Configure Custom Domain (Optional)**

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

---

## 🚀 OPTION 2: Deploy to Netlify

### Step-by-Step Instructions

#### **Method A: Drag & Drop (Quickest)**

1. **Build your project locally**:
   ```bash
   cd "/Users/saurabhkumarshukla/Desktop/Student Complaint Management System"
   npm run build
   ```

2. **Go to Netlify**: https://app.netlify.com/
3. **Sign up/Login**
4. **Drag the `build` folder** into the deployment zone
5. **Your site is live!**

#### **Method B: Git Integration (Recommended for CI/CD)**

1. **Push to GitHub** (same as Vercel Step 2)

2. **Go to Netlify**: https://app.netlify.com/
3. **Click "New site from Git"**
4. **Connect your repository**
5. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

6. **Add Environment Variables**:
   - Go to "Site settings" → "Build & deploy" → "Environment"
   - Add:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

7. **Click "Deploy site"**

8. **Your app will be live at**: `https://random-name-12345.netlify.app`

#### **Step 3: Create netlify.toml (Optional but Recommended)**

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 🚀 OPTION 3: Deploy to Render

### Step-by-Step Instructions

1. **Push to GitHub** (same as previous)

2. **Go to Render**: https://render.com/
3. **Sign up/Login**
4. **Click "New +"** → "Static Site"
5. **Connect your repository**
6. **Configure**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

7. **Add Environment Variables**:
   - Click "Environment" tab
   - Add your `VITE_*` variables

8. **Click "Create Static Site"**

9. **Your app will be live at**: `https://your-site.onrender.com`

---

## 🚀 OPTION 4: Manual Build + Any Static Host

If you prefer other hosting services (GitHub Pages, Firebase Hosting, etc.):

### Step 1: Build Locally

```bash
cd "/Users/saurabhkumarshukla/Desktop/Student Complaint Management System"

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 2: Upload Build Folder

The `build` folder contains your entire compiled application. Upload it to:
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Use `firebase deploy`
- **Any web host**: Upload via FTP/SFTP

---

## 🔧 Configuration Files to Create

### 1. Create `vercel.json` (For Vercel - Optional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm run dev",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Create `netlify.toml` (For Netlify - Optional)

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 3. Update `.gitignore` (Already exists, verify)

```
node_modules
.env
.env.local
build
dist
.DS_Store
```

---

## 🔐 Environment Variables Setup

### Required Variables (if using Supabase)

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Local Development

1. Copy `.env.example` to `.env`
2. Fill in your actual values
3. Never commit `.env` to Git!

### For Production (Vercel/Netlify/Render)

1. Add variables in the hosting platform's dashboard
2. Under "Environment Variables" or "Build Settings"
3. Deploy/redeploy to apply changes

---

## 🎨 Project Architecture Notes

### Frontend Only
- This is a **static React SPA**
- Uses localStorage for data persistence
- No backend server required for basic operation
- Authentication is currently **mocked** (demo mode)

### Optional Backend (Supabase Functions)
- Located in `src/supabase/functions/server/`
- Written in Deno (TypeScript runtime)
- Currently **not required** for frontend deployment
- If you want to deploy these:
  1. Set up Supabase project
  2. Deploy functions using Supabase CLI
  3. Configure environment variables

---

## ✅ Pre-Deployment Checklist

- [ ] Project builds successfully (`npm run build`)
- [ ] No build errors in console
- [ ] Environment variables configured (if using Supabase)
- [ ] `.env` is in `.gitignore`
- [ ] Code pushed to Git repository
- [ ] Hosting platform account created
- [ ] Domain name ready (optional)

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot resolve`
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

**Problem**: Variables showing as `undefined`
**Solution**:
- Verify variables start with `VITE_`
- Check spelling matches exactly
- Redeploy after adding variables
- Clear build cache

### Blank Page After Deployment

**Problem**: Application loads but shows blank screen
**Solution**:
- Check browser console for errors
- Verify `build` directory is being deployed
- Check routing configuration (add redirects to `index.html`)
- Ensure all assets are loading (check Network tab)

### 404 on Page Refresh

**Problem**: Direct URL navigation fails
**Solution**:
- Add redirect rules (see `netlify.toml` or `vercel.json` above)
- Configure SPA fallback to `index.html`

---

## 📊 Cost Comparison

| Platform | Free Tier | Bandwidth | Build Minutes | Custom Domain |
|----------|-----------|-----------|---------------|---------------|
| **Vercel** | ✅ Yes | 100GB/mo | 6000 min/mo | ✅ Free |
| **Netlify** | ✅ Yes | 100GB/mo | 300 min/mo | ✅ Free |
| **Render** | ✅ Yes | 100GB/mo | 500 hrs/mo | ✅ Free |
| **GitHub Pages** | ✅ Yes | Unlimited | N/A | ✅ Free |

**Recommendation**: All free tiers are more than sufficient for this project.

---

## 🚦 Quick Start Commands

```bash
# Clone/navigate to project
cd "/Users/saurabhkumarshukla/Desktop/Student Complaint Management System"

# Install dependencies
npm install

# Test locally
npm run dev

# Build for production
npm run build

# Test production build locally
npx serve build
```

---

## 📝 Post-Deployment Tasks

1. **Test all features**:
   - Login/logout
   - Creating complaints
   - Admin dashboard
   - Department views
   - Reports

2. **Set up monitoring**:
   - Enable Vercel/Netlify Analytics
   - Set up error tracking (Sentry, LogRocket)

3. **Configure security**:
   - Set up proper CORS for Supabase
   - Enable CSP headers
   - Review environment variables

4. **Performance optimization**:
   - Enable compression (auto on Vercel/Netlify)
   - Set cache headers
   - Optimize images

---

## 🎉 Success!

Your Student Complaint Management System should now be live and accessible worldwide!

**Next Steps**:
- Share the URL with users
- Set up custom domain
- Monitor usage and errors
- Plan for future features

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev/guide/static-deploy.html
- **React Docs**: https://react.dev/learn

---

**Last Updated**: November 18, 2025
**Version**: 1.0
