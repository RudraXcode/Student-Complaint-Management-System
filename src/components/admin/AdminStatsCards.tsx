import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Skull,
  Flame,
  Zap,
  Award
} from 'lucide-react';

interface AdminStats {
  totalComplaints: number;
  criticalOverdue: number;
  highUrgencyOverdue: number;
  resolvedComplaints: number;
  resolutionRate: number;
}

interface AdminStatsCardsProps {
  stats: AdminStats;
  onNavigate: () => void;
}

export function AdminStatsCards({ stats, onNavigate }: AdminStatsCardsProps) {
  const getStatusCardStyle = (count: number, type: 'critical' | 'high' | 'success' | 'normal') => {
    const baseStyle = "hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0";
    
    switch (type) {
      case 'critical':
        return count > 0 
          ? `${baseStyle} bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-red-200 animate-pulse` 
          : `${baseStyle} bg-white shadow-lg`;
      case 'high':
        return count > 0 
          ? `${baseStyle} bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-orange-200` 
          : `${baseStyle} bg-white shadow-lg`;
      case 'success':
        return `${baseStyle} bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white shadow-green-200`;
      default:
        return `${baseStyle} bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-200`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      <Card className={getStatusCardStyle(stats.totalComplaints, 'normal')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90">Total Complaints</CardTitle>
            <div className="text-3xl font-bold mt-2">{stats.totalComplaints}</div>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">All time submissions</p>
          <div className="flex items-center mt-2 gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Active management</span>
          </div>
        </CardContent>
      </Card>

      <Card className={getStatusCardStyle(stats.criticalOverdue, 'critical')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90 flex items-center gap-2">
              Critical Issues
              {stats.criticalOverdue > 0 && <Skull className="h-4 w-4 animate-pulse" />}
            </CardTitle>
            <div className={`text-3xl font-bold mt-2 ${stats.criticalOverdue > 0 ? 'animate-pulse' : ''}`}>
              {stats.criticalOverdue}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${stats.criticalOverdue > 0 ? 'bg-white/20' : 'bg-red-100'}`}>
            <AlertTriangle className={`h-6 w-6 ${stats.criticalOverdue > 0 ? 'text-white animate-pulse' : 'text-red-600'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">14+ days overdue</p>
          {stats.criticalOverdue > 0 && (
            <Button 
              size="sm" 
              className="mt-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 animate-pulse font-bold"
              onClick={onNavigate}
            >
              🔥 IMMEDIATE ACTION REQUIRED
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className={getStatusCardStyle(stats.highUrgencyOverdue, 'high')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90 flex items-center gap-2">
              High Priority
              {stats.highUrgencyOverdue > 0 && <Flame className="h-4 w-4" />}
            </CardTitle>
            <div className="text-3xl font-bold mt-2">{stats.highUrgencyOverdue}</div>
          </div>
          <div className={`p-3 rounded-xl ${stats.highUrgencyOverdue > 0 ? 'bg-white/20' : 'bg-orange-100'}`}>
            <Clock className={`h-6 w-6 ${stats.highUrgencyOverdue > 0 ? 'text-white' : 'text-orange-600'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">7-13 days overdue</p>
          <div className="flex items-center mt-2 gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Needs attention</span>
          </div>
        </CardContent>
      </Card>

      <Card className={getStatusCardStyle(stats.resolvedComplaints, 'success')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wide opacity-90">Resolved Cases</CardTitle>
            <div className="text-3xl font-bold mt-2">{stats.resolvedComplaints}</div>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">Success rate: {stats.resolutionRate}%</p>
          <div className="flex items-center mt-2 gap-2">
            <Award className="h-4 w-4" />
            <span className="text-sm">Excellent performance</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
