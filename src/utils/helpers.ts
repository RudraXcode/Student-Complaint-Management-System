import { Complaint } from '../App';

// Status badge styling helper
export const getStatusBadgeClass = (status: Complaint['status']): string => {
  switch (status) {
    case 'Pending':
      return 'bg-[#FF8C00] text-white';
    case 'In Progress':
      return 'bg-[#17A2B8] text-white';
    case 'Resolved':
      return 'bg-[#28A745] text-white';
    case 'Escalated':
      return 'bg-[#DC3545] text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Priority color helper
export const getPriorityColor = (priority: Complaint['priority']): string => {
  switch (priority) {
    case 'High':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Format date helper
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format date with time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate days between dates
export const calculateDaysBetween = (startDate: string, endDate?: string): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get urgency level based on days opened
export const getUrgencyLevel = (daysOpened: number, status: Complaint['status']): {
  level: 'normal' | 'moderate' | 'high' | 'critical' | 'extreme';
  color: string;
  label: string;
} => {
  if (status === 'Resolved') {
    return { level: 'normal', color: 'text-green-600', label: 'Resolved' };
  }

  if (daysOpened >= 30) {
    return { level: 'extreme', color: 'text-black animate-bounce', label: 'Extreme' };
  } else if (daysOpened >= 14) {
    return { level: 'critical', color: 'text-red-600 animate-pulse', label: 'Critical' };
  } else if (daysOpened >= 7) {
    return { level: 'high', color: 'text-orange-600', label: 'High' };
  } else if (daysOpened >= 3) {
    return { level: 'moderate', color: 'text-yellow-600', label: 'Moderate' };
  }
  
  return { level: 'normal', color: 'text-gray-600', label: 'Normal' };
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate complaint ID
export const generateComplaintId = (count: number): string => {
  return `COMP-${String(count + 1).padStart(3, '0')}`;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate Indian mobile number
export const isValidIndianMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\D/g, ''));
};

// Generate a random ID
export const generateId = (prefix: string = 'ID'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get escalation level text
export const getEscalationLevelText = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1:
      return 'Faculty Level';
    case 2:
      return 'HOD Level';
    case 3:
      return 'Dean Level';
    default:
      return 'Unknown Level';
  }
};

// Filter complaints by various criteria
export const filterComplaints = (
  complaints: Complaint[],
  filters: {
    status?: Complaint['status'];
    category?: Complaint['category'];
    priority?: Complaint['priority'];
    university?: string;
    dateRange?: { start: string; end: string };
    searchTerm?: string;
  }
): Complaint[] => {
  return complaints.filter(complaint => {
    // Status filter
    if (filters.status && complaint.status !== filters.status) {
      return false;
    }

    // Category filter
    if (filters.category && complaint.category !== filters.category) {
      return false;
    }

    // Priority filter
    if (filters.priority && complaint.priority !== filters.priority) {
      return false;
    }

    // University filter
    if (filters.university && complaint.university !== filters.university) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const complaintDate = new Date(complaint.dateSubmitted);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (complaintDate < startDate || complaintDate > endDate) {
        return false;
      }
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchableText = [
        complaint.id,
        complaint.studentName,
        complaint.description,
        complaint.category,
        complaint.university
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
};

// Sort complaints by various criteria
export const sortComplaints = (
  complaints: Complaint[],
  sortBy: 'date' | 'urgency' | 'status' | 'priority',
  order: 'asc' | 'desc' = 'desc'
): Complaint[] => {
  const sorted = [...complaints];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime();
        break;
      case 'urgency':
        // Sort by days opened, with resolved items last
        if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
        if (b.status === 'Resolved' && a.status !== 'Resolved') return -1;
        comparison = a.daysOpened - b.daysOpened;
        break;
      case 'status':
        const statusOrder = { 'Escalated': 4, 'Pending': 3, 'In Progress': 2, 'Resolved': 1 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
};

// Get complaint statistics
export const getComplaintStatistics = (complaints: Complaint[]) => {
  const total = complaints.length;
  const byStatus = {
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
  };
  
  const byPriority = {
    high: complaints.filter(c => c.priority === 'High').length,
    medium: complaints.filter(c => c.priority === 'Medium').length,
    low: complaints.filter(c => c.priority === 'Low').length,
  };
  
  const byCategory = complaints.reduce((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const resolutionRate = total > 0 ? Math.round((byStatus.resolved / total) * 100) : 0;
  
  const avgResolutionTime = byStatus.resolved > 0 
    ? Math.round(
        complaints
          .filter(c => c.status === 'Resolved')
          .reduce((sum, c) => sum + c.daysOpened, 0) / byStatus.resolved
      )
    : 0;
  
  const overdue = complaints.filter(c => c.status !== 'Resolved' && c.daysOpened > 7).length;
  const critical = complaints.filter(c => c.status !== 'Resolved' && c.daysOpened >= 14).length;
  
  return {
    total,
    byStatus,
    byPriority,
    byCategory,
    resolutionRate,
    avgResolutionTime,
    overdue,
    critical
  };
};

// Calculate comprehensive metrics for reports - MISSING FUNCTION
export const calculateMetrics = (complaints: Complaint[]) => {
  const stats = getComplaintStatistics(complaints);
  
  // Calculate additional metrics
  const totalResponseTime = complaints
    .filter(c => c.status !== 'Pending')
    .reduce((sum, c) => sum + Math.min(c.daysOpened, 1), 0); // Assume response within 1 day
  
  const avgResponseTime = complaints.filter(c => c.status !== 'Pending').length > 0
    ? totalResponseTime / complaints.filter(c => c.status !== 'Pending').length
    : 0;

  // Calculate university-wise metrics
  const universityMetrics = complaints.reduce((acc, complaint) => {
    const uni = complaint.university;
    if (!acc[uni]) {
      acc[uni] = {
        total: 0,
        resolved: 0,
        pending: 0,
        escalated: 0,
        avgResolutionTime: 0
      };
    }
    
    acc[uni].total += 1;
    
    switch (complaint.status) {
      case 'Resolved':
        acc[uni].resolved += 1;
        break;
      case 'Pending':
      case 'In Progress':
        acc[uni].pending += 1;
        break;
      case 'Escalated':
        acc[uni].escalated += 1;
        break;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate resolution rate for each university
  Object.keys(universityMetrics).forEach(uni => {
    const uniData = universityMetrics[uni];
    uniData.resolutionRate = uniData.total > 0 ? Math.round((uniData.resolved / uniData.total) * 100) : 0;
    
    const resolvedComplaints = complaints.filter(c => c.university === uni && c.status === 'Resolved');
    uniData.avgResolutionTime = resolvedComplaints.length > 0
      ? Math.round(resolvedComplaints.reduce((sum, c) => sum + c.daysOpened, 0) / resolvedComplaints.length)
      : 0;
  });

  // Performance trends (last 6 months)
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const monthComplaints = complaints.filter(c => {
      const complaintDate = new Date(c.dateSubmitted);
      const complaintMonth = `${complaintDate.getFullYear()}-${String(complaintDate.getMonth() + 1).padStart(2, '0')}`;
      return complaintMonth === monthKey;
    });
    
    last6Months.push({
      month: monthName,
      submitted: monthComplaints.length,
      resolved: monthComplaints.filter(c => c.status === 'Resolved').length,
      resolutionRate: monthComplaints.length > 0 
        ? Math.round((monthComplaints.filter(c => c.status === 'Resolved').length / monthComplaints.length) * 100)
        : 0
    });
  }

  return {
    ...stats,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10,
    universityMetrics,
    performanceTrends: last6Months,
    efficiency: {
      onTime: complaints.filter(c => c.status === 'Resolved' && c.daysOpened <= 7).length,
      delayed: complaints.filter(c => c.status === 'Resolved' && c.daysOpened > 7).length,
      escalationRate: stats.total > 0 ? Math.round((stats.escalated / stats.total) * 100) : 0
    }
  };
};

// Get category data for charts - MISSING FUNCTION
export const getCategoryData = (complaints: Complaint[]) => {
  const categoryStats = complaints.reduce((acc, complaint) => {
    const category = complaint.category;
    
    if (!acc[category]) {
      acc[category] = {
        name: category,
        total: 0,
        resolved: 0,
        pending: 0,
        escalated: 0,
        avgResolutionTime: 0
      };
    }
    
    acc[category].total += 1;
    
    switch (complaint.status) {
      case 'Resolved':
        acc[category].resolved += 1;
        break;
      case 'Pending':
      case 'In Progress':
        acc[category].pending += 1;
        break;
      case 'Escalated':
        acc[category].escalated += 1;
        break;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate resolution rates and average resolution times
  Object.keys(categoryStats).forEach(category => {
    const catData = categoryStats[category];
    catData.resolutionRate = catData.total > 0 ? Math.round((catData.resolved / catData.total) * 100) : 0;
    
    const resolvedInCategory = complaints.filter(c => c.category === category && c.status === 'Resolved');
    catData.avgResolutionTime = resolvedInCategory.length > 0
      ? Math.round(resolvedInCategory.reduce((sum, c) => sum + c.daysOpened, 0) / resolvedInCategory.length)
      : 0;
  });

  return Object.values(categoryStats);
};

// Get trend data for charts - MISSING FUNCTION
export const getTrendData = (complaints: Complaint[], months: number = 12) => {
  const trendData = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const monthComplaints = complaints.filter(c => {
      const complaintDate = new Date(c.dateSubmitted);
      const complaintMonth = `${complaintDate.getFullYear()}-${String(complaintDate.getMonth() + 1).padStart(2, '0')}`;
      return complaintMonth === monthKey;
    });
    
    const resolved = monthComplaints.filter(c => c.status === 'Resolved');
    const pending = monthComplaints.filter(c => c.status === 'Pending' || c.status === 'In Progress');
    const escalated = monthComplaints.filter(c => c.status === 'Escalated');
    
    trendData.push({
      month: monthName,
      monthKey,
      submitted: monthComplaints.length,
      resolved: resolved.length,
      pending: pending.length,
      escalated: escalated.length,
      resolutionRate: monthComplaints.length > 0 
        ? Math.round((resolved.length / monthComplaints.length) * 100)
        : 0,
      avgResolutionTime: resolved.length > 0
        ? Math.round(resolved.reduce((sum, c) => sum + c.daysOpened, 0) / resolved.length)
        : 0
    });
  }
  
  return trendData;
};

// Get university comparison data
export const getUniversityComparisonData = (complaints: Complaint[]) => {
  const universities = [...new Set(complaints.map(c => c.university))];
  
  return universities.map(university => {
    const uniComplaints = complaints.filter(c => c.university === university);
    const resolved = uniComplaints.filter(c => c.status === 'Resolved');
    const pending = uniComplaints.filter(c => c.status === 'Pending' || c.status === 'In Progress');
    const escalated = uniComplaints.filter(c => c.status === 'Escalated');
    
    return {
      university: university.length > 30 ? university.substring(0, 30) + "..." : university,
      fullName: university,
      total: uniComplaints.length,
      resolved: resolved.length,
      pending: pending.length,
      escalated: escalated.length,
      resolutionRate: uniComplaints.length > 0 
        ? Math.round((resolved.length / uniComplaints.length) * 100)
        : 0,
      avgResolutionTime: resolved.length > 0
        ? Math.round(resolved.reduce((sum, c) => sum + c.daysOpened, 0) / resolved.length)
        : 0,
      criticalCount: uniComplaints.filter(c => c.status !== 'Resolved' && c.daysOpened >= 14).length
    };
  }).sort((a, b) => b.total - a.total);
};

// Get priority analysis data
export const getPriorityAnalysisData = (complaints: Complaint[]) => {
  const priorities: Array<Complaint['priority']> = ['High', 'Medium', 'Low'];
  
  return priorities.map(priority => {
    const priorityComplaints = complaints.filter(c => c.priority === priority);
    const resolved = priorityComplaints.filter(c => c.status === 'Resolved');
    const overdue = priorityComplaints.filter(c => c.status !== 'Resolved' && c.daysOpened > 7);
    
    return {
      priority,
      total: priorityComplaints.length,
      resolved: resolved.length,
      overdue: overdue.length,
      resolutionRate: priorityComplaints.length > 0 
        ? Math.round((resolved.length / priorityComplaints.length) * 100)
        : 0,
      avgResolutionTime: resolved.length > 0
        ? Math.round(resolved.reduce((sum, c) => sum + c.daysOpened, 0) / resolved.length)
        : 0
    };
  });
};