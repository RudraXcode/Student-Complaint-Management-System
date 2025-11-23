import { useMemo } from 'react';
import { Complaint } from '../types/index';

export function useAdminStats(complaints: Complaint[]) {
  const stats = useMemo(() => {
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length; 
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const escalatedComplaints = complaints.filter(c => c.status === 'Escalated').length;
    
    // Calculate overdue complaints with different urgency levels
    const overdueComplaints = complaints.filter(c => c.status !== 'Resolved' && c.daysOpened > 0);
    const criticalOverdue = overdueComplaints.filter(c => c.daysOpened >= 14);
    const highUrgencyOverdue = overdueComplaints.filter(c => c.daysOpened >= 7 && c.daysOpened < 14);
    const moderateOverdue = overdueComplaints.filter(c => c.daysOpened >= 3 && c.daysOpened < 7);
    
    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;
      
    const avgResolutionTime = resolvedComplaints > 0 
      ? Math.round(complaints.filter(c => c.status === 'Resolved')
          .reduce((sum, c) => sum + c.daysOpened, 0) / resolvedComplaints)
      : 0;

    const recentComplaints = [...complaints]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5);

    return {
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      escalatedComplaints,
      overdueComplaints,
      criticalOverdue: criticalOverdue.length,
      highUrgencyOverdue: highUrgencyOverdue.length,
      moderateOverdue: moderateOverdue.length,
      resolutionRate,
      avgResolutionTime,
      recentComplaints
    };
  }, [complaints]);

  return stats;
}
