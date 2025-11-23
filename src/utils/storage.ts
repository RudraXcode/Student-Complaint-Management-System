// Utility functions for persistent storage (localStorage/sessionStorage)
import { User, Complaint } from '../types';

const STORAGE_KEYS = {
  USER: 'scms_current_user',
  COMPLAINTS: 'scms_complaints',
  AUTH_TIMESTAMP: 'scms_auth_timestamp'
} as const;

// Session timeout: 24 hours
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * Save user session to localStorage
 */
export const saveUserSession = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Failed to save user session:', error);
  }
};

/**
 * Get user session from localStorage
 * Returns null if session expired or doesn't exist
 */
export const getUserSession = (): User | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const timestamp = localStorage.getItem(STORAGE_KEYS.AUTH_TIMESTAMP);
    
    if (!userStr || !timestamp) return null;
    
    // Check if session expired
    const authTime = parseInt(timestamp, 10);
    if (Date.now() - authTime > SESSION_TIMEOUT) {
      clearUserSession();
      return null;
    }
    
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Failed to get user session:', error);
    return null;
  }
};

/**
 * Clear user session from localStorage
 */
export const clearUserSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
  } catch (error) {
    console.error('Failed to clear user session:', error);
  }
};

/**
 * Save complaints to localStorage
 */
export const saveComplaints = (complaints: Complaint[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  } catch (error) {
    console.error('Failed to save complaints:', error);
  }
};

/**
 * Get complaints from localStorage
 */
export const getComplaints = (): Complaint[] | null => {
  try {
    const complaintsStr = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (!complaintsStr) return null;
    
    return JSON.parse(complaintsStr) as Complaint[];
  } catch (error) {
    console.error('Failed to get complaints:', error);
    return null;
  }
};

/**
 * Clear all stored data (for logout)
 */
export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};
