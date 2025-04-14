
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MockData, generateMockData } from '@/lib/mockData';
import { DataManager } from '@/lib/dataGeneration/DataManager';
import { toast } from "sonner";
import { ExtendedAlertData, SystemThresholds } from '@/lib/dataGeneration/types';

export interface ThresholdSettings {
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

export type { ExtendedAlertData };

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
  triggerEvent: (eventType: string) => void;
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
  
  // Create a ref to hold the DataManager instance
  const dataManagerRef = useRef<DataManager | null>(null);
  
  // Initialize the DataManager on mount
  useEffect(() => {
    dataManagerRef.current = new DataManager(data, thresholds);
    
    // Update data with initial values from the DataManager
    setData(dataManagerRef.current.getMockData());
    
    // Setup interval for metric updates
    const cpuInterval = setInterval(() => {
      if (dataManagerRef.current) {
        dataManagerRef.current.updateMetrics('cpu');
        setData(dataManagerRef.current.getMockData());
      }
    }, 2000); // CPU updates every 2 seconds
    
    const memoryInterval = setInterval(() => {
      if (dataManagerRef.current) {
        dataManagerRef.current.updateMetrics('memory');
        setData(dataManagerRef.current.getMockData());
      }
    }, 3000); // Memory updates every 3 seconds
    
    const diskInterval = setInterval(() => {
      if (dataManagerRef.current) {
        dataManagerRef.current.updateMetrics('disk');
        setData(dataManagerRef.current.getMockData());
      }
    }, 5000); // Disk updates every 5 seconds
    
    const networkInterval = setInterval(() => {
      if (dataManagerRef.current) {
        dataManagerRef.current.updateMetrics('network');
        setData(dataManagerRef.current.getMockData());
      }
    }, 1500); // Network updates every 1.5 seconds
    
    return () => {
      clearInterval(cpuInterval);
      clearInterval(memoryInterval);
      clearInterval(diskInterval);
      clearInterval(networkInterval);
    };
  }, []);
  
  // Update thresholds in the DataManager when they change
  useEffect(() => {
    if (dataManagerRef.current) {
      dataManagerRef.current.updateThresholds(thresholds);
    }
  }, [thresholds]);
  
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
    
    // Show toast notification
    toast[type]("New Alert", {
      description: message,
    });
  };
  
  const triggerEvent = (eventType: string) => {
    if (dataManagerRef.current) {
      dataManagerRef.current.triggerEvent(eventType);
      
      // Update data immediately to reflect the change
      setData(dataManagerRef.current.getMockData());
      
      // Show toast notification about the event
      const eventMessages: Record<string, { title: string, description: string, type: 'info' | 'warning' | 'error' }> = {
        cpuSpike: { 
          title: "CPU Spike Triggered", 
          description: "Simulating high CPU utilization", 
          type: "warning" 
        },
        memoryLeak: { 
          title: "Memory Leak Triggered", 
          description: "Simulating gradual memory increase", 
          type: "warning" 
        },
        garbageCollection: { 
          title: "Garbage Collection Triggered", 
          description: "Simulating memory cleanup", 
          type: "info" 
        },
        diskCleanup: { 
          title: "Disk Cleanup Triggered", 
          description: "Simulating file system cleanup", 
          type: "info" 
        },
        largeDiskWrite: { 
          title: "Large Disk Write Triggered", 
          description: "Simulating heavy disk activity", 
          type: "warning" 
        },
        networkSpike: { 
          title: "Network Spike Triggered", 
          description: "Simulating high network traffic", 
          type: "warning" 
        },
        networkCongestion: { 
          title: "Network Congestion Triggered", 
          description: "Simulating network bottleneck", 
          type: "error" 
        }
      };
      
      const eventInfo = eventMessages[eventType];
      if (eventInfo) {
        toast[eventInfo.type](eventInfo.title, {
          description: eventInfo.description,
        });
      }
    }
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
      addAlert,
      triggerEvent
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
