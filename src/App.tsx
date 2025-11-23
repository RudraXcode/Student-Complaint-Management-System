import React, { useState, useEffect, useMemo } from "react";
import { LoginPage } from "./components/LoginPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { NewComplaintForm } from "./components/NewComplaintForm";
import { ComplaintTracker } from "./components/ComplaintTracker";
import { ComplaintDetails } from "./components/ComplaintDetails";
import { AdminComplaintsTable } from "./components/AdminComplaintsTable";
import { EscalationDashboard } from "./components/EscalationDashboard";
import { ReportsPage } from "./components/ReportsPage";
import { DepartmentDashboard } from "./components/DepartmentDashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuth } from "./hooks/useAuth";
import { useComplaints } from "./hooks/useComplaints";
import { useNotifications } from "./hooks/useNotifications";
import type { User, Complaint, AttachmentFile, AppView } from "./types";

// Re-export types for backward compatibility with existing components
export type { User, Complaint, AttachmentFile, AppView };
export type UserRole = User['role'];

export default function App() {
  // Use custom hooks for cleaner state management
  const { currentUser, loading: authLoading, error: authError, login, logout, oauthSignIn } = useAuth();
  const {
    complaints,
    loading: complaintsLoading,
    addComplaint,
    updateComplaintStatus,
    assignComplaintToDepartment,
    addComplaintComment,
  } = useComplaints();

  // Use notifications hook for admin critical alerts
  useNotifications({
    enabled: true,
    user: currentUser,
    complaints,
  });

  const [currentView, setCurrentView] = useState<AppView>("login");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Navigate to appropriate dashboard if user session exists
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        setCurrentView("admin-dashboard");
      } else if (currentUser.role === "department-head") {
        setCurrentView("department-dashboard");
      } else {
        setCurrentView("student-dashboard");
      }
    } else {
      setCurrentView("login");
    }
  }, [currentUser]);

  // Check for password reset token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setCurrentView('reset-password');
    }
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
    university: string,
  ) => {
    const result = await login(email, password, university);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView("login");
    setSelectedComplaint(null);
  };

  const navigateTo = (view: AppView, complaint?: Complaint) => {
    setCurrentView(view);
    if (complaint) {
      setSelectedComplaint(complaint);
    }
  };

  const handleComplaintSubmit = (
    complaintData: Partial<Complaint>,
  ) => {
    const newComplaint: Complaint = {
      id: `COMP-${String(complaints.length + 1).padStart(3, "0")}`,
      studentId: currentUser?.id || "",
      studentName: currentUser?.name || "",
      university: currentUser?.university || "",
      category: complaintData.category || "Other",
      description: complaintData.description || "",
      priority: complaintData.priority || "Medium",
      status: "Pending",
      escalationLevel: 1,
      dateSubmitted: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      daysOpened: 0,
      attachments: complaintData.attachments,
      comments: [],
    };

    addComplaint(newComplaint);
    setCurrentView("complaint-tracker");
  };

  const handleComplaintAssign = (
    complaintId: string,
    departmentKey: string,
    departmentHead: string,
  ) => {
    assignComplaintToDepartment(
      complaintId,
      departmentKey,
      departmentHead,
      currentUser?.name || ""
    );
  };

  const handleAddComment = (
    complaintId: string,
    message: string,
    attachments?: AttachmentFile[],
  ) => {
    addComplaintComment(
      complaintId,
      message,
      currentUser?.name || "",
      currentUser?.role,
      attachments
    );
  };

  // Show loading screen during authentication
  if (authLoading) {
    return <LoadingSpinner fullScreen message="Authenticating..." />;
  }

  // Memoized filtered complaints
  const studentComplaints = useMemo(
    () => complaints.filter((c) => c.studentId === currentUser?.id),
    [complaints, currentUser]
  );
  
  const departmentComplaints = useMemo(
    () =>
      complaints.filter(
        (c) =>
          currentUser?.role === "department-head" &&
          c.assignedDepartment === currentUser.department,
      ),
    [complaints, currentUser],
  );

  if (currentView === "login") {
    return (
      <ErrorBoundary fallbackMessage="Login page encountered an error">
        <LoginPage onLogin={handleLogin} onOAuthSignIn={oauthSignIn} />
      </ErrorBoundary>
    );
  }

  if (currentView === 'reset-password' && resetToken) {
    const { ResetPassword } = require('./components/ResetPassword');
    return (
      <ErrorBoundary fallbackMessage="Password reset encountered an error">
        <ResetPassword token={resetToken} onDone={() => setCurrentView('login')} />
      </ErrorBoundary>
    );
  }

  switch (currentView) {
    case "student-dashboard":
      return (
        <ErrorBoundary fallbackMessage="Student dashboard encountered an error" onReset={() => setCurrentView("student-dashboard")}>
          <StudentDashboard
            user={currentUser!}
            complaints={studentComplaints}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        </ErrorBoundary>
      );
    case "admin-dashboard":
      return (
        <ErrorBoundary fallbackMessage="Admin dashboard encountered an error" onReset={() => setCurrentView("admin-dashboard")}>
          <AdminDashboard
            user={currentUser!}
            complaints={complaints}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        </ErrorBoundary>
      );
    case "department-dashboard":
      return (
        <ErrorBoundary fallbackMessage="Department dashboard encountered an error" onReset={() => setCurrentView("department-dashboard")}>
          <DepartmentDashboard
            user={currentUser!}
            complaints={departmentComplaints}
            allComplaints={complaints}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            onStatusUpdate={updateComplaintStatus}
            onAddComment={handleAddComment}
          />
        </ErrorBoundary>
      );
    case "new-complaint":
      return (
        <ErrorBoundary fallbackMessage="New complaint form encountered an error">
          <NewComplaintForm
            onSubmit={handleComplaintSubmit}
            onBack={() => navigateTo("student-dashboard")}
          />
        </ErrorBoundary>
      );
    case "complaint-tracker":
      return (
        <ErrorBoundary fallbackMessage="Complaint tracker encountered an error">
          <ComplaintTracker
            complaints={studentComplaints}
            onComplaintSelect={(complaint) =>
              navigateTo("complaint-details", complaint)
            }
            onBack={() => navigateTo("student-dashboard")}
          />
        </ErrorBoundary>
      );
    case "complaint-details":
      return (
        <ErrorBoundary fallbackMessage="Complaint details encountered an error">
          <ComplaintDetails
            complaint={selectedComplaint!}
            currentUser={currentUser!}
            onBack={() => {
              if (currentUser?.role === "admin") {
                navigateTo("admin-complaints");
              } else if (currentUser?.role === "department-head") {
                navigateTo("department-dashboard");
              } else {
                navigateTo("complaint-tracker");
              }
            }}
            onAddComment={handleAddComment}
          />
        </ErrorBoundary>
      );
    case "admin-complaints":
      return (
        <ErrorBoundary fallbackMessage="Complaints table encountered an error">
          <AdminComplaintsTable
            complaints={complaints}
            onComplaintSelect={(complaint) =>
              navigateTo("complaint-details", complaint)
            }
            onStatusUpdate={updateComplaintStatus}
            onDepartmentAssign={handleComplaintAssign}
            onBack={() => navigateTo("admin-dashboard")}
          />
        </ErrorBoundary>
      );
    case "escalations":
      return (
        <ErrorBoundary fallbackMessage="Escalations dashboard encountered an error">
          <EscalationDashboard
            complaints={complaints.filter(
              (c) => c.status === "Escalated",
            )}
            onComplaintSelect={(complaint) =>
              navigateTo("complaint-details", complaint)
            }
            onBack={() => navigateTo("admin-dashboard")}
          />
        </ErrorBoundary>
      );
    case "reports":
      return (
        <ErrorBoundary fallbackMessage="Reports page encountered an error">
          <ReportsPage
            complaints={complaints}
            onBack={() => navigateTo("admin-dashboard")}
          />
        </ErrorBoundary>
      );
    default:
      return <div>Unknown view</div>;
  }
}