import React from 'react';
import { Card, CardContent } from '../ui/card';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Metrics {
  total: number;
  resolutionRate: number;
  avgResolutionTime: number;
  critical: number;
}

interface MetricsCardsProps {
  metrics: Metrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.resolutionRate}%</p>
              <div className="flex items-center mt-1">
                {metrics.resolutionRate >= 70 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${metrics.resolutionRate >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.resolutionRate >= 70 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.avgResolutionTime} days</p>
              <div className="flex items-center mt-1">
                {metrics.avgResolutionTime <= 7 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-orange-500 mr-1" />
                )}
                <span className={`text-xs ${metrics.avgResolutionTime <= 7 ? 'text-green-600' : 'text-orange-600'}`}>
                  {metrics.avgResolutionTime <= 7 ? 'Excellent' : 'Slow'}
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.critical}</p>
              {metrics.critical > 0 && (
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">Immediate Attention</span>
                </div>
              )}
            </div>
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              metrics.critical > 0 ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <AlertTriangle className={`h-6 w-6 ${metrics.critical > 0 ? 'text-red-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
