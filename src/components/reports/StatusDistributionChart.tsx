import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface StatusDistribution {
  resolved: number;
  pending: number;
  inProgress: number;
  escalated: number;
}

interface StatusDistributionChartProps {
  byStatus: StatusDistribution;
}

export function StatusDistributionChart({ byStatus }: StatusDistributionChartProps) {
  const data = [
    { name: 'Resolved', value: byStatus.resolved, color: '#28A745' },
    { name: 'Pending', value: byStatus.pending, color: '#FF8C00' },
    { name: 'In Progress', value: byStatus.inProgress, color: '#17A2B8' },
    { name: 'Escalated', value: byStatus.escalated, color: '#DC3545' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
