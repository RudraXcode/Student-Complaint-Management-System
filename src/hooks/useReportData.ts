import { useMemo } from 'react';
import { Complaint } from '../types/index';
import { 
  calculateMetrics, 
  getCategoryData, 
  getTrendData,
  getUniversityComparisonData,
  getPriorityAnalysisData
} from '../utils/helpers';

export function useReportData(complaints: Complaint[], selectedPeriod: number) {
  const metrics = useMemo(() => calculateMetrics(complaints), [complaints]);
  
  const categoryData = useMemo(() => getCategoryData(complaints), [complaints]);
  
  const trendData = useMemo(
    () => getTrendData(complaints, selectedPeriod), 
    [complaints, selectedPeriod]
  );
  
  const universityData = useMemo(
    () => getUniversityComparisonData(complaints), 
    [complaints]
  );
  
  const priorityData = useMemo(
    () => getPriorityAnalysisData(complaints), 
    [complaints]
  );

  return {
    metrics,
    categoryData,
    trendData,
    universityData,
    priorityData
  };
}
