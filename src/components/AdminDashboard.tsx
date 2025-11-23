import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Complaint, AppView } from '../App';
import { AdminReminderSystem } from './AdminReminderSystem';
import { useAdminStats } from '../hooks/useAdminStats';
import { AdminStatsCards } from './admin/AdminStatsCards';
import { 
  Shield, 
  FileText, 
  Clock, 
  AlertTriangle, 
  BarChart3,
  LogOut,
  Bell,
  Building,
  Activity,
  Target,
  Settings,
  User as UserIcon,
  Award,
  X,
  Flag
} from 'lucide-react';
import { CategoryChart } from './charts/CategoryChart';
import { TrendChart } from './charts/TrendChart';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface AdminDashboardProps {
  user: User;
  complaints: Complaint[];
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

export function AdminDashboard({ user, complaints, onNavigate, onLogout }: AdminDashboardProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const stats = useAdminStats(complaints);
  const {
    totalComplaints,
    pendingComplaints,
    inProgressComplaints,
    resolvedComplaints,
    escalatedComplaints,
    overdueComplaints,
    criticalOverdue,
    highUrgencyOverdue,
    moderateOverdue,
    resolutionRate,
    avgResolutionTime,
    recentComplaints
  } = stats;

  const getUrgencyBadge = (daysOpened: number, status: string) => {
    if (status === 'Resolved') return null;
    
    if (daysOpened >= 30) {
      return <Badge className="bg-black text-white animate-bounce ml-2 shadow-lg">💀 CRITICAL</Badge>;
    } else if (daysOpened >= 14) {
      return <Badge className="bg-red-600 text-white animate-pulse ml-2 shadow-lg">🔥 URGENT</Badge>;
    } else if (daysOpened >= 7) {
      return <Badge className="bg-orange-500 text-white ml-2 shadow-md">⚠️ OVERDUE</Badge>;
    } else if (daysOpened >= 3) {
      return <Badge className="bg-yellow-500 text-white ml-2 shadow-md">⏰ ATTENTION</Badge>;
    }
    return null;
  };

  const getStatusCardStyle = (count: number, type: 'critical' | 'high' | 'moderate' | 'normal' | 'success') => {
    const baseStyle = "hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0";
    
    switch (type) {
      case 'critical':
        return count > 0 ? `${baseStyle} bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-red-200 animate-pulse` : `${baseStyle} bg-white shadow-lg`;
      case 'high':
        return count > 0 ? `${baseStyle} bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-orange-200` : `${baseStyle} bg-white shadow-lg`;
      case 'moderate':
        return count > 0 ? `${baseStyle} bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 text-white shadow-yellow-200` : `${baseStyle} bg-white shadow-lg`;
      case 'success':
        return `${baseStyle} bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white shadow-green-200`;
      default:
        return `${baseStyle} bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-200`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center group">
                <div className="p-2 bg-gradient-to-br from-[#2F5DCE] to-[#4F46E5] rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  SCMS
                </span>
                <Flag className="h-4 w-4 text-orange-500 ml-2 animate-pulse" title="Supporting Indian Universities" />
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-2">
                  <Button variant="ghost" className="text-[#2F5DCE] font-medium hover:bg-blue-50 transition-all duration-300">Home</Button>
                  <Button variant="ghost" className="hover:bg-blue-50 transition-all duration-300" onClick={() => onNavigate('admin-complaints')}>
                    All Complaints
                  </Button>
                  <Button variant="ghost" className="hover:bg-blue-50 transition-all duration-300" onClick={() => onNavigate('escalations')}>
                    Escalations
                  </Button>
                  <Button variant="ghost" className="hover:bg-blue-50 transition-all duration-300" onClick={() => onNavigate('reports')}>
                    Reports
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-blue-50 transition-all duration-300">
                    <Bell className="h-5 w-5" />
                    {criticalOverdue.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse shadow-lg">
                        {criticalOverdue.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Critical Alerts</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setNotificationsOpen(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {criticalOverdue.length > 0 && (
                      <p className="text-sm text-red-700 mt-1 font-medium">
                        {criticalOverdue.length} critical complaint{criticalOverdue.length > 1 ? 's' : ''} require immediate attention
                      </p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {criticalOverdue.length > 0 ? (
                      <div className="divide-y">
                        {criticalOverdue.map((complaint) => (
                          <div 
                            key={complaint.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setNotificationsOpen(false);
                              onNavigate('admin-complaints');
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{complaint.id}</span>
                                  <Badge variant="outline" className="text-xs">{complaint.category}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 truncate mb-1">
                                  {complaint.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-red-600">
                                  <Clock className="h-3 w-3" />
                                  <span>Open for {complaint.daysOpened} days</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No critical alerts</p>
                        <p className="text-sm mt-1">System running smoothly! ✅</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="text-sm text-right bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg">
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-gray-600 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span className="truncate max-w-40" title={user.university}>
                    {user.university.length > 25 ? user.university.substring(0, 25) + "..." : user.university}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} className="border-2 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Administrative Dashboard
              </h1>
              <p className="text-xl text-gray-600 flex items-center gap-3">
                <Building className="h-5 w-5" />
                {user.university} • Comprehensive Complaint Management System
                {criticalOverdue.length > 0 && (
                  <Badge className="bg-red-600 text-white animate-pulse ml-2 px-3 py-1 shadow-lg">
                    🚨 {criticalOverdue.length} Critical Issues Require Attention!
                  </Badge>
                )}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  Performance Score
                </div>
                <div className={`text-2xl font-bold ${resolutionRate >= 80 ? 'text-green-600' : resolutionRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {resolutionRate}%
                </div>
              </div>
              <Button className="bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA] shadow-lg">
                <Settings className="w-4 h-4 mr-2" />
                Quick Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Reminder System - Always at top when there are overdue complaints */}
        {overdueComplaints.length > 0 && (
          <div className="mb-10">
            <AdminReminderSystem 
              complaints={complaints} 
              onComplaintSelect={(complaint) => onNavigate('complaint-details', complaint)}
            />
          </div>
        )}

        {/* Enhanced Status Cards */}
        <AdminStatsCards 
          stats={{
            totalComplaints,
            criticalOverdue,
            highUrgencyOverdue,
            resolvedComplaints,
            resolutionRate
          }}
          onNavigate={() => onNavigate('admin-complaints')}
        />

        {/* Enhanced Alert for Poor Performance */}
        {(resolutionRate < 70 || criticalOverdue > 3) && (
          <Card className="border-0 bg-gradient-to-r from-red-500 to-red-600 text-white mb-10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                🚨 SYSTEM PERFORMANCE ALERT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-white/90">
                {resolutionRate < 70 && (
                  <p className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Resolution rate ({resolutionRate}%) is critically below acceptable threshold (70%)
                  </p>
                )}
                {criticalOverdue.length > 3 && (
                  <p className="flex items-center gap-2">
                    <Skull className="h-5 w-5" />
                    Too many critical complaints ({criticalOverdue.length}) are severely overdue
                  </p>
                )}
                {avgResolutionTime > 10 && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Average resolution time ({avgResolutionTime} days) exceeds acceptable limits
                  </p>
                )}
                <div className="bg-white/20 rounded-lg p-4 mt-4">
                  <p className="font-bold text-lg">⚡ IMMEDIATE ADMINISTRATIVE ACTION REQUIRED!</p>
                  <p className="text-sm">System performance is significantly impacting service quality and student satisfaction.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Enhanced Recent Complaints */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Recent Complaints
              </CardTitle>
              <CardDescription className="text-base">Latest submissions requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div 
                    key={complaint.id} 
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1
                      ${complaint.daysOpened >= 14 ? 'bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-300 animate-pulse' : 
                        complaint.daysOpened >= 7 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300' :
                        complaint.daysOpened >= 3 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300' : 'bg-gradient-to-r from-gray-50 to-gray-100'}
                    `}
                    onClick={() => onNavigate('complaint-details', complaint)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-bold text-lg">{complaint.id}</span>
                        <Badge variant="outline" className="bg-white/80">{complaint.category}</Badge>
                        <Badge className={
                          complaint.status === 'Pending' ? 'bg-[#FF8C00] text-white shadow-md' :
                          complaint.status === 'In Progress' ? 'bg-[#17A2B8] text-white shadow-md' :
                          complaint.status === 'Resolved' ? 'bg-[#28A745] text-white shadow-md' :
                          'bg-[#DC3545] text-white shadow-md'
                        }>
                          {complaint.status}
                        </Badge>
                        {getUrgencyBadge(complaint.daysOpened, complaint.status)}
                      </div>
                      <p className="text-gray-700 truncate font-medium">{complaint.description}</p>
                      <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          {complaint.studentName}
                        </span>
                        <span>Updated: {complaint.lastUpdated}</span>
                        <span className={`font-bold ${complaint.daysOpened > 7 ? 'text-red-600' : 'text-gray-600'}`}>
                          {complaint.daysOpened} days old
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`ml-4 ${complaint.daysOpened >= 14 ? 'border-red-500 text-red-700 bg-red-50 animate-pulse font-bold' : 'hover:bg-blue-50'} transition-all duration-300`}
                    >
                      {complaint.daysOpened >= 14 ? '🚨 URGENT' : 'View Details'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Administrative Actions
              </CardTitle>
              <CardDescription className="text-base">Essential management tools and metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                className={`w-full justify-start h-12 ${criticalOverdue.length > 0 ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse shadow-xl' : 'bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA] shadow-lg'} transition-all duration-300`}
                onClick={() => onNavigate('admin-complaints')}
              >
                <FileText className="h-5 w-5 mr-3" />
                {criticalOverdue.length > 0 ? `🚨 Review ${criticalOverdue.length} Critical Complaints` : 'Manage All Complaints'}
              </Button>
              
              <Button 
                variant="outline" 
                className={`w-full justify-start h-12 border-2 ${escalatedComplaints > 0 ? 'border-orange-500 text-orange-700 bg-orange-50 hover:bg-orange-100' : 'hover:border-[#2F5DCE] hover:bg-blue-50'} transition-all duration-300`}
                onClick={() => onNavigate('escalations')}
              >
                <AlertTriangle className="h-5 w-5 mr-3" />
                Handle Escalations {escalatedComplaints > 0 && `(${escalatedComplaints} Active)`}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 border-2 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
                onClick={() => onNavigate('reports')}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Generate Performance Reports
              </Button>

              {/* Enhanced Performance Metrics */}
              <div className="pt-6 space-y-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Key Performance Indicators</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">Avg Resolution</span>
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className={`text-xl font-bold ${avgResolutionTime > 10 ? 'text-red-600' : avgResolutionTime > 7 ? 'text-orange-600' : 'text-green-600'}`}>
                      {avgResolutionTime} days
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-700">Overdue</span>
                      <AlertTriangle className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className={`text-xl font-bold ${overdueComplaints.length > 5 ? 'text-red-600' : overdueComplaints.length > 2 ? 'text-orange-600' : 'text-green-600'}`}>
                      {overdueComplaints.length}
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Response Rate</span>
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-xl font-bold text-green-600">96%</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-700">Satisfaction</span>
                      <Award className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-xl font-bold text-yellow-600">4.2★</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-0 p-6">
            <CategoryChart complaints={complaints} />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-0 p-6">
            <TrendChart complaints={complaints} />
          </div>
        </div>
      </div>

      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}