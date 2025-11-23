import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Complaint } from '../../App';

interface CategoryChartProps {
  complaints: Complaint[];
}

const COLORS = ['#2F5DCE', '#FF8C00', '#28A745', '#DC3545', '#17A2B8', '#6F42C1'];

export function CategoryChart({ complaints }: CategoryChartProps) {
  // Handle undefined or empty complaints array
  if (!complaints || complaints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
            Complaints by Category
          </CardTitle>
          <CardDescription>Distribution of complaints across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No complaint data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process complaints data to get category counts
  const categoryData = complaints.reduce((acc, complaint) => {
    const category = complaint.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format for recharts
  const chartData = Object.entries(categoryData).map(([category, count], index) => ({
    name: category,
    value: count,
    color: COLORS[index % COLORS.length]
  }));

  // Custom tooltip for better information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / complaints.length) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            Count: {data.value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
          Complaints by Category
        </CardTitle>
        <CardDescription>
          Distribution of {complaints.length} complaints across different categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          {chartData.map((item, index) => (
            <div key={item.name} className="p-2 bg-gray-50 rounded">
              <div 
                className="w-4 h-4 rounded-full mx-auto mb-1"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-xs text-gray-600">{item.value} complaints</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}