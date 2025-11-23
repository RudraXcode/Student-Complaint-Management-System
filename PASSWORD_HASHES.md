# Password Hash Reference

This file contains the SHA-256 hashes used for demo accounts. **This is for development reference only.**

## How Passwords are Hashed

The system uses SHA-256 hashing via the Web Crypto API:

```typescript
const encoder = new TextEncoder();
const data = encoder.encode(password);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashHex = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');
```

## Demo Password Hashes

### Admin Password: `admin123`
```
240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
```

### Student Password: `student123`
```
703b0a3d6ad75b649a28adde7d83c6251da457549263bc7ff45ec709b0a8448b
```

### Department Password: `dept123`
```
245b342eb00576ef2efc99304125cffdd9bd6c27e0ac63812cd4211915606dd2
```

## How to Generate New Hashes

If you need to add new demo users, use this code in your browser console:

```javascript
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hashHex}`);
  return hashHex;
}

// Usage:
await hashPassword('yourpassword');
```

## Security Notes

⚠️ **Important**: 
- SHA-256 is used for **DEMO purposes only**
- Real production systems should use:
  - **bcrypt** or **argon2** (designed for password hashing)
  - Proper **salt generation** (SHA-256 has no salt here)
  - **Backend-only hashing** (never hash passwords in frontend for real auth)
  - **Rate limiting** on login attempts
  - **Secure password policies** (minimum length, complexity)

## Why Not Use This in Production?

1. **No Salt**: Same password = same hash (rainbow table attacks)
2. **Fast Algorithm**: SHA-256 is too fast, allows brute-force attacks
3. **Frontend Hashing**: Real apps hash on backend to prevent client manipulation
4. **No Stretching**: No key stretching makes brute-force easier

## Production Recommendations

Use a proper authentication service:
- **Supabase Auth** (built-in to your project)
- **Firebase Auth**
- **Auth0**
- **AWS Cognito**

Or implement server-side hashing with:
- **bcrypt** (Node.js: `bcryptjs` package)
- **argon2** (Node.js: `argon2` package)
- **PBKDF2** (built into most languages)

Example with bcrypt (server-side):
```javascript
const bcrypt = require('bcryptjs');

// Hash password
const hash = await bcrypt.hash(password, 12); // 12 salt rounds

// Verify password
const isValid = await bcrypt.compare(password, hash);
```
