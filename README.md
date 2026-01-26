
  # Student Complaint Management System

  This is a code bundle for Student Complaint Management System. The original project is available at https://student-complaint-management-system-krmu.vercel.app
  ## 🚀 Quick Deploy

  **Ready to deploy?** Choose your platform:
  - **[Vercel](https://vercel.com/new)** - Recommended (2 min setup)
  - **[Netlify](https://app.netlify.com/start)** - Great alternative (2 min setup)
  - **[Render](https://render.com/)** - Simple hosting (3 min setup)

  📚 **Deployment Documentation:**
  - **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive step-by-step guide
  - **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick reference card
  - **[DEPLOYMENT_FLOWCHART.md](./DEPLOYMENT_FLOWCHART.md)** - Decision tree & best practices

  🔧 **Pre-deployment check:**
  ```bash
  ./deploy-check.sh
  ```

  ## Running the code

  ### Setup

  1. Copy the environment variables template:
  ```bash
  cp .env.example .env
  ```

  2. Edit `.env` and add your Supabase credentials (or use the provided demo values)

  3. Install dependencies:
  ```bash
  npm i
  ```

  ### Development

  Run the development server:
  ```bash
  npm run dev
  ```

  ### Build

  Create a production build:
  ```bash
  npm run build
  ```

  ## Security Features (Phase 1 - Completed)

  ✅ **Environment Variables**: Secrets moved to `.env` file (never committed)
  ✅ **Password Hashing**: Demo passwords now use SHA-256 hashing
  ✅ **Input Sanitization**: User input sanitized to prevent XSS attacks
  ✅ **Session Persistence**: Login sessions persist across page refreshes (24hr timeout)
  ✅ **Type Safety**: Centralized type definitions prevent circular dependencies
  ✅ **Race Condition Fixes**: Functional state updates prevent stale closures

  See [SECURITY.md](./SECURITY.md) for detailed documentation.

  ## 🔐 Microsoft OAuth Integration (NEW!)

  **Sign in with Microsoft** is now available! Enterprise-grade authentication with automatic role assignment.

  📚 **OAuth Documentation:**
  - **[OAUTH_QUICK_START.md](./OAUTH_QUICK_START.md)** - ⚡ 5-minute setup guide
  - **[AZURE_OAUTH_SETUP.md](./AZURE_OAUTH_SETUP.md)** - Complete walkthrough (20 min)
  - **[ROLE_MAPPING_TESTS.md](./ROLE_MAPPING_TESTS.md)** - Testing & validation
  - **[OAUTH_IMPLEMENTATION_SUMMARY.md](./OAUTH_IMPLEMENTATION_SUMMARY.md)** - Technical details

  **Features:**
  - ✅ Sign in with any Microsoft account (personal or organizational)
  - ✅ **Automatic role assignment** based on email patterns
  - ✅ **University detection** from email domain
  - ✅ Session management & persistence
  - ✅ Production ready

  **Supported Roles:**
  ```
  admin@university.in → Admin Dashboard
  hod.cs@university.edu → Department Head Dashboard
  student@university.edu → Student Dashboard
  ```

  ## Demo Credentials

  All demo passwords are now hashed for security. Use these credentials:

  - **Student**: `rahul.sharma@university.in` / `student123`
  - **Admin**: `admin@university.in` / `admin123`
  - **Department Heads**: Various emails / `dept123`

  ## Important Notes

  - **Never commit `.env`** - it contains sensitive credentials
  - Sessions expire after 24 hours for security
  - Data persists in localStorage (not suitable for production)
  - For production, implement proper backend authentication

  ## Project Structure

  ```
  src/
    ├── components/       # React components
    ├── types/           # TypeScript type definitions
    ├── utils/           # Utility functions
    │   ├── security.ts  # Security & sanitization utilities
    │   ├── storage.ts   # Session & data persistence
    │   ├── auth.ts      # Authentication logic
    │   └── supabase/    # Supabase client configuration
    └── App.tsx          # Main application component
  ```
