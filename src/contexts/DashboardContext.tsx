
import { createContext, useContext, useState } from 'react';
import { MockData, generateMockData } from '@/lib/mockData';

interface ThresholdSettings {
  cpu: {
    warning: number;
    critical: number;
  };
  memory: {
    warning: number;
    critical: number;
  };
  disk: {
    warning: number;
    critical: number;
  };
  network: {
    warning: number;
    critical: number;
  };
}

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
  thresholds: ThresholdSettings;
  setThresholds: React.Dispatch<React.SetStateAction<ThresholdSettings>>;
  addAlert: (message: string, type: 'warning' | 'error' | 'info') => void;
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
  const [thresholds, setThresholds] = useState<ThresholdSettings>({
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 75, critical: 90 },
    disk: { warning: 80, critical: 95 },
    network: { warning: 8, critical: 12 },
  });
  
  const addAlert = (message: string, type: 'warning' | 'error' | 'info') => {
    const newAlert = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };
    
    setData(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts.slice(0, 99)] // Limit to 100 alerts
    }));
  };
  
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
      setLogUpdateRate,
      thresholds,
      setThresholds,
      addAlert
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
