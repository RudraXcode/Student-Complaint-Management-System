# Microsoft Azure OAuth Setup Guide
## Step-by-Step Integration for Student Complaint Management System

---

## Overview

This guide walks you through setting up Microsoft (Azure AD) OAuth authentication for your Student Complaint Management System using Supabase as the authentication provider.

**What you'll accomplish:**
- Create an Azure AD app registration
- Configure redirect URIs for local dev and production
- Connect Azure app to Supabase authentication
- Test Microsoft sign-in flow

**Time required:** 15-20 minutes

---

## Prerequisites

- ✅ Azure account (can use personal Microsoft account or organizational account)
- ✅ Supabase project created
- ✅ Project running locally (`npm run dev`)

---

## Part 1: Create Azure AD App Registration

### Step 1: Access Azure Portal

1. Go to https://portal.azure.com
2. Sign in with your Microsoft account
3. In the search bar at the top, type **"Azure Active Directory"** (or **"Microsoft Entra ID"**)
4. Click on the service

### Step 2: Register a New Application

1. In the left sidebar, click **"App registrations"**
2. Click **"+ New registration"** at the top
3. Fill in the registration form:

   **Name:** `Student Complaint Management System`
   
   **Supported account types:** Choose one:
   - ✅ **Accounts in any organizational directory and personal Microsoft accounts** (Recommended - allows university emails + personal accounts)
   - Or **Accounts in this organizational directory only** (if you want to restrict to your organization)

   **Redirect URI:**
   - Select **"Web"** from the dropdown
   - Enter: `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
   - Replace `YOUR_SUPABASE_PROJECT_ID` with your actual Supabase project ID

4. Click **"Register"**

### Step 3: Note Your Application (Client) ID

After registration, you'll see the app overview page.

**Copy these values** (you'll need them later):
- **Application (client) ID**: e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- **Directory (tenant) ID**: e.g., `12345678-abcd-ef12-3456-7890abcdef12`

📝 **Save these in a secure note** - don't commit them to Git!

### Step 4: Create a Client Secret

1. In the left sidebar, click **"Certificates & secrets"**
2. Under **"Client secrets"** tab, click **"+ New client secret"**
3. Add a description: `SCMS Supabase Integration`
4. Select expiration: 
   - Development: **6 months** or **1 year**
   - Production: **24 months** (maximum)
5. Click **"Add"**
6. **IMMEDIATELY COPY THE SECRET VALUE** (the long string shown under "Value" column)
   
   ⚠️ **IMPORTANT:** You can only see this secret ONCE. If you lose it, you'll need to create a new one.

📝 **Save the secret value securely** - treat it like a password!

### Step 5: Add Additional Redirect URIs

You need redirect URIs for both local development and production.

1. In the left sidebar, click **"Authentication"**
2. Under **"Platform configurations"**, find your Web platform
3. Click **"Add URI"** and add these:

   **Local development:**
   ```
   http://localhost:3000
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```

   **Production (after deployment):**
   ```
   https://your-app-domain.vercel.app
   https://your-app-domain.netlify.app
   (or your custom domain)
   ```

4. Scroll down and click **"Save"**

### Step 6: Configure Token Settings (Optional but Recommended)

1. Still in **"Authentication"**, scroll down to **"Implicit grant and hybrid flows"**
2. ✅ Check **"ID tokens (used for implicit and hybrid flows)"** if not already checked
3. Click **"Save"**

---

## Part 2: Configure Supabase

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in and select your project
3. In the left sidebar, click **"Authentication"**
4. Click **"Providers"**

### Step 2: Enable Microsoft Provider

1. Scroll down and find **"Microsoft"** (or **"Azure"**)
2. Toggle it **ON** (switch to enabled)
3. You'll see configuration fields appear

### Step 3: Configure Microsoft Provider

Fill in the following fields:

**Azure AD OAuth Client ID:**
```
YOUR_APPLICATION_CLIENT_ID
```
(The Application (client) ID from Azure - Step 3 above)

**Azure AD OAuth Client Secret:**
```
YOUR_CLIENT_SECRET_VALUE
```
(The secret value from Azure - Step 4 above)

**Azure AD Tenant:**
- If you selected "Accounts in any organizational directory and personal Microsoft accounts":
  ```
  common
  ```
- If you selected "Accounts in this organizational directory only":
  ```
  YOUR_DIRECTORY_TENANT_ID
  ```
  (The Directory (tenant) ID from Azure)

### Step 4: Note the Redirect URL

Supabase will show you the redirect URL at the top of the provider config:
```
https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
```

✅ **Verify this matches** the redirect URI you added in Azure (Part 1, Step 5)

### Step 5: Save Configuration

Click **"Save"** at the bottom of the provider settings.

---

## Part 3: Configure Your Application

### Step 1: Set Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and set these values:
   ```env
   VITE_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

   **Where to find these:**
   - Go to your Supabase project dashboard
   - Click **"Settings"** (gear icon in sidebar)
   - Click **"API"**
   - Copy **"Project URL"** → `VITE_SUPABASE_URL`
   - Copy **"anon public"** key → `VITE_SUPABASE_ANON_KEY`

3. **NEVER commit `.env` to Git!** (Already in .gitignore)

### Step 2: Verify Configuration Files

Check that these files exist and are configured:
- ✅ `src/hooks/useAuth.ts` - OAuth integration
- ✅ `src/components/LoginPage.tsx` - Microsoft sign-in button
- ✅ `src/utils/supabase/client.ts` - Supabase client

All these should already be set up from the previous integration steps.

---

## Part 4: Test the Integration

### Step 1: Start Development Server

```bash
npm install    # If not done already
npm run dev
```

The app should open at `http://localhost:3000`

### Step 2: Test Microsoft Sign-In

1. Click the **"Sign in with Microsoft"** button
2. You should be redirected to Microsoft login page
3. Sign in with any Microsoft account:
   - Personal account (outlook.com, hotmail.com, etc.)
   - Organizational account (your university email if it uses Microsoft)
4. Grant consent when prompted
5. You should be redirected back to your app at `http://localhost:3000`
6. The app should automatically detect the OAuth redirect and sign you in

### Step 3: Verify Sign-In Success

After redirect, check:
- ✅ You're logged in (redirected to dashboard)
- ✅ User info is displayed (name, email)
- ✅ Browser console has no errors (open with F12)

### Step 4: Test Sign-Out

1. Click logout button
2. Verify you return to login page
3. Verify you can sign in again

---

## Part 5: Deploy to Production

### Step 1: Add Production Redirect URIs

In Azure Portal (Part 1, Step 5), add your production domain:

**After deploying to Vercel:**
```
https://your-app-name.vercel.app
```

**After deploying to Netlify:**
```
https://your-app-name.netlify.app
```

**Custom domain:**
```
https://yourdomain.com
```

### Step 2: Set Production Environment Variables

In your hosting platform (Vercel/Netlify/Render):

1. Go to project settings
2. Find "Environment Variables" section
3. Add:
   ```
   VITE_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

### Step 3: Redeploy

If using Git-based deployment:
```bash
git add .
git commit -m "Configure Microsoft OAuth"
git push
```

Auto-deployment will trigger and your changes will be live in 2-3 minutes.

### Step 4: Test Production

1. Visit your production URL
2. Click "Sign in with Microsoft"
3. Complete sign-in flow
4. Verify everything works

---

## Troubleshooting

### Issue 1: "Redirect URI mismatch" Error

**Symptom:** After Microsoft login, you see an error about redirect URI.

**Solution:**
1. Check that redirect URIs in Azure exactly match Supabase callback URL
2. Ensure `https://` protocol is correct (not `http://` for production)
3. Check for trailing slashes (should not have any)
4. Wait 5 minutes after making changes (Azure can take time to propagate)

### Issue 2: "Invalid client secret" Error

**Symptom:** Microsoft login fails with invalid secret error.

**Solution:**
1. Verify the client secret in Supabase matches the one from Azure
2. Check if the secret has expired (go to Azure → Certificates & secrets)
3. If expired, create a new secret and update Supabase

### Issue 3: User Stuck on Loading After Redirect

**Symptom:** After redirect from Microsoft, app shows loading spinner forever.

**Solution:**
1. Check browser console for errors (F12)
2. Verify `useAuth.ts` is properly handling the redirect
3. Check that Supabase environment variables are set correctly
4. Clear browser cache and cookies, try again

### Issue 4: "User is Null" After Sign-In

**Symptom:** OAuth succeeds but `currentUser` is null.

**Solution:**
1. Check `useAuth.ts` effect that processes `onAuthStateChange`
2. Verify user metadata mapping (name, email extraction)
3. Check localStorage for persisted session data
4. Look for console errors

### Issue 5: Local Development Not Working

**Symptom:** Microsoft sign-in works in production but not locally.

**Solution:**
1. Ensure `http://localhost:3000` is in Azure redirect URIs
2. Check that `.env` file exists and has correct values
3. Restart dev server after changing `.env`
4. Clear browser cache

---

## Security Best Practices

### ✅ DO:
- Keep client secrets secure (never commit to Git)
- Use environment variables for all credentials
- Set appropriate expiration times for secrets
- Test both dev and production environments
- Rotate secrets periodically (every 6-12 months)
- Use HTTPS for all production redirect URIs

### ❌ DON'T:
- Don't commit `.env` files
- Don't share client secrets in chat/email
- Don't use the same secret across multiple apps
- Don't hardcode credentials in source code
- Don't expose secrets in browser console logs

---

## Role Mapping (Automatic - Already Implemented! ✅)

The system **automatically assigns roles** based on email address patterns. No manual configuration needed!

### How It Works:

**Admin Role** - Assigned if email matches:
- Contains `admin@` (e.g., `admin@university.edu`)
- Contains `@admin.` (e.g., `user@admin.university.edu`)
- Matches pattern `admin123@` etc.
- Exact match: `admin@university.in`

**Department Head Role** - Assigned if email matches:
- Contains `hod@` (Head of Department)
- Contains `@hod.` or `@dept.`
- Contains `dept@` or `head@`
- Matches patterns like `hod.cs@`, `head.ece@`

**Student Role** - Default for all other emails
- Regular university emails (e.g., `student@university.edu`)
- Personal Microsoft accounts
- Any email not matching above patterns

### University Detection:

The system extracts university from email domain:

```
Email: rahul@iitd.ac.in → IIT Delhi
Email: admin@du.ac.in → Delhi University
Email: user@custom.edu.in → CUSTOM University
```

**Supported university domains:**
- `iitd.ac.in` → Indian Institute of Technology (IIT) Delhi
- `iitb.ac.in` → Indian Institute of Technology (IIT) Bombay
- `iitm.ac.in` → Indian Institute of Technology (IIT) Madras
- `iitkgp.ac.in` → Indian Institute of Technology (IIT) Kharagpur
- `iitk.ac.in` → Indian Institute of Technology (IIT) Kanpur
- `du.ac.in` → Delhi University
- `jnu.ac.in` → Jawaharlal Nehru University
- `amu.ac.in` → Aligarh Muslim University
- `bhu.ac.in` → Banaras Hindu University
- Other domains → Extracted from domain name

### Testing Role Assignment:

**To test as Admin:**
```
Sign in with: admin@university.in
or: admin123@anyuniversity.edu
or: user@admin.university.edu
```

**To test as Department Head:**
```
Sign in with: hod.cs@university.edu
or: dept.ece@university.edu
or: head@engineering.university.edu
```

**To test as Student:**
```
Sign in with: student@university.edu
or: yourname@outlook.com (personal account)
or: any-other-email@domain.com
```

### Custom Role Mapping:

If you need to customize the role assignment logic, edit `src/hooks/useAuth.ts`:

1. Find the `mapEmailToRole()` function (around line 8-40)
2. Add your custom email patterns:

```typescript
function mapEmailToRole(email: string): UserRole {
  const emailLower = email.toLowerCase();
  
  // Your custom admin patterns
  if (emailLower.endsWith('@admin.myuniversity.edu')) {
    return 'admin';
  }
  
  // Your custom dept head patterns
  if (emailLower.includes('.hod@') || emailLower.includes('coordinator@')) {
    return 'department-head';
  }
  
  // ... rest of the function
}
```

3. To add more universities, edit `extractUniversityFromEmail()` function:

```typescript
const universityMap: Record<string, string> = {
  'myuniversity.edu': 'My Custom University',
  'another.edu.in': 'Another University Name',
  // ... add your universities
};
```

---

## Configuration Checklist

Use this checklist to ensure everything is set up:

### Azure Configuration:
- [ ] App registration created
- [ ] Application (client) ID copied
- [ ] Client secret created and copied
- [ ] Redirect URIs added (Supabase callback, localhost, production)
- [ ] Supported account types configured
- [ ] Token settings configured

### Supabase Configuration:
- [ ] Microsoft provider enabled
- [ ] Client ID pasted
- [ ] Client secret pasted
- [ ] Tenant set to "common" (or specific tenant)
- [ ] Configuration saved

### Application Configuration:
- [ ] `.env` file created from `.env.example`
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] `.env` added to `.gitignore`

### Testing:
- [ ] Local dev server running
- [ ] Microsoft sign-in button visible
- [ ] Sign-in redirects to Microsoft
- [ ] Redirect back to app works
- [ ] User session persists
- [ ] Sign-out works

### Production:
- [ ] Production redirect URIs added to Azure
- [ ] Environment variables set in hosting platform
- [ ] Deployed and tested
- [ ] No console errors in production

---

## Quick Reference

### Azure Portal URLs:
- **Main Portal:** https://portal.azure.com
- **App Registrations:** Portal → Azure Active Directory → App registrations

### Supabase Dashboard:
- **Main:** https://supabase.com/dashboard
- **Auth Providers:** Project → Authentication → Providers

### Redirect URI Format:
```
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

### Environment Variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Next Steps

After successful integration:

1. **Test thoroughly** with different Microsoft account types and email patterns
2. **Test role assignment** - Try signing in with admin@, hod@, and regular emails
3. **Set up error tracking** (Sentry, LogRocket) to monitor auth issues
4. **Document credentials** in your team's password manager
5. **Schedule secret rotation** (calendar reminder in 6 months)
6. **Consider adding Google OAuth** (similar process)

---

## Support Resources

### Official Documentation:
- **Azure AD:** https://docs.microsoft.com/azure/active-directory/
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **OAuth 2.0:** https://oauth.net/2/

### Troubleshooting:
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag with [azure-ad] and [supabase]

---

**Setup Complete!** 🎉

Your Student Complaint Management System now supports Microsoft authentication.

Users can sign in with:
- ✅ Microsoft personal accounts (outlook.com, hotmail.com, live.com)
- ✅ Organizational Microsoft 365 accounts (university emails)
- ✅ Azure AD accounts

---

*Last Updated: November 19, 2025*
*Version: 1.0*
