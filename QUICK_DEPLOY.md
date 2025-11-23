# 🚀 Quick Deployment Reference Card

## Project Type
**Static React SPA** (No server required)
- Framework: React 18 + Vite
- Build Output: `/build` directory
- Runtime: Client-side only (localStorage for persistence)

---

## ⚡ Fastest Deployment (5 minutes)

### Option 1: Vercel (Recommended)
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Go to vercel.com
# 3. Click "Import Project"
# 4. Select your repo
# 5. Click "Deploy"
# ✅ Done!
```

### Option 2: Netlify Drag & Drop
```bash
# 1. Build locally
npm run build

# 2. Go to app.netlify.com
# 3. Drag 'build' folder to upload zone
# ✅ Done!
```

---

## 📋 Build Configuration

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` |
| **Node Version** | 18+ |

---

## 🔐 Environment Variables (Optional)

Only needed if using Supabase:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Add these in your hosting platform's dashboard.

---

## ✅ Pre-Flight Checklist

- [ ] `npm run build` succeeds
- [ ] `.env` is in `.gitignore`
- [ ] Code pushed to Git
- [ ] Environment variables configured (if needed)

---

## 🔧 Configuration Files Included

- ✅ `vercel.json` - Vercel configuration
- ✅ `netlify.toml` - Netlify configuration
- ✅ `render.yaml` - Render configuration
- ✅ `deploy-check.sh` - Pre-deployment validation script

---

## 🐛 Common Issues

**Blank page after deploy?**
→ Check browser console for errors
→ Verify environment variables

**404 on page refresh?**
→ Already handled! SPA redirects configured

**Build fails?**
→ Run `npm install && npm run build` locally first
→ Check Node version (must be 18+)

---

## 📊 Platform Comparison

| Platform | Setup Time | Free Tier | Best For |
|----------|------------|-----------|----------|
| **Vercel** | 2 min | 100GB/mo | Git integration |
| **Netlify** | 2 min | 100GB/mo | Drag & drop |
| **Render** | 3 min | 100GB/mo | Simple setup |

**Verdict**: Use Vercel for CI/CD, Netlify for quick demos.

---

## 🎯 One-Command Deploy Check

```bash
./deploy-check.sh
```

This script will:
- ✅ Verify dependencies
- ✅ Test build
- ✅ Check Git status
- ✅ Validate configuration

---

## 📚 Full Documentation

See `DEPLOYMENT_GUIDE.md` for:
- Detailed step-by-step instructions
- Troubleshooting guide
- Advanced configurations
- Custom domain setup

---

## 🆘 Quick Help

**Local development:**
```bash
npm install
npm run dev
```

**Production build:**
```bash
npm run build
```

**Test production build:**
```bash
npx serve build
```

---

**Need more help?** Read `DEPLOYMENT_GUIDE.md`
