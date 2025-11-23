// Security utilities for input sanitization and validation

/**
 * Sanitize user input to prevent XSS attacks
 * This is a basic implementation - in production, use DOMPurify
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove dangerous HTML tags and attributes
  const dangerous = /<script|<iframe|<object|<embed|javascript:/gi;
  let sanitized = input.replace(dangerous, '');
  
  // Escape HTML special characters
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  sanitized = sanitized.replace(/[&<>"'\/]/g, (char) => htmlEscapes[char] || char);
  
  return sanitized;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate that input doesn't exceed maximum length
 */
export const isValidLength = (input: string, maxLength: number): boolean => {
  return input.length <= maxLength;
};

/**
 * Hash password using Web Crypto API (browser-based)
 * For demo purposes - in production use bcrypt/argon2 on backend
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Password hashing failed:', error);
    // Fallback for environments without crypto.subtle
    return btoa(password); // Base64 encoding as fallback (NOT secure, just for demo)
  }
};

/**
 * Verify password against hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    const hashedInput = await hashPassword(password);
    return hashedInput === hash;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};

/**
 * Generate a secure random token
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Sanitize URL to prevent javascript: protocol attacks
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '#';
  
  const dangerous = /^(javascript|data|vbscript):/gi;
  if (dangerous.test(url)) {
    return '#';
  }
  
  return url;
};
