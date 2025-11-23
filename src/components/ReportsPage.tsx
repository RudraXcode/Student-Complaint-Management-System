import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Download } from 'lucide-react';
import { Complaint } from '../App';
import { useReportData } from '../hooks/useReportData';
import { MetricsCards } from './reports/MetricsCards';
import { StatusDistributionChart } from './reports/StatusDistributionChart';
import { PriorityAnalysisCard } from './reports/PriorityAnalysisCard';
import { ComplaintTrendsChart } from './reports/ComplaintTrendsChart';
import { CategoryPerformanceChart } from './reports/CategoryPerformanceChart';
import { UniversityComparison } from './reports/UniversityComparison';
import { PerformanceMetrics } from './reports/PerformanceMetrics';

interface ReportsPageProps {
  complaints: Complaint[];
  onBack: () => void;
}

export function ReportsPage({ complaints, onBack }: ReportsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'1' | '3' | '6' | '12'>('6');
  const [activeTab, setActiveTab] = useState('overview');

  // Use custom hook for all data calculations
  const { metrics, categoryData, trendData, universityData, priorityData } = 
    useReportData(complaints, parseInt(selectedPeriod));

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: `Last ${selectedPeriod} months`,
      summary: metrics,
      categoryBreakdown: categoryData,
      trends: trendData,
      universityComparison: universityData,
      priorityAnalysis: priorityData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCMS-Report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Analytics & Reports
              </h1>
              <p className="text-gray-600">
                Comprehensive analysis of complaint management performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={(value: '1' | '3' | '6' | '12') => setSelectedPeriod(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 1 Month</SelectItem>
                  <SelectItem value="3">Last 3 Months</SelectItem>
                  <SelectItem value="6">Last 6 Months</SelectItem>
                  <SelectItem value="12">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} className="bg-[#2F5DCE] hover:bg-[#2548a8]">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <MetricsCards metrics={metrics} />

        {/* Detailed Reports Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="universities">Universities</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusDistributionChart byStatus={metrics.byStatus} />
              <PriorityAnalysisCard priorityData={priorityData} />
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <ComplaintTrendsChart trendData={trendData} selectedPeriod={selectedPeriod} />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <CategoryPerformanceChart categoryData={categoryData} />
          </TabsContent>

          {/* Universities Tab */}
          <TabsContent value="universities" className="space-y-6">
            <UniversityComparison universityData={universityData} />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics metrics={metrics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}