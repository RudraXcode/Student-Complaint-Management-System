# Role Mapping Test Cases
## Microsoft OAuth Email Pattern Testing

This document provides test cases to verify role assignment works correctly.

---

## Quick Test Guide

### Test 1: Admin Role Assignment

**Test Emails:**
```
✅ admin@university.in → Should assign: Admin
✅ admin@iitd.ac.in → Should assign: Admin
✅ admin123@anyuniversity.edu → Should assign: Admin
✅ user@admin.university.edu → Should assign: Admin
✅ system.admin@company.com → Should assign: Admin
```

**Expected Behavior:**
- User is redirected to **Admin Dashboard** after sign-in
- Can see all complaints from all students
- Can assign complaints to departments
- Can view escalations and reports

### Test 2: Department Head Role Assignment

**Test Emails:**
```
✅ hod@cs.university.edu → Should assign: Department Head
✅ hod.cs@iitd.ac.in → Should assign: Department Head
✅ dept.ece@university.edu → Should assign: Department Head
✅ head@engineering.university.in → Should assign: Department Head
✅ user@hod.university.edu → Should assign: Department Head
```

**Expected Behavior:**
- User is redirected to **Department Dashboard** after sign-in
- Can see complaints assigned to their department only
- Can update complaint status
- Can add comments to assigned complaints

### Test 3: Student Role Assignment (Default)

**Test Emails:**
```
✅ student@university.edu → Should assign: Student
✅ rahul.sharma@iitd.ac.in → Should assign: Student
✅ yourname@outlook.com → Should assign: Student
✅ user@gmail.com → Should assign: Student
✅ any.other.email@domain.com → Should assign: Student
```

**Expected Behavior:**
- User is redirected to **Student Dashboard** after sign-in
- Can submit new complaints
- Can track their own complaints
- Can add comments to their complaints

---

## University Detection Test Cases

### Test 4: Known University Domains

**Test Mappings:**
```
Email: user@iitd.ac.in
Expected University: Indian Institute of Technology (IIT) Delhi

Email: student@iitb.ac.in
Expected University: Indian Institute of Technology (IIT) Bombay

Email: admin@du.ac.in
Expected University: Delhi University

Email: user@jnu.ac.in
Expected University: Jawaharlal Nehru University
```

### Test 5: Unknown University Domains

**Test Mappings:**
```
Email: user@xyz.edu.in
Expected University: XYZ University (extracted from domain)

Email: student@mycollege.ac.in
Expected University: MYCOLLEGE University

Email: user@outlook.com
Expected University: (empty string - personal email)
```

---

## Edge Cases

### Test 6: Mixed Case Emails

All role detection is case-insensitive:
```
✅ ADMIN@university.in → Admin role
✅ Admin@University.IN → Admin role
✅ HoD.CS@University.EDU → Department Head role
✅ Student@IITD.AC.IN → Student role
```

### Test 7: Multiple Pattern Matches

First matching pattern wins:
```
✅ admin@hod.university.edu → Admin role (admin pattern matched first)
✅ hod.admin@university.edu → Department Head role (hod pattern matched first)
```

### Test 8: Special Characters

```
✅ admin-user@university.edu → Admin role
✅ hod_cs@university.edu → Department Head role
✅ student.123@university.edu → Student role
```

---

## Manual Testing Steps

### Step 1: Test Admin Sign-In

1. Go to login page: `http://localhost:3000`
2. Click **"Sign in with Microsoft"**
3. Sign in with Microsoft account: `admin@university.in` (or create test account)
4. After redirect, verify:
   - ✅ Redirected to Admin Dashboard
   - ✅ Can see "Admin Portal" heading
   - ✅ Can see all complaints
   - ✅ Can see statistics
5. Check browser console:
   ```javascript
   // Open DevTools (F12), run in console:
   JSON.parse(localStorage.getItem('scms_user_session'))
   // Should show: { role: 'admin', email: 'admin@...', ... }
   ```

### Step 2: Test Department Head Sign-In

1. Logout from admin account
2. Click **"Sign in with Microsoft"**
3. Sign in with: `hod.cs@university.edu`
4. After redirect, verify:
   - ✅ Redirected to Department Dashboard
   - ✅ Can see "Department Head Portal"
   - ✅ Can see assigned complaints only
5. Check localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('scms_user_session'))
   // Should show: { role: 'department-head', email: 'hod...', ... }
   ```

### Step 3: Test Student Sign-In

1. Logout
2. Click **"Sign in with Microsoft"**
3. Sign in with: `student@university.edu` or your personal Microsoft account
4. After redirect, verify:
   - ✅ Redirected to Student Dashboard
   - ✅ Can see "My Complaints" section
   - ✅ Can submit new complaint
5. Check localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('scms_user_session'))
   // Should show: { role: 'student', email: '...', ... }
   ```

---

## Automated Testing (For Developers)

### Unit Test for Role Mapping

Create `src/hooks/__tests__/useAuth.test.ts`:

```typescript
import { mapEmailToRole, extractUniversityFromEmail } from '../useAuth';

describe('Role Mapping', () => {
  describe('mapEmailToRole', () => {
    it('should assign admin role for admin emails', () => {
      expect(mapEmailToRole('admin@university.in')).toBe('admin');
      expect(mapEmailToRole('admin123@test.edu')).toBe('admin');
      expect(mapEmailToRole('user@admin.university.edu')).toBe('admin');
    });

    it('should assign department-head role for dept emails', () => {
      expect(mapEmailToRole('hod@cs.university.edu')).toBe('department-head');
      expect(mapEmailToRole('dept.ece@university.in')).toBe('department-head');
      expect(mapEmailToRole('head@engineering.edu')).toBe('department-head');
    });

    it('should assign student role by default', () => {
      expect(mapEmailToRole('student@university.edu')).toBe('student');
      expect(mapEmailToRole('user@outlook.com')).toBe('student');
      expect(mapEmailToRole('anything@domain.com')).toBe('student');
    });

    it('should be case-insensitive', () => {
      expect(mapEmailToRole('ADMIN@test.com')).toBe('admin');
      expect(mapEmailToRole('HoD@test.com')).toBe('department-head');
    });
  });

  describe('extractUniversityFromEmail', () => {
    it('should extract known universities', () => {
      expect(extractUniversityFromEmail('user@iitd.ac.in'))
        .toBe('Indian Institute of Technology (IIT) Delhi');
      expect(extractUniversityFromEmail('student@du.ac.in'))
        .toBe('Delhi University');
    });

    it('should generate university name from unknown domains', () => {
      expect(extractUniversityFromEmail('user@xyz.edu.in'))
        .toBe('XYZ University');
    });

    it('should return empty for invalid emails', () => {
      expect(extractUniversityFromEmail('invalidemail')).toBe('');
      expect(extractUniversityFromEmail('')).toBe('');
    });
  });
});
```

Run tests:
```bash
npm test
```

---

## Troubleshooting

### Issue 1: Wrong Role Assigned

**Symptom:** User with `admin@university.in` is assigned student role.

**Check:**
1. Open browser DevTools (F12) → Console
2. After sign-in, run:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('scms_user_session')))
   ```
3. Check if email is correctly captured
4. Verify `mapEmailToRole()` function in `src/hooks/useAuth.ts`

**Solution:**
- Clear localStorage and try again: `localStorage.clear()`
- Check console for JavaScript errors
- Verify the role mapping function wasn't modified

### Issue 2: University Not Detected

**Symptom:** University field shows empty string after sign-in.

**Check:**
1. Verify email domain is in `extractUniversityFromEmail()` mapping
2. Check if email is from a personal account (outlook.com, gmail.com)

**Solution:**
- Add your university domain to `universityMap` in `useAuth.ts`
- Or accept default generated name from domain

### Issue 3: Role Doesn't Persist After Refresh

**Symptom:** User role resets after page refresh.

**Check:**
1. Verify localStorage has the session:
   ```javascript
   localStorage.getItem('scms_user_session')
   ```
2. Check if session timeout (24 hours) has expired

**Solution:**
- Sign in again
- Verify `saveUserSession()` is called after OAuth redirect
- Check `getUserSession()` in `useAuth` initialization

---

## Custom Email Patterns

If you need to add custom role assignment patterns for your organization:

### Example 1: Multiple Admin Email Patterns

Edit `src/hooks/useAuth.ts` → `mapEmailToRole()`:

```typescript
// Your organization's specific admin patterns
if (
  emailLower.includes('admin@') ||
  emailLower.includes('@admin.') ||
  emailLower.endsWith('@administrators.university.edu') ||
  emailLower.startsWith('sys.admin@') ||
  emailLower.includes('.administrator@')
) {
  return 'admin';
}
```

### Example 2: Department-Specific Mapping

```typescript
// Map specific department emails
if (
  emailLower.includes('hod.cs@') ||
  emailLower.includes('hod.ece@') ||
  emailLower.includes('coordinator.it@')
) {
  return 'department-head';
}
```

### Example 3: University-Specific Rules

```typescript
// University of ABC specific rules
if (emailLower.endsWith('@abc.edu.in')) {
  if (emailLower.startsWith('faculty@')) {
    return 'department-head';
  }
  if (emailLower.startsWith('registrar@') || emailLower.startsWith('dean@')) {
    return 'admin';
  }
}
```

---

## Production Testing Checklist

Before going live:

- [ ] Test admin email sign-in
- [ ] Test department head email sign-in
- [ ] Test student email sign-in
- [ ] Test with personal Microsoft account
- [ ] Test with organizational Microsoft 365 account
- [ ] Verify role persists after page refresh
- [ ] Verify role persists after browser restart (within 24 hours)
- [ ] Test sign-out clears session
- [ ] Test switching between different roles
- [ ] Verify university is correctly extracted
- [ ] Check no console errors during OAuth flow
- [ ] Test on mobile devices
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

---

## Success Criteria

✅ **Role assignment works correctly:**
- Admin emails → Admin dashboard
- Department emails → Department dashboard
- Student emails → Student dashboard

✅ **University detection works:**
- Known domains → Correct university name
- Unknown domains → Generated name or empty

✅ **Session persists:**
- Role maintained after page refresh
- Session cleared on logout

✅ **Error-free:**
- No console errors during OAuth flow
- Proper error messages if OAuth fails

---

**Role mapping is fully automatic!** No manual configuration required for standard email patterns.

For custom patterns, edit `mapEmailToRole()` in `src/hooks/useAuth.ts`.

---

*Last Updated: November 19, 2025*
*Version: 1.0*
