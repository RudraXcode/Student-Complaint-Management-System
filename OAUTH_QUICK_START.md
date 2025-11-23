# 🚀 Microsoft OAuth Quick Start

## ⚡ 5-Minute Setup Guide

---

## Step 1: Azure Portal (5 min)

1. Go to https://portal.azure.com
2. Search: **"App registrations"**
3. Click: **"+ New registration"**
4. Enter:
   - Name: `Student Complaint System`
   - Accounts: **Any organizational directory + personal accounts**
   - Redirect URI: `REDACTED`
5. Click: **"Register"**
6. Copy: **Application (client) ID**
7. Go to: **"Certificates & secrets"**
8. Click: **"+ New client secret"**
9. Copy: **Secret value** (immediately!)
10. Go to: **"Authentication"**
11. Add URI: `http://localhost:3000`
12. Click: **"Save"**

✅ **Done with Azure!**

---

## Step 2: Supabase (2 min)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to: **Authentication** → **Providers**
4. Find: **Microsoft**
5. Toggle: **ON**
6. Paste:
   - **Client ID** (from Azure step 6)
   - **Client Secret** (from Azure step 9)
   - **Tenant:** `common`
7. Click: **"Save"**

✅ **Done with Supabase!**

---

## Step 3: Local Setup (1 min)

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env file
# Add your Supabase credentials:
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 3. Start dev server
npm run dev
```

✅ **Done!**

---

## Step 4: Test (30 seconds)

1. Open: http://localhost:3000
2. Click: **"Sign in with Microsoft"**
3. Sign in with any Microsoft account
4. ✅ You're in!

---

## 🎭 Role Assignment (Automatic)

**Admin emails:**
```
admin@university.in
admin123@anyschool.edu
user@admin.university.edu
```

**Department Head emails:**
```
hod@cs.university.edu
dept.ece@university.in
head@engineering.university.edu
```

**Student emails:**
```
student@university.edu
yourname@outlook.com
any-other@email.com
```

No configuration needed - it just works! ✨

---

## 🏛️ University Detection (Automatic)

```
rahul@iitd.ac.in → IIT Delhi
student@du.ac.in → Delhi University
user@xyz.edu.in → XYZ University
```

---

## 🚀 Deploy to Production

### Vercel
```bash
git push
# Add environment variables in Vercel dashboard
```

### Add production redirect URI to Azure:
```
https://your-app.vercel.app
```

✅ **Live!**

---

## 🐛 Troubleshooting

**Problem:** Redirect URI mismatch
**Fix:** Check Azure URIs match exactly (including http/https)

**Problem:** Invalid client secret
**Fix:** Check secret in Supabase matches Azure (regenerate if needed)

**Problem:** User stuck on loading
**Fix:** Clear browser cache, check console for errors

---

## 📚 Full Documentation

- **Setup Guide:** `AZURE_OAUTH_SETUP.md` (detailed walkthrough)
- **Testing:** `ROLE_MAPPING_TESTS.md` (test all scenarios)
- **Summary:** `OAUTH_IMPLEMENTATION_SUMMARY.md` (technical details)
- **Deploy:** `DEPLOYMENT_GUIDE.md` (production deployment)

---

## ✅ Checklist

Setup:
- [ ] Azure app created
- [ ] Client ID & Secret copied
- [ ] Redirect URIs added
- [ ] Supabase provider enabled
- [ ] Environment variables set

Testing:
- [ ] Sign in works locally
- [ ] Correct role assigned
- [ ] University detected
- [ ] Session persists

Production:
- [ ] Production URI in Azure
- [ ] Env vars in hosting platform
- [ ] Deployed and tested

---

## 🎉 You're Done!

Total time: **8 minutes**

**What you have now:**
- ✅ Microsoft sign-in
- ✅ Automatic role assignment
- ✅ University detection
- ✅ Session management
- ✅ Production ready

Need help? Check the full docs or troubleshooting guides!

---

*Quick Start Guide v1.0*
