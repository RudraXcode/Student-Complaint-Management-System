import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface CategoryData {
  name: string;
  total: number;
  resolved: number;
  pending: number;
  escalated: number;
  resolutionRate: number;
  avgResolutionTime: number;
}

interface CategoryPerformanceChartProps {
  categoryData: CategoryData[];
}

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

export function CategoryPerformanceChart({ categoryData }: CategoryPerformanceChartProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Category Performance Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of complaints by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total" fill="#2F5DCE" name="Total" />
                <Bar dataKey="resolved" fill="#28A745" name="Resolved" />
                <Bar dataKey="pending" fill="#FF8C00" name="Pending" />
                <Bar dataKey="escalated" fill="#DC3545" name="Escalated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Category</th>
                  <th className="text-center p-2">Total</th>
                  <th className="text-center p-2">Resolution Rate</th>
                  <th className="text-center p-2">Avg Resolution Time</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((category) => (
                  <tr key={category.name} className="border-b">
                    <td className="p-2 font-medium">{category.name}</td>
                    <td className="text-center p-2">{category.total}</td>
                    <td className="text-center p-2">
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${
                        category.resolutionRate >= 70 ? 'bg-green-100 text-green-800' :
                        category.resolutionRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {category.resolutionRate}%
                      </span>
                    </td>
                    <td className="text-center p-2">{category.avgResolutionTime} days</td>
                    <td className="text-center p-2">
                      {category.resolutionRate >= 70 ? 
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> :
                        <AlertTriangle className="h-4 w-4 text-red-500 mx-auto" />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
