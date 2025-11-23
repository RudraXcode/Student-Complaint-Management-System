import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Complaint, AppView } from '../App';
import { UniversityInfo } from './UniversityInfo';
import { 
  GraduationCap, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  LogOut,
  Bell,
  Building,
  MapPin,
  Flag,
  X
} from 'lucide-react';
import { getStatusBadgeClass } from '../utils/helpers';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface StudentDashboardProps {
  user: User;
  complaints: Complaint[];
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

export function StudentDashboard({ user, complaints, onNavigate, onLogout }: StudentDashboardProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const statusCounts = {
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
  };

  const recentComplaints = complaints
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 3);

  const urgentCount = complaints.filter(c => c.daysOpened > 7 && c.status !== 'Resolved').length;
  
  const urgentComplaints = complaints.filter(c => c.daysOpened > 7 && c.status !== 'Resolved');
  
  const recentUpdates = complaints
    .filter(c => c.comments && c.comments.length > 0)
    .sort((a, b) => {
      const aLastComment = a.comments?.[a.comments.length - 1];
      const bLastComment = b.comments?.[b.comments.length - 1];
      return new Date(bLastComment?.date || a.lastUpdated).getTime() - 
             new Date(aLastComment?.date || b.lastUpdated).getTime();
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center group">
                <div className="p-2 bg-gradient-to-br from-[#2F5DCE] to-[#4F46E5] rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  SCMS
                </span>
                <Flag className="h-4 w-4 text-orange-500 ml-2 animate-pulse" title="Supporting Indian Universities" />
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-2">
                  <Button variant="ghost" className="text-[#2F5DCE] font-medium hover:bg-blue-50 transition-all duration-300">Home</Button>
                  <Button variant="ghost" className="hover:bg-blue-50 transition-all duration-300" onClick={() => onNavigate('complaint-tracker')}>
                    My Complaints
                  </Button>
                  <Button variant="ghost" className="hover:bg-blue-50 transition-all duration-300" onClick={() => onNavigate('new-complaint')}>
                    New Complaint
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-blue-50 transition-all duration-300">
                    <Bell className="h-5 w-5" />
                    {urgentCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse shadow-lg">
                        {urgentCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Notifications</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setNotificationsOpen(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {urgentCount > 0 && (
                      <p className="text-sm text-orange-700 mt-1 font-medium">
                        {urgentCount} urgent complaint{urgentCount > 1 ? 's' : ''} need{urgentCount === 1 ? 's' : ''} attention
                      </p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {urgentCount > 0 ? (
                      <div className="divide-y">
                        {urgentComplaints.map((complaint) => (
                          <div 
                            key={complaint.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setNotificationsOpen(false);
                              onNavigate('complaint-details', complaint);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{complaint.id}</span>
                                  <Badge variant="outline" className="text-xs">{complaint.category}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 truncate mb-1">
                                  {complaint.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-orange-600">
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
                        <p className="font-medium">No urgent notifications</p>
                        <p className="text-sm mt-1">You're all caught up! 🎉</p>
                      </div>
                    )}
                  </div>
                  {recentUpdates.length > 0 && (
                    <>
                      <div className="border-t bg-gray-50 px-4 py-2">
                        <h4 className="text-sm font-semibold text-gray-700">Recent Updates</h4>
                      </div>
                      <div className="divide-y max-h-48 overflow-y-auto">
                        {recentUpdates.map((complaint) => (
                          <div 
                            key={complaint.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                            onClick={() => {
                              setNotificationsOpen(false);
                              onNavigate('complaint-details', complaint);
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{complaint.id}</span>
                              <Badge className={getStatusBadgeClass(complaint.status)} size="sm">
                                {complaint.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {complaint.comments?.[complaint.comments.length - 1]?.text || 'Status updated'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
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
                {user.rollNumber && (
                  <div className="text-xs text-gray-500">Roll: {user.rollNumber}</div>
                )}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-in-up">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 shadow-soft border border-blue-100">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#2F5DCE] via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Namaste, {user.name.split(' ')[0]} 🙏
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Building className="h-5 w-5 text-[#2F5DCE]" />
                <span className="font-medium">{user.university}</span>
              </div>
              <UniversityInfo university={user.university} />
            </div>
            <p className="text-gray-700 mt-3 text-lg">
              Here's an overview of your complaints and recent activity. 📊
            </p>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-orange-400 bg-gradient-to-br from-white to-orange-50/30 animate-slide-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-4 w-4 text-[#FF8C00]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">{statusCounts.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-cyan-400 bg-gradient-to-br from-white to-cyan-50/30 animate-slide-in-up animation-delay-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="p-2 bg-cyan-100 rounded-lg">
                <FileText className="h-4 w-4 text-[#17A2B8]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">{statusCounts.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">Being processed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-green-400 bg-gradient-to-br from-white to-green-50/30 animate-slide-in-up animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-[#28A745]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">{statusCounts.resolved}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-red-400 bg-gradient-to-br from-white to-red-50/30 animate-slide-in-up animation-delay-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-[#DC3545]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">{statusCounts.escalated}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Complaints</CardTitle>
              <CardDescription>Your latest complaint submissions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentComplaints.length > 0 ? (
                <div className="space-y-4">
                  {recentComplaints.map((complaint, index) => (
                    <div key={complaint.id} className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-300 border border-gray-100 animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium">{complaint.id}</span>
                          <Badge variant="outline">{complaint.category}</Badge>
                          <Badge className={getStatusBadgeClass(complaint.status)}>
                            {complaint.status}
                          </Badge>
                          {complaint.daysOpened > 7 && complaint.status !== 'Resolved' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 break-words">{complaint.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                          <span className="whitespace-nowrap">Updated: {complaint.lastUpdated}</span>
                          {complaint.attachments && complaint.attachments.length > 0 && (
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <FileText className="h-3 w-3" />
                              {complaint.attachments.length} attachment{complaint.attachments.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => onNavigate('complaint-details', complaint)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No complaints submitted yet</p>
                  <Button 
                    className="mt-4 bg-[#2F5DCE] hover:bg-[#2548a8]"
                    onClick={() => onNavigate('new-complaint')}
                  >
                    Submit Your First Complaint
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in animation-delay-200">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA] shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                onClick={() => onNavigate('new-complaint')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit New Complaint
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-2 hover:border-[#2F5DCE] hover:bg-blue-50 hover:scale-[1.02] transition-all duration-300"
                onClick={() => onNavigate('complaint-tracker')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Track My Complaints
              </Button>
              <Button variant="outline" className="w-full justify-start border-2 hover:border-[#2F5DCE] hover:bg-blue-50 hover:scale-[1.02] transition-all duration-300">
                <Bell className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
              
              {urgentCount > 0 && (
                <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 shadow-colored-orange animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-900">
                          {urgentCount} Urgent Complaint{urgentCount > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-orange-700">
                          Open for more than 7 days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Announcements - Indian Context */}
        <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in animation-delay-500">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>System Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border-l-4 border-blue-400 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-x-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">🇮🇳 New Feature: Complete Indian University Support</p>
                <p className="text-sm text-blue-700">SCMS now supports 500+ Indian universities including all IITs, IIMs, NITs, Central, State, and Private universities for better institutional integration.</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 border-l-4 border-green-400 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-x-1">
                <p className="text-sm font-semibold text-green-900 mb-1">Enhanced File Upload with Multi-language Support</p>
                <p className="text-sm text-green-700">Upload documents in multiple formats with preview capabilities. Now supports documents in regional languages.</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border-l-4 border-purple-400 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-x-1">
                <p className="text-sm font-semibold text-purple-900 mb-1">University Integration Complete</p>
                <p className="text-sm text-purple-700">Your complaints are now properly categorized under {user.university} with institution-specific resolution workflows.</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border-l-4 border-amber-400 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-x-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">Improved Response Times</p>
                <p className="text-sm text-amber-700">Average resolution time has improved by 35% with our AI-powered complaint routing and priority management system.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}