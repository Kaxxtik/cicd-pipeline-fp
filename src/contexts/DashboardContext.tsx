
import { createContext, useContext, useState } from 'react';
import { MockData, generateMockData } from '@/lib/mockData';

interface DashboardContextType {
  data: MockData;
  setData: React.Dispatch<React.SetStateAction<MockData>>;
  refreshRate: number;
  setRefreshRate: React.Dispatch<React.SetStateAction<number>>;
  containerUpdateRate: number;
  setContainerUpdateRate: React.Dispatch<React.SetStateAction<number>>;
  infraUpdateRate: number;
  setInfraUpdateRate: React.Dispatch<React.SetStateAction<number>>;
  logUpdateRate: number;
  setLogUpdateRate: React.Dispatch<React.SetStateAction<number>>;
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
  const [refreshRate, setRefreshRate] = useState(30); // seconds for global data refresh
  const [containerUpdateRate, setContainerUpdateRate] = useState(3); // seconds for container-specific updates
  const [infraUpdateRate, setInfraUpdateRate] = useState(5); // seconds for infrastructure-specific updates
  const [logUpdateRate, setLogUpdateRate] = useState(2); // seconds for log updates
  
  return (
    <DashboardContext.Provider value={{ 
      data, 
      setData, 
      refreshRate, 
      setRefreshRate,
      containerUpdateRate,
      setContainerUpdateRate,
      infraUpdateRate,
      setInfraUpdateRate,
      logUpdateRate,
      setLogUpdateRate
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
