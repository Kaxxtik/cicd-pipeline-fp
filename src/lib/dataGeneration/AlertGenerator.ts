
import { AlertData } from "@/lib/mockData";
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
  ): AlertData | null {
    // Check metrics against thresholds
    if (cpuValue >= this.thresholds.cpu.critical) {
      return this.generateAlert(`Critical CPU usage: ${cpuValue}%`, 'error');
    } else if (cpuValue >= this.thresholds.cpu.warning) {
      return this.generateAlert(`High CPU usage: ${cpuValue}%`, 'warning');
    }
    
    if (memoryValue >= this.thresholds.memory.critical) {
      return this.generateAlert(`Critical memory usage: ${memoryValue}%`, 'error');
    } else if (memoryValue >= this.thresholds.memory.warning) {
      return this.generateAlert(`High memory usage: ${memoryValue}%`, 'warning');
    }
    
    if (diskValue >= this.thresholds.disk.critical) {
      return this.generateAlert(`Critical disk usage: ${diskValue}%`, 'error');
    } else if (diskValue >= this.thresholds.disk.warning) {
      return this.generateAlert(`High disk usage: ${diskValue}%`, 'warning');
    }
    
    if (networkValue >= this.thresholds.network.critical) {
      return this.generateAlert(`Critical network I/O: ${networkValue} MB/s`, 'error');
    } else if (networkValue >= this.thresholds.network.warning) {
      return this.generateAlert(`High network I/O: ${networkValue} MB/s`, 'warning');
    }
    
    return null;
  }
  
  public generateRandomAlert(): AlertData {
    const alertTypes = [
      { message: "Container restart detected", type: "warning" as const },
      { message: "Pipeline failure", type: "error" as const },
      { message: "Database connection issue", type: "warning" as const },
      { message: "API endpoint timeout", type: "warning" as const },
      { message: "Authentication service error", type: "error" as const },
      { message: "Redis cache failure", type: "error" as const },
      { message: "Disk space running low", type: "warning" as const },
      { message: "Network connectivity issues", type: "warning" as const }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    return this.generateAlert(randomAlert.message, randomAlert.type);
  }
  
  private generateAlert(message: string, type: 'warning' | 'error' | 'info'): AlertData {
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      message,
      acknowledged: false
    };
  }
}
