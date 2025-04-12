
import { createContext, useContext, useState } from 'react';
import { MockData, generateMockData } from '@/lib/mockData';

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

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(generateMockData());
  const [refreshRate, setRefreshRate] = useState(30); // seconds
  
  return (
    <DashboardContext.Provider value={{ data, setData, refreshRate, setRefreshRate }}>
      {children}
    </DashboardContext.Provider>
  );
}
