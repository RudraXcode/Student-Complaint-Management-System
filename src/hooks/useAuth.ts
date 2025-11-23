import { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authenticateUser } from '../utils/auth';
import { getUserSession, saveUserSession, clearUserSession } from '../utils/storage';
import { supabase } from '../utils/supabase/client';

/**
 * Maps email address to appropriate user role based on domain patterns
 * @param email - User's email address
 * @returns UserRole - Assigned role (admin, department-head, or student)
 */
function mapEmailToRole(email: string): UserRole {
  if (!email) return 'student';
  
  const emailLower = email.toLowerCase();
  
  // Admin patterns
  if (
    emailLower.includes('admin@') ||
    emailLower.includes('@admin.') ||
    emailLower.match(/admin\d*@/i) ||
    emailLower === 'admin@university.in'
  ) {
    return 'admin';
  }
  
  // Department head patterns
  if (
    emailLower.includes('hod@') ||
    emailLower.includes('@hod.') ||
    emailLower.includes('dept@') ||
    emailLower.includes('@dept.') ||
    emailLower.includes('head@') ||
    emailLower.match(/hod\.|head\.|dept\./i)
  ) {
    return 'department-head';
  }
  
  // Default to student
  return 'student';
}

/**
 * Extracts university name from email domain
 * @param email - User's email address
 * @returns University name or empty string
 */
function extractUniversityFromEmail(email: string): string {
  if (!email) return '';
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return '';
  
  // Map common domains to university names
  const universityMap: Record<string, string> = {
    'iitd.ac.in': 'Indian Institute of Technology (IIT) Delhi',
    'iitb.ac.in': 'Indian Institute of Technology (IIT) Bombay',
    'iitm.ac.in': 'Indian Institute of Technology (IIT) Madras',
    'iitkgp.ac.in': 'Indian Institute of Technology (IIT) Kharagpur',
    'iitk.ac.in': 'Indian Institute of Technology (IIT) Kanpur',
    'du.ac.in': 'Delhi University',
    'jnu.ac.in': 'Jawaharlal Nehru University',
    'amu.ac.in': 'Aligarh Muslim University',
    'bhu.ac.in': 'Banaras Hindu University',
    'university.in': 'Indian Institute of Technology (IIT) Delhi', // Demo fallback
  };
  
  // Check for exact match
  if (universityMap[domain]) {
    return universityMap[domain];
  }
  
  // Extract university name from domain (e.g., xyz.edu.in -> XYZ University)
  const parts = domain.split('.');
  if (parts.length > 0) {
    const name = parts[0];
    return name.toUpperCase() + ' University';
  }
  
  return '';
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getUserSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string, university: string) => {
    setLoading(true);
    setError(null);

    try {
      const authResult = await authenticateUser({ email, password, university });

      if (authResult.success && authResult.user) {
        setCurrentUser(authResult.user);
        saveUserSession(authResult.user);
        return { success: true, user: authResult.user };
      } else {
        const errorMsg = authResult.error || 'Authentication failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearUserSession();
    setError(null);
  }, []);

  // Sign in using OAuth provider (e.g. Microsoft/Azure)
  const oauthSignIn = useCallback(async (provider: 'azure' | 'google' | 'github') => {
    setLoading(true);
    try {
      const redirectTo = window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } as any } as any);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      // signInWithOAuth will redirect the user to the provider; if it returns without redirecting,
      // we'll just return the data object.
      return { success: true, data };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'OAuth sign-in failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((user: User) => {
    setCurrentUser(user);
    saveUserSession(user);
  }, []);

  // Listen for Supabase auth changes and process OAuth redirects
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // If the URL has OAuth parameters, process them and finalize session
        // supabase.auth.getSessionFromUrl parses the redirect and sets the session
        if ((supabase.auth as any).getSessionFromUrl) {
          try {
            // getSessionFromUrl may throw if no params present; swallow errors
            // @ts-ignore
            await supabase.auth.getSessionFromUrl({ storeSession: true });
          } catch (e) {
            // ignore
          }
        }

        // After processing redirect, get current session
        const sessionRes = await supabase.auth.getSession();
        const session = sessionRes?.data?.session;
        if (mounted && session?.user) {
          const u = session.user;
          const email = u.email || '';
          const mapped: User = {
            id: u.id,
            name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || u.email || '',
            email: email,
            role: mapEmailToRole(email),
            university: extractUniversityFromEmail(email),
          };
          setCurrentUser(mapped);
          saveUserSession(mapped);
        }
      } catch (err) {
        // ignore
      }
    })();

    // Subscribe to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user as any;
        const email = u.email || '';
        const mapped: User = {
          id: u.id,
          name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || u.email || '',
          email: email,
          role: mapEmailToRole(email),
          university: extractUniversityFromEmail(email),
        };
        setCurrentUser(mapped);
        saveUserSession(mapped);
      } else {
        // Signed out
        setCurrentUser(null);
        clearUserSession();
      }
    });

    return () => {
      mounted = false;
      try {
        if (sub && typeof (sub as any).unsubscribe === 'function') {
          (sub as any).unsubscribe();
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return {
    currentUser,
    loading,
    error,
    login,
    logout,
    oauthSignIn,
    updateUser,
    isAuthenticated: !!currentUser,
  };
}
