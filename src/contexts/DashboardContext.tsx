
import { createContext, useContext } from 'react';
import { MockData } from '@/lib/mockData';

interface DashboardContextType {
  data: MockData;
  setData: React.Dispatch<React.SetStateAction<MockData>>;
  refreshRate: number;
  setRefreshRate: React.Dispatch<React.SetStateAction<number>>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}
