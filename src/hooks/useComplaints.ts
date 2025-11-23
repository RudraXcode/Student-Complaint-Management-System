import { useState, useEffect, useCallback } from 'react';
import { Complaint, AttachmentFile } from '../types';
import { mockComplaints } from '../utils/mockData';
import { getComplaints, saveComplaints } from '../utils/storage';

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const stored = getComplaints();
    return stored || mockComplaints;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage whenever complaints change
  useEffect(() => {
    saveComplaints(complaints);
  }, [complaints]);

  // Update complaint days periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setComplaints((prev) => {
        const currentDate = new Date();
        return prev.map((complaint) => {
          if (complaint.status === 'Resolved') return complaint;

          const submitDate = new Date(complaint.dateSubmitted);
          const daysDiff = Math.floor(
            (currentDate.getTime() - submitDate.getTime()) / (1000 * 3600 * 24)
          );
          const newDaysOpened = Math.max(complaint.daysOpened, daysDiff);

          if (newDaysOpened === complaint.daysOpened) return complaint;

          return { ...complaint, daysOpened: newDaysOpened };
        });
      });
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const addComplaint = useCallback((newComplaint: Complaint) => {
    setComplaints((prev) => [...prev, newComplaint]);
  }, []);

  const updateComplaintStatus = useCallback(
    (complaintId: string, status: Complaint['status']) => {
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                status,
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : complaint
        )
      );
    },
    []
  );

  const assignComplaintToDepartment = useCallback(
    (complaintId: string, departmentKey: string, departmentHead: string, assignedBy: string) => {
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                assignedDepartment: departmentKey,
                assignedDepartmentHead: departmentHead,
                departmentAssignedBy: assignedBy,
                departmentAssignedAt: new Date().toISOString(),
                status: 'In Progress',
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : complaint
        )
      );
    },
    []
  );

  const addComplaintComment = useCallback(
    (
      complaintId: string,
      message: string,
      author: string,
      role?: 'student' | 'admin' | 'department-head',
      attachments?: AttachmentFile[]
    ) => {
      const newComment = {
        id: `C${Date.now()}`,
        author,
        message,
        timestamp: new Date().toISOString(),
        attachments,
        role,
      };

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                comments: [...complaint.comments, newComment],
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : complaint
        )
      );
    },
    []
  );

  return {
    complaints,
    loading,
    error,
    addComplaint,
    updateComplaintStatus,
    assignComplaintToDepartment,
    addComplaintComment,
  };
}
