import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Complaint, AppView, AttachmentFile } from '../App';
import { DEPARTMENTS, DEPARTMENT_COLORS } from '../utils/constants';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  LogOut,
  Building,
  MessageCircle,
  Send,
  Eye,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Bell,
  X,
  Flag
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface DepartmentDashboardProps {
  user: User;
  complaints: Complaint[];
  allComplaints: Complaint[];
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onStatusUpdate: (complaintId: string, status: Complaint['status']) => void;
  onAddComment: (complaintId: string, message: string, attachments?: AttachmentFile[]) => void;
}

export function DepartmentDashboard({ 
  user, 
  complaints, 
  allComplaints,
  onNavigate, 
  onLogout, 
  onStatusUpdate,
  onAddComment 
}: DepartmentDashboardProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState<Complaint['status']>('Pending');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const department = user.department ? DEPARTMENTS[user.department as keyof typeof DEPARTMENTS] : null;
  const departmentColor = user.department ? DEPARTMENT_COLORS[user.department as keyof typeof DEPARTMENT_COLORS] : 'bg-gray-100 text-gray-800';

  // Calculate department metrics
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const overdueComplaints = complaints.filter(c => c.status !== 'Resolved' && c.daysOpened > 7).length;
  
  const urgentComplaints = complaints.filter(c => c.status !== 'Resolved' && c.daysOpened > 7);
  
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  const avgResolutionTime = resolvedComplaints > 0 
    ? Math.round(complaints.filter(c => c.status === 'Resolved').reduce((sum, c) => sum + c.daysOpened, 0) / resolvedComplaints)
    : 0;

  const recentComplaints = complaints
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 8);

  const handleStatusUpdate = (complaintId: string, status: Complaint['status']) => {
    onStatusUpdate(complaintId, status);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint({...selectedComplaint, status});
    }
  };

  const handleAddComment = () => {
    if (!selectedComplaint || !newComment.trim()) return;
    
    onAddComment(selectedComplaint.id, newComment);
    setNewComment('');
    
    // Update local selectedComplaint to show new comment immediately
    const newCommentObj = {
      id: `C${Date.now()}`,
      author: user.name,
      message: newComment,
      timestamp: new Date().toISOString(),
      role: user.role as 'department-head'
    };
    
    setSelectedComplaint({
      ...selectedComplaint,
      comments: [...selectedComplaint.comments, newCommentObj]
    });
  };

  if (!department) {
    return <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Department Not Found</h1>
        <p className="text-red-500">Unable to load department information.</p>
        <Button onClick={onLogout} className="mt-4">Return to Login</Button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center group">
                <div className="p-2 bg-gradient-to-br from-[#2F5DCE] to-[#4F46E5] rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  SCMS
                </span>
                <Flag className="h-4 w-4 text-orange-500 ml-2 animate-pulse" title="Supporting Indian Universities" />
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-2">
                  <Button variant="ghost" className="text-[#2F5DCE] font-medium hover:bg-blue-50 transition-all duration-300">Home</Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-blue-50 transition-all duration-300">
                    <Bell className="h-5 w-5" />
                    {overdueComplaints > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse shadow-lg">
                        {overdueComplaints}
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
                    {overdueComplaints > 0 && (
                      <p className="text-sm text-orange-700 mt-1 font-medium">
                        {overdueComplaints} overdue complaint{overdueComplaints > 1 ? 's' : ''} require attention
                      </p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {urgentComplaints.length > 0 ? (
                      <div className="divide-y">
                        {urgentComplaints.map((complaint) => (
                          <div 
                            key={complaint.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setNotificationsOpen(false);
                              setSelectedComplaint(complaint);
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
                        <p className="text-sm mt-1">All clear! ✅</p>
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
                <div className="text-xs text-gray-500">{department?.name}</div>
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Department Management Portal
          </h1>
          <p className="text-xl text-gray-600 flex items-center gap-3">
            <Building className="h-5 w-5" />
            {department.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Contact:</span>
              <a href={`mailto:${department.email}`} className="text-blue-600 hover:underline">{department.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Phone:</span>
              <a href={`tel:${department.phone}`} className="text-blue-600 hover:underline">{department.phone}</a>
            </div>
          </div>
        </div>

        {/* Department Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90">Total Assigned</CardTitle>
                <div className="text-3xl font-bold mt-2">{totalComplaints}</div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Complaints under your department</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90">Pending Action</CardTitle>
                <div className="text-3xl font-bold mt-2">{pendingComplaints + inProgressComplaints}</div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90">Resolution Rate</CardTitle>
                <div className="text-3xl font-bold mt-2">{resolutionRate}%</div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Award className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">{resolvedComplaints} of {totalComplaints} resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90">Avg Resolution</CardTitle>
                <div className="text-3xl font-bold mt-2">{avgResolutionTime}d</div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Target className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Average days to resolve</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Complaints List */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <FileText className="h-5 w-5 text-blue-600" />
                  Assigned Complaints
                </CardTitle>
                <CardDescription className="text-base">Manage complaints assigned to your department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentComplaints.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No complaints assigned to your department yet.</p>
                    </div>
                  ) : (
                    recentComplaints.map((complaint) => (
                      <div 
                        key={complaint.id} 
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border
                          ${complaint.daysOpened >= 14 ? 'bg-gradient-to-r from-red-100 to-red-200 border-red-300' : 
                            complaint.daysOpened >= 7 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300' :
                            'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'}
                        `}
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
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
                            {complaint.daysOpened >= 14 && (
                              <Badge className="bg-red-600 text-white animate-pulse">🔥 URGENT</Badge>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <p className="text-gray-700 truncate font-medium mb-2">{complaint.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {complaint.studentName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {complaint.dateSubmitted}
                          </span>
                          <span className={`font-bold ${complaint.daysOpened > 7 ? 'text-red-600' : 'text-gray-600'}`}>
                            {complaint.daysOpened} days old
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complaint Details/Actions Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  {selectedComplaint ? 'Complaint Details' : 'Select a Complaint'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComplaint ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-semibold text-blue-900 mb-1">{selectedComplaint.id}</h4>
                        <p className="text-blue-700 text-sm">{selectedComplaint.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Priority:</span>
                        <Badge className={
                          selectedComplaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                          selectedComplaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {selectedComplaint.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Student:</span>
                        <span className="text-sm">{selectedComplaint.studentName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Days Open:</span>
                        <span className={`text-sm font-bold ${selectedComplaint.daysOpened > 7 ? 'text-red-600' : 'text-gray-600'}`}>
                          {selectedComplaint.daysOpened} days
                        </span>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="space-y-3">
                      <h5 className="font-semibold">Update Status</h5>
                      <div className="flex gap-2">
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Complaint['status'])}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Escalated">Escalated</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={() => handleStatusUpdate(selectedComplaint.id, newStatus)}
                          className="bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA]"
                        >
                          Update
                        </Button>
                      </div>
                    </div>

                    {/* Add Comment */}
                    <div className="space-y-3">
                      <h5 className="font-semibold">Add Response</h5>
                      <Textarea
                        placeholder="Type your response to the student..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </div>

                    {/* Comments History */}
                    {selectedComplaint.comments.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-semibold">Recent Communications</h5>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {selectedComplaint.comments.slice(-3).map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{comment.author}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                                {comment.role && (
                                  <Badge variant="outline" className="text-xs">
                                    {comment.role === 'department-head' ? 'Dept' : comment.role}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-700">{comment.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => onNavigate('complaint-details', selectedComplaint)}
                      variant="outline"
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Details
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a complaint from the list to view details and take action.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}