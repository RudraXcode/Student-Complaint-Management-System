import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Award } from 'lucide-react';

interface PriorityData {
  priority: string;
  total: number;
  resolutionRate: number;
  avgResolutionTime: number;
}

interface PriorityAnalysisCardProps {
  priorityData: PriorityData[];
}

export function PriorityAnalysisCard({ priorityData }: PriorityAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Priority Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priorityData.map((priority) => (
            <div key={priority.priority} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <Badge className={
                  priority.priority === 'High' ? 'bg-red-100 text-red-800' :
                  priority.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }>
                  {priority.priority}
                </Badge>
                <span className="font-medium">{priority.total} complaints</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{priority.resolutionRate}% resolved</div>
                <div className="text-xs text-gray-500">{priority.avgResolutionTime} days avg</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
