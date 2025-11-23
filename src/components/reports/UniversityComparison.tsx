import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building } from 'lucide-react';

interface UniversityData {
  university: string;
  fullName: string;
  total: number;
  resolved: number;
  pending: number;
  escalated: number;
  resolutionRate: number;
  avgResolutionTime: number;
  criticalCount: number;
}

interface UniversityComparisonProps {
  universityData: UniversityData[];
}

export function UniversityComparison({ universityData }: UniversityComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          University Comparison
        </CardTitle>
        <p className="text-sm text-gray-600">
          Performance comparison across different institutions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {universityData.map((uni) => (
            <div key={uni.university} className="p-4 border rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900" title={uni.fullName}>
                    {uni.university}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Total: {uni.total}</span>
                    <span>Resolved: {uni.resolved}</span>
                    <span>Pending: {uni.pending}</span>
                    {uni.escalated > 0 && (
                      <span className="text-red-600">Escalated: {uni.escalated}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-medium">{uni.resolutionRate}%</div>
                    <div className="text-xs text-gray-500">Resolution Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{uni.avgResolutionTime} days</div>
                    <div className="text-xs text-gray-500">Avg Time</div>
                  </div>
                  {uni.criticalCount > 0 && (
                    <span className="inline-flex px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                      {uni.criticalCount} Critical
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      uni.resolutionRate >= 70 ? 'bg-green-500' :
                      uni.resolutionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${uni.resolutionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
