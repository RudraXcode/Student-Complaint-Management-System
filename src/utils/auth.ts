import { User } from '../types';
import { hashPassword, verifyPassword } from './security';

export interface AuthCredentials {
  email: string;
  password: string;
  university: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'department-head';
  university: string;
  passwordHash: string; // Changed from plain password to hash
  rollNumber?: string;
  department?: string;
};

// IMPORTANT: These are hashed passwords for demo purposes
// Plain text passwords: admin123, student123, dept123
// In production, use proper backend authentication with bcrypt/argon2
const demoUsers: DemoUser[] = [
  {
    id: 'ADMIN-001',
    name: 'Dr. Rajesh Kumar (Admin)',
    email: 'admin@university.in',
    role: 'admin',
    university: 'Indian Institute of Technology (IIT) Delhi',
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
  },
  {
    id: 'STU-001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@university.in',
    role: 'student',
    university: 'Indian Institute of Technology (IIT) Delhi',
    passwordHash: '703b0a3d6ad75b649a28adde7d83c6251da457549263bc7ff45ec709b0a8448b', // student123
    rollNumber: '2021CS001',
  },
  {
    id: 'STU-010',
    name: 'KR Student',
    email: '2201010038@krmu.edu.in',
    role: 'student',
    university: 'K.R Mangalam University',
    passwordHash: '703b0a3d6ad75b649a28adde7d83c6251da457549263bc7ff45ec709b0a8448b', // student123
    rollNumber: '2201010038',
  },
  {
    id: 'DEPT-001',
    name: 'Dr. Priya Sharma',
    email: 'academic.head@university.in',
    role: 'department-head',
    university: 'Indian Institute of Technology (IIT) Delhi',
    passwordHash: '245b342eb00576ef2efc99304125cffdd9bd6c27e0ac63812cd4211915606dd2', // dept123
    department: 'academics',
  },
  {
    id: 'DEPT-002',
    name: 'Eng. Vikram Singh',
    email: 'facilities@university.in',
    role: 'department-head',
    university: 'Indian Institute of Technology (IIT) Delhi',
    passwordHash: '245b342eb00576ef2efc99304125cffdd9bd6c27e0ac63812cd4211915606dd2', // dept123
    department: 'facilities',
  },
  {
    id: 'DEPT-003',
    name: 'Dr. Anita Gupta',
    email: 'mess.committee@university.in',
    role: 'department-head',
    university: 'Indian Institute of Technology (IIT) Delhi',
    passwordHash: '245b342eb00576ef2efc99304125cffdd9bd6c27e0ac63812cd4211915606dd2', // dept123
    department: 'food-services',
  },
  {
    id: 'DEPT-004',
    name: 'Prof. Rajesh Kumar',
    email: 'student.affairs@university.in',
    role: 'department-head',
    university: 'Indian Institute of Technology (IIT) Delhi',
    passwordHash: '245b342eb00576ef2efc99304125cffdd9bd6c27e0ac63812cd4211915606dd2', // dept123
    department: 'student-affairs',
  },
  {
    id: 'DEPT-005',
    name: 'Mrs. Sunita Patel',
    email: 'admin.services@university.in',
    role: 'department-head',
    university: 'Indian Institute of Technology (IIT) Delhi',
    passwordHash: '245b342eb00576ef2efc99304125cffdd9bd6c27e0ac63812cd4211915606dd2', // dept123
    department: 'administration',
  },
];

export const authenticateUser = async (credentials: AuthCredentials): Promise<AuthResult> => {
  const email = credentials.email?.trim().toLowerCase();
  const password = credentials.password;
  const university = credentials.university;

  const found = demoUsers.find((u) => u.email.toLowerCase() === email && u.university === university);
  
  if (found) {
    // Verify password hash
    const isPasswordValid = await verifyPassword(password, found.passwordHash);
    
    if (isPasswordValid) {
      const user: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        university: found.university,
        rollNumber: found.rollNumber,
        department: found.department,
      };
      return { success: true, user };
    }
  }

  return { success: false, error: 'Invalid credentials' };
};

export const getDemoCredentials = () => {
  // Return plain text passwords for the UI to display/use
  // These will be hashed during authentication
  return {
    student: {
      email: 'rahul.sharma@university.in',
      password: 'student123',
      university: 'Indian Institute of Technology (IIT) Delhi',
    },
    krmuStudent: {
      email: '2201010038@krmu.edu.in',
      password: 'student123',
      university: 'K.R Mangalam University',
    },
    admin: {
      email: 'admin@university.in',
      password: 'admin123',
      university: 'Indian Institute of Technology (IIT) Delhi',
    },
    departmentHeads: demoUsers.filter((u) => u.role === 'department-head').map((d) => ({ 
      name: d.name, 
      email: d.email, 
      password: 'dept123', // All department heads use dept123
      university: d.university 
    })),
  };
};

export const updatePasswordByEmail = async (email: string, newPassword: string): Promise<boolean> => {
  const idx = demoUsers.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx === -1) return false;
  
  // Hash the new password before storing
  const newPasswordHash = await hashPassword(newPassword);
  demoUsers[idx].passwordHash = newPasswordHash;
  
  // Note: This only persists in memory. On page refresh, passwords reset.
  // For production, passwords should be updated in a backend database.
  return true;
};

export const findUserByEmail = (email: string): User | undefined => {
  const found = demoUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!found) return undefined;
  return {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    university: found.university,
    rollNumber: found.rollNumber,
    department: found.department,
  };
};