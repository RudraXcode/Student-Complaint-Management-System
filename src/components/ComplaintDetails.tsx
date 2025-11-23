import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Complaint, User, AttachmentFile } from '../App';
import { DEPARTMENTS, DEPARTMENT_COLORS } from '../utils/constants';
import { sanitizeInput } from '../utils/security';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  FileText, 
  MessageCircle, 
  Download,
  Send,
  Building,
  Mail,
  Phone,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Tag
} from 'lucide-react';

interface ComplaintDetailsProps {
  complaint: Complaint;
  currentUser: User;
  onBack: () => void;
  onAddComment?: (complaintId: string, message: string, attachments?: AttachmentFile[]) => void;
}

export function ComplaintDetails({ complaint, currentUser, onBack, onAddComment }: ComplaintDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAddComments = currentUser.role === 'admin' || 
                        currentUser.role === 'department-head' || 
                        (currentUser.role === 'student' && currentUser.id === complaint.studentId);

  const department = complaint.assignedDepartment ? 
    DEPARTMENTS[complaint.assignedDepartment as keyof typeof DEPARTMENTS] : null;
  
  const departmentColor = complaint.assignedDepartment ? 
    DEPARTMENT_COLORS[complaint.assignedDepartment as keyof typeof DEPARTMENT_COLORS] : '';

  const handleAddComment = async () => {
    if (!newComment.trim() || !onAddComment) return;
    
    setIsSubmitting(true);
    try {
      // Sanitize comment to prevent XSS
      const sanitizedComment = sanitizeInput(newComment);
      onAddComment(complaint.id, sanitizedComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'In Progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Escalated':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getUrgencyBadge = (daysOpened: number, status: string) => {
    if (status === 'Resolved') return null;
    
    if (daysOpened >= 30) {
      return <Badge className="bg-black text-white animate-bounce">💀 CRITICAL</Badge>;
    } else if (daysOpened >= 14) {
      return <Badge className="bg-red-600 text-white animate-pulse">🔥 URGENT</Badge>;
    } else if (daysOpened >= 7) {
      return <Badge className="bg-orange-500 text-white">⚠️ OVERDUE</Badge>;
    } else if (daysOpened >= 3) {
      return <Badge className="bg-yellow-500 text-white">⏰ ATTENTION</Badge>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2 hover:bg-blue-50 transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent flex items-center gap-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <FileText className="h-8 w-8 text-blue-600" />
                {complaint.id}
                {getUrgencyBadge(complaint.daysOpened, complaint.status)}
              </h1>
              <p className="text-xl text-gray-600">Complaint Details & Communication</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Information */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5" />
                  Complaint Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Description</h3>
                  <p className="text-blue-800">{complaint.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <Badge variant="outline" className="w-full justify-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {complaint.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <Badge className={`w-full justify-center ${
                      complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={`w-full justify-center ${
                      complaint.status === 'Pending' ? 'bg-[#FF8C00] text-white' :
                      complaint.status === 'In Progress' ? 'bg-[#17A2B8] text-white' :
                      complaint.status === 'Resolved' ? 'bg-[#28A745] text-white' :
                      'bg-[#DC3545] text-white'
                    }`}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{complaint.status}</span>
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Days Open</label>
                    <div className={`text-center font-bold ${complaint.daysOpened > 7 ? 'text-red-600' : 'text-gray-600'}`}>
                      {complaint.daysOpened} days
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Submitted: {complaint.dateSubmitted}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Last Updated: {complaint.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Assignment */}
            {department && (
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building className="h-5 w-5" />
                    Assigned Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${departmentColor} text-sm px-3 py-1`}>
                        {department.name}
                      </Badge>
                      {complaint.departmentAssignedAt && (
                        <span className="text-xs text-gray-500">
                          Assigned: {new Date(complaint.departmentAssignedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Department Head: {department.head}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <a href={`mailto:${department.email}`} className="text-blue-600 hover:underline text-sm">
                          {department.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <a href={`tel:${department.phone}`} className="text-blue-600 hover:underline text-sm">
                          {department.phone}
                        </a>
                      </div>
                      {complaint.departmentAssignedBy && (
                        <div className="text-xs text-gray-600 mt-2 pt-2 border-t">
                          Assigned by: {complaint.departmentAssignedBy}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Download className="h-5 w-5" />
                    Attachments ({complaint.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {complaint.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageCircle className="h-5 w-5" />
                  Communication History ({complaint.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {complaint.comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No comments yet. Be the first to respond!</p>
                    </div>
                  ) : (
                    complaint.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{comment.author}</span>
                            </div>
                            {comment.role && (
                              <Badge variant="outline" className="text-xs">
                                {comment.role === 'department-head' ? 'Department Head' : 
                                 comment.role === 'admin' ? 'Administrator' : 'Student'}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                        {comment.attachments && comment.attachments.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {comment.attachments.map((file) => (
                              <Button key={file.id} variant="outline" size="sm" className="text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                {file.name}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                {canAddComments && onAddComment && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Add Response</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder={`Add a ${currentUser.role === 'student' ? 'response' : 'comment'} to this complaint...`}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isSubmitting}
                        className="bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA]"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Sending...' : 'Send Response'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Student Information */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="font-medium">{complaint.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student ID</label>
                  <p className="text-sm text-gray-700">{complaint.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">University</label>
                  <p className="text-sm text-gray-700">{complaint.university}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {currentUser.role === 'admin' && (
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Complaint
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Reassign Department
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate Issue
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Escalation Timeline */}
            {complaint.escalationLevel > 1 && (
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-red-600">Escalation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Current Level:</span> Level {complaint.escalationLevel}
                    </p>
                    <p className="text-sm text-red-600">
                      This complaint has been escalated due to unresolved status.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
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