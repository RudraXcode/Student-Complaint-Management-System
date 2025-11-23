import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Complaint } from '../../App';

interface TrendChartProps {
  complaints: Complaint[];
}

export function TrendChart({ complaints }: TrendChartProps) {
  // Handle undefined or empty complaints array
  if (!complaints || complaints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
            Complaint Trends
          </CardTitle>
          <CardDescription>Monthly complaint submission and resolution trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No complaint data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process complaints data to get monthly trends
  const monthlyData = complaints.reduce((acc, complaint) => {
    // Parse the date and get year-month
    const date = new Date(complaint.dateSubmitted);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        submitted: 0,
        resolved: 0,
        pending: 0,
        escalated: 0
      };
    }
    
    acc[monthKey].submitted += 1;
    
    // Count by status
    switch (complaint.status) {
      case 'Resolved':
        acc[monthKey].resolved += 1;
        break;
      case 'Escalated':
        acc[monthKey].escalated += 1;
        break;
      case 'Pending':
      case 'In Progress':
        acc[monthKey].pending += 1;
        break;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by date
  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, data]) => data);

  // Ensure we have at least some data
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
            Complaint Trends
          </CardTitle>
          <CardDescription>Monthly complaint submission and resolution trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No trend data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
          Complaint Trends
        </CardTitle>
        <CardDescription>
          Monthly submission and resolution patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="submitted" 
                stroke="#2F5DCE" 
                strokeWidth={2}
                name="Submitted"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#28A745" 
                strokeWidth={2}
                name="Resolved"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#FF8C00" 
                strokeWidth={2}
                name="Pending"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="escalated" 
                stroke="#DC3545" 
                strokeWidth={2}
                name="Escalated"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary */}
        <div className="mt-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium text-blue-800">Total Submitted</div>
              <div className="text-blue-600">{complaints.length}</div>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <div className="font-medium text-green-800">Resolved</div>
              <div className="text-green-600">
                {complaints.filter(c => c.status === 'Resolved').length}
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <div className="font-medium text-orange-800">Pending</div>
              <div className="text-orange-600">
                {complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length}
              </div>
            </div>
            <div className="p-2 bg-red-50 rounded">
              <div className="font-medium text-red-800">Escalated</div>
              <div className="text-red-600">
                {complaints.filter(c => c.status === 'Escalated').length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}