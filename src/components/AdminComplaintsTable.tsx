import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Complaint, AppView } from '../App';
import { DEPARTMENTS, CATEGORY_TO_DEPARTMENT, DEPARTMENT_COLORS } from '../utils/constants';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  Mail,
  Phone,
  Send,
  UserCheck
} from 'lucide-react';

interface AdminComplaintsTableProps {
  complaints: Complaint[];
  onComplaintSelect: (complaint: Complaint) => void;
  onStatusUpdate: (complaintId: string, status: Complaint['status']) => void;
  onDepartmentAssign: (complaintId: string, departmentKey: string, departmentHead: string) => void;
  onBack: () => void;
}

export function AdminComplaintsTable({ 
  complaints, 
  onComplaintSelect, 
  onStatusUpdate, 
  onDepartmentAssign,
  onBack 
}: AdminComplaintsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Filter complaints based on search and filters
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    const matchesAssignment = assignmentFilter === 'all' || 
                            (assignmentFilter === 'assigned' && complaint.assignedDepartment) ||
                            (assignmentFilter === 'unassigned' && !complaint.assignedDepartment);

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesAssignment;
  });

  const getSuggestedDepartment = (category: string) => {
    return CATEGORY_TO_DEPARTMENT[category as keyof typeof CATEGORY_TO_DEPARTMENT] || 'general';
  };

  const handleAssignToDepartment = (departmentKey: string) => {
    if (!selectedComplaint) return;
    
    const department = DEPARTMENTS[departmentKey as keyof typeof DEPARTMENTS];
    onDepartmentAssign(selectedComplaint.id, departmentKey, department.head);
    setIsAssignDialogOpen(false);
    setSelectedComplaint(null);
  };

  const getUrgencyIndicator = (daysOpened: number, status: string) => {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2 hover:bg-blue-50 transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Complaints Management
              </h1>
              <p className="text-xl text-gray-600">Comprehensive complaint tracking and department assignment</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Academics">Academics</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Mess">Mess</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Complaints</SelectItem>
                    <SelectItem value="assigned">Assigned to Dept</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Complaints</p>
                    <p className="text-2xl font-bold">{filteredComplaints.length}</p>
                  </div>
                  <div className="text-3xl opacity-75">📋</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Unassigned</p>
                    <p className="text-2xl font-bold">{filteredComplaints.filter(c => !c.assignedDepartment).length}</p>
                  </div>
                  <div className="text-3xl opacity-75">⚠️</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Assigned</p>
                    <p className="text-2xl font-bold">{filteredComplaints.filter(c => c.assignedDepartment).length}</p>
                  </div>
                  <div className="text-3xl opacity-75">✅</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Overdue (7+ days)</p>
                    <p className="text-2xl font-bold">{filteredComplaints.filter(c => c.daysOpened >= 7 && c.status !== 'Resolved').length}</p>
                  </div>
                  <div className="text-3xl opacity-75">🔥</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Complaints Table */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building className="h-5 w-5" />
              Complaints Overview ({filteredComplaints.length})
            </CardTitle>
            <CardDescription>Click on a complaint to view details or assign to department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Department</TableHead>
                    <TableHead>Days Open</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id} className="hover:bg-blue-50 transition-colors duration-200">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{complaint.id}</span>
                          {getUrgencyIndicator(complaint.daysOpened, complaint.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{complaint.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{complaint.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                          complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          complaint.status === 'Pending' ? 'bg-[#FF8C00] text-white' :
                          complaint.status === 'In Progress' ? 'bg-[#17A2B8] text-white' :
                          complaint.status === 'Resolved' ? 'bg-[#28A745] text-white' :
                          'bg-[#DC3545] text-white'
                        }>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {complaint.assignedDepartment ? (
                          <div className="space-y-1">
                            <Badge className={DEPARTMENT_COLORS[complaint.assignedDepartment as keyof typeof DEPARTMENT_COLORS]}>
                              {DEPARTMENTS[complaint.assignedDepartment as keyof typeof DEPARTMENTS].name}
                            </Badge>
                            <div className="text-xs text-gray-600 flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              {complaint.assignedDepartmentHead}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-300">
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className={complaint.daysOpened > 7 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                            {complaint.daysOpened} days
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onComplaintSelect(complaint)}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          {!complaint.assignedDepartment && (
                            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedComplaint(complaint)}
                                  className="hover:bg-green-50 border-green-300 text-green-700"
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Assign
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Assign Complaint to Department
                                  </DialogTitle>
                                  <DialogDescription>
                                    Select the appropriate department to handle complaint {selectedComplaint?.id}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  {selectedComplaint && (
                                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                      <h4 className="font-semibold text-blue-900 mb-2">Complaint Summary</h4>
                                      <p className="text-blue-700 text-sm mb-2">{selectedComplaint.description}</p>
                                      <div className="flex gap-2">
                                        <Badge>{selectedComplaint.category}</Badge>
                                        <Badge variant="outline">{selectedComplaint.priority} Priority</Badge>
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-3">
                                    {selectedComplaint && (
                                      <div className="mb-4">
                                        <h5 className="font-medium mb-2 text-green-700">🎯 Suggested Department:</h5>
                                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="font-medium text-green-800">
                                                {DEPARTMENTS[getSuggestedDepartment(selectedComplaint.category)].name}
                                              </p>
                                              <p className="text-sm text-green-600">
                                                Head: {DEPARTMENTS[getSuggestedDepartment(selectedComplaint.category)].head}
                                              </p>
                                            </div>
                                            <Button
                                              onClick={() => handleAssignToDepartment(getSuggestedDepartment(selectedComplaint.category))}
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              Assign Here
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <h5 className="font-medium mb-2">All Departments:</h5>
                                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                                      {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                                        <div key={key} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold">{dept.name}</h4>
                                                <Badge className={DEPARTMENT_COLORS[key as keyof typeof DEPARTMENT_COLORS]} variant="outline">
                                                  {dept.categories.join(', ')}
                                                </Badge>
                                              </div>
                                              <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                                              <div className="space-y-1 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                  <UserCheck className="h-3 w-3" />
                                                  <span>Head: {dept.head}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Mail className="h-3 w-3" />
                                                  <span>{dept.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Phone className="h-3 w-3" />
                                                  <span>{dept.phone}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <Button
                                              onClick={() => handleAssignToDepartment(key)}
                                              variant="outline"
                                              className="ml-4"
                                            >
                                              <Send className="h-4 w-4 mr-2" />
                                              Assign
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredComplaints.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No complaints found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}