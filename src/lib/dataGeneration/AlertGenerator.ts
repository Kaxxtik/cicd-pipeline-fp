
import { AlertData } from "@/lib/mockData";
import { ExtendedAlertData } from "@/lib/dataGeneration/types";
import { ThresholdSettings } from "@/contexts/DashboardContext";

export class AlertGenerator {
  private thresholds: ThresholdSettings;
  
  constructor(thresholds: ThresholdSettings) {
    this.thresholds = thresholds;
  }
  
  public setThresholds(thresholds: ThresholdSettings) {
    this.thresholds = thresholds;
  }
  
  public checkThresholds(
    cpuValue: number,
    memoryValue: number,
    diskValue: number,
    networkValue: number
  ): ExtendedAlertData | null {
    // Check metrics against thresholds
    if (cpuValue >= this.thresholds.cpu.critical) {
      return this.generateAlert(`Critical CPU usage: ${cpuValue}%`, 'error', 'cpu');
    } else if (cpuValue >= this.thresholds.cpu.warning) {
      return this.generateAlert(`High CPU usage: ${cpuValue}%`, 'warning', 'cpu');
    }
    
    if (memoryValue >= this.thresholds.memory.critical) {
      return this.generateAlert(`Critical memory usage: ${memoryValue}%`, 'error', 'memory');
    } else if (memoryValue >= this.thresholds.memory.warning) {
      return this.generateAlert(`High memory usage: ${memoryValue}%`, 'warning', 'memory');
    }
    
    if (diskValue >= this.thresholds.disk.critical) {
      return this.generateAlert(`Critical disk usage: ${diskValue}%`, 'error', 'disk');
    } else if (diskValue >= this.thresholds.disk.warning) {
      return this.generateAlert(`High disk usage: ${diskValue}%`, 'warning', 'disk');
    }
    
    if (networkValue >= this.thresholds.network.critical) {
      return this.generateAlert(`Critical network I/O: ${networkValue} MB/s`, 'error', 'network');
    } else if (networkValue >= this.thresholds.network.warning) {
      return this.generateAlert(`High network I/O: ${networkValue} MB/s`, 'warning', 'network');
    }
    
    return null;
  }
  
  public generateRandomAlert(): ExtendedAlertData {
    const alertTypes = [
      { message: "Container restart detected", type: "warning" as const, source: "container" },
      { message: "Pipeline failure", type: "error" as const, source: "pipeline" },
      { message: "Database connection issue", type: "warning" as const, source: "database" },
      { message: "API endpoint timeout", type: "warning" as const, source: "api" },
      { message: "Authentication service error", type: "error" as const, source: "auth" },
      { message: "Redis cache failure", type: "error" as const, source: "cache" },
      { message: "Disk space running low", type: "warning" as const, source: "disk" },
      { message: "Network connectivity issues", type: "warning" as const, source: "network" }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    return this.generateAlert(randomAlert.message, randomAlert.type, randomAlert.source);
  }
  
  private generateAlert(
    message: string, 
    type: 'warning' | 'error' | 'info',
    source?: string
  ): ExtendedAlertData {
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      message,
      acknowledged: false,
      source
    };
  }
}
