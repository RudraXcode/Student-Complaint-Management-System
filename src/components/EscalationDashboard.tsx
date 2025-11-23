import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, AlertTriangle, Clock, User, FileText, Filter } from 'lucide-react';
import { Complaint } from '../App';

interface EscalationDashboardProps {
  complaints: Complaint[];
  onComplaintSelect: (complaint: Complaint) => void;
  onBack: () => void;
}

export function EscalationDashboard({ complaints, onComplaintSelect, onBack }: EscalationDashboardProps) {
  const [levelFilter, setLevelFilter] = useState('all');

  const escalatedComplaints = complaints.filter(c => c.status === 'Escalated');
  const urgentComplaints = complaints.filter(c => c.daysOpened > 7 && c.status !== 'Resolved');
  
  const filteredComplaints = levelFilter === 'all' 
    ? escalatedComplaints 
    : escalatedComplaints.filter(c => c.escalationLevel === parseInt(levelFilter));

  const levelCounts = {
    1: escalatedComplaints.filter(c => c.escalationLevel === 1).length,
    2: escalatedComplaints.filter(c => c.escalationLevel === 2).length,
    3: escalatedComplaints.filter(c => c.escalationLevel === 3).length,
  };

  const getEscalationLevelText = (level: number) => {
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

  const getEscalationColor = (level: number) => {
    switch (level) {
      case 1:
        return 'text-yellow-600 bg-yellow-50';
      case 2:
        return 'text-orange-600 bg-orange-50';
      case 3:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Escalation Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage escalated complaints requiring immediate attention.
          </p>
        </div>

        {/* Alert Banner */}
        {urgentComplaints.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Urgent Attention Required</h3>
                  <p className="text-sm text-red-700">
                    {urgentComplaints.length} complaints have been open for more than 7 days and require immediate action.
                  </p>
                </div>
                <Button variant="outline" className="ml-auto text-red-600 border-red-300 hover:bg-red-100">
                  View All Urgent
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Escalation Level Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Escalated</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{escalatedComplaints.length}</div>
              <p className="text-xs text-muted-foreground">Requires immediate action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level 1 (Faculty)</CardTitle>
              <User className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{levelCounts[1]}</div>
              <p className="text-xs text-muted-foreground">Faculty review required</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level 2 (HOD)</CardTitle>
              <User className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{levelCounts[2]}</div>
              <p className="text-xs text-muted-foreground">HOD intervention needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level 3 (Dean)</CardTitle>
              <User className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{levelCounts[3]}</div>
              <p className="text-xs text-muted-foreground">Dean attention required</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Escalation Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select escalation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Level 1 - Faculty</SelectItem>
                  <SelectItem value="2">Level 2 - HOD</SelectItem>
                  <SelectItem value="3">Level 3 - Dean</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setLevelFilter('all')}>
                Clear Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Escalated Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
              Escalated Complaints ({filteredComplaints.length})
            </CardTitle>
            <CardDescription>
              Complaints that have been escalated and require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredComplaints.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Complaint ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Escalation Level</TableHead>
                      <TableHead>Days Open</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints
                      .sort((a, b) => {
                        // Sort by escalation level (highest first), then by days open (most first)
                        if (a.escalationLevel !== b.escalationLevel) {
                          return b.escalationLevel - a.escalationLevel;
                        }
                        return b.daysOpened - a.daysOpened;
                      })
                      .map((complaint) => (
                        <TableRow key={complaint.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {complaint.daysOpened > 14 && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <Badge className={getPriorityColor(complaint.priority)}>
                                {complaint.priority}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {complaint.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{complaint.studentName}</div>
                              <div className="text-sm text-gray-500">{complaint.studentId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{complaint.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEscalationColor(complaint.escalationLevel)}>
                              {getEscalationLevelText(complaint.escalationLevel)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className={`font-medium ${
                                complaint.daysOpened > 14 ? 'text-red-600' : 
                                complaint.daysOpened > 7 ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                                {complaint.daysOpened} days
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {complaint.lastUpdated}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onComplaintSelect(complaint)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Escalate
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No escalated complaints</h3>
                <p className="text-gray-600">
                  {levelFilter === 'all' 
                    ? 'There are currently no escalated complaints in the system.'
                    : `No complaints at escalation level ${levelFilter}.`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Escalation Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Escalation Guidelines</CardTitle>
            <CardDescription>Understanding the escalation process and timelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold mb-2">Level 1 - Faculty</h4>
                <p className="text-sm text-gray-600">
                  Initial escalation to department faculty. Triggered after 3 days without response.
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">Level 2 - HOD</h4>
                <p className="text-sm text-gray-600">
                  Escalated to Head of Department. Triggered after 7 days or complex issues.
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="font-semibold mb-2">Level 3 - Dean</h4>
                <p className="text-sm text-gray-600">
                  Final escalation to Dean. Reserved for critical issues or after 14 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}