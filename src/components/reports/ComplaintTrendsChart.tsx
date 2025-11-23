import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  month: string;
  submitted: number;
  resolved: number;
  pending: number;
  escalated: number;
}

interface ComplaintTrendsChartProps {
  trendData: TrendData[];
  selectedPeriod: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}
            {entry.dataKey.includes('Rate') && '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ComplaintTrendsChart({ trendData, selectedPeriod }: ComplaintTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Complaint Trends - Last {selectedPeriod} Months
        </CardTitle>
        <CardDescription>
          Track submission and resolution patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="submitted" stroke="#2F5DCE" strokeWidth={2} name="Submitted" />
              <Line type="monotone" dataKey="resolved" stroke="#28A745" strokeWidth={2} name="Resolved" />
              <Line type="monotone" dataKey="pending" stroke="#FF8C00" strokeWidth={2} name="Pending" />
              <Line type="monotone" dataKey="escalated" stroke="#DC3545" strokeWidth={2} name="Escalated" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
