// Shared type definitions for the application
// This file prevents circular dependencies and provides a single source of truth

export type UserRole = "student" | "admin" | "department-head";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
  rollNumber?: string;
  department?: string; // For department heads
}

export type ComplaintStatus = "Pending" | "In Progress" | "Resolved" | "Escalated";
export type ComplaintPriority = "Low" | "Medium" | "High";
export type ComplaintCategory = "Academics" | "Hostel" | "Mess" | "Facilities" | "Administration" | "Other";
export type EscalationLevel = 1 | 2 | 3;

export interface AttachmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  attachments?: AttachmentFile[];
  role?: UserRole;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  university: string;
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  escalationLevel: EscalationLevel;
  dateSubmitted: string;
  lastUpdated: string;
  daysOpened: number;
  attachments?: AttachmentFile[];
  assignedDepartment?: string;
  assignedDepartmentHead?: string;
  departmentAssignedBy?: string;
  departmentAssignedAt?: string;
  comments: Comment[];
}

export type AppView =
  | "login"
  | "reset-password"
  | "student-dashboard"
  | "admin-dashboard"
  | "new-complaint"
  | "complaint-tracker"
  | "complaint-details"
  | "admin-complaints"
  | "escalations"
  | "reports"
  | "department-dashboard";
