import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Metrics {
  total: number;
  resolutionRate: number;
  avgResolutionTime: number;
  avgResponseTime: number;
  critical: number;
  efficiency: {
    onTime: number;
    delayed: number;
    escalationRate: number;
  };
  performanceTrends: any[];
}

interface PerformanceMetricsProps {
  metrics: Metrics;
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

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>On-time Resolution</span>
                <Badge className="bg-green-100 text-green-800">
                  {metrics.efficiency.onTime}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Delayed Resolution</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {metrics.efficiency.delayed}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Escalation Rate</span>
                <Badge className="bg-red-100 text-red-800">
                  {metrics.efficiency.escalationRate}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {metrics.avgResponseTime}
              </div>
              <div className="text-sm text-gray-600">days average</div>
              <div className={`mt-2 text-xs ${
                metrics.avgResponseTime <= 1 ? 'text-green-600' :
                metrics.avgResponseTime <= 3 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.avgResponseTime <= 1 ? 'Excellent' :
                 metrics.avgResponseTime <= 3 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                metrics.resolutionRate >= 80 && metrics.avgResolutionTime <= 7 ? 'text-green-600' :
                metrics.resolutionRate >= 60 && metrics.avgResolutionTime <= 14 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {metrics.resolutionRate >= 80 && metrics.avgResolutionTime <= 7 ? 'A' :
                 metrics.resolutionRate >= 60 && metrics.avgResolutionTime <= 14 ? 'B' :
                 metrics.resolutionRate >= 40 ? 'C' : 'D'}
              </div>
              <div className="text-sm text-gray-600">Performance Grade</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Monthly performance indicators over the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="resolutionRate" 
                  stroke="#28A745" 
                  strokeWidth={2} 
                  name="Resolution Rate (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
