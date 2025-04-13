
import { CpuGenerator } from "./CpuGenerator";
import { MemoryGenerator } from "./MemoryGenerator";
import { DiskGenerator } from "./DiskGenerator";
import { NetworkGenerator } from "./NetworkGenerator";
import { LogGenerator } from "./LogGenerator";
import { AlertGenerator } from "./AlertGenerator";
import { DataCorrelation, SystemState } from "./types";
import { MockData, generateMockData } from "@/lib/mockData";
import { ThresholdSettings } from "@/contexts/DashboardContext";

export class DataManager {
  private cpuGenerator: CpuGenerator;
  private memoryGenerator: MemoryGenerator;
  private diskGenerator: DiskGenerator;
  private networkGenerator: NetworkGenerator;
  private logGenerator: LogGenerator;
  private alertGenerator: AlertGenerator;
  
  private systemState: SystemState;
  private correlations: DataCorrelation[] = [];
  
  private thresholdSettings: ThresholdSettings;
  
  constructor(mockData?: MockData, thresholdSettings?: ThresholdSettings) {
    // Initialize with default thresholds if not provided
    this.thresholdSettings = thresholdSettings || {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 75, critical: 90 },
      disk: { warning: 80, critical: 95 },
      network: { warning: 8, critical: 12 },
    };
    
    // Initialize generators
    this.cpuGenerator = new CpuGenerator(mockData?.metrics.cpu.current || 30);
    this.memoryGenerator = new MemoryGenerator(mockData?.metrics.memory.current || 40);
    this.diskGenerator = new DiskGenerator(mockData?.metrics.disk.current || 60);
    this.networkGenerator = new NetworkGenerator(mockData?.metrics.network.current || 3);
    this.logGenerator = new LogGenerator();
    this.alertGenerator = new AlertGenerator(this.thresholdSettings);
    
    // Initialize system state
    const initialMockData = mockData || generateMockData();
    this.systemState = {
      pipelines: initialMockData.pipelines,
      containers: initialMockData.containers,
      servers: initialMockData.servers,
      metrics: {
        cpu: this.cpuGenerator.getCurrentState(),
        memory: this.memoryGenerator.getCurrentState(),
        disk: this.diskGenerator.getCurrentState(),
        network: this.networkGenerator.getCurrentState()
      },
      logs: initialMockData.logs,
      alerts: initialMockData.alerts,
      lastUpdated: {
        cpu: new Date(),
        memory: new Date(),
        disk: new Date(),
        network: new Date(),
        container: new Date(),
        infrastructure: new Date(),
        logs: new Date(),
        alerts: new Date(),
      }
    };
    
    // Setup correlations
    this.setupCorrelations();
  }
  
  private setupCorrelations() {
    // Define how metrics influence each other
    this.correlations = [
      {
        sourceMetric: 'cpu',
        targetMetric: 'memory',
        threshold: 85,
        impact: 0.3,
        delay: 10000,  // 10 seconds
        duration: 60000, // 1 minute
        active: false
      },
      {
        sourceMetric: 'memory',
        targetMetric: 'disk',
        threshold: 90,
        impact: 0.1,
        delay: 20000,  // 20 seconds
        duration: 30000, // 30 seconds
        active: false
      },
      {
        sourceMetric: 'cpu',
        targetMetric: 'network',
        threshold: 80,
        impact: 0.5,
        delay: 5000,   // 5 seconds
        duration: 15000, // 15 seconds
        active: false
      }
    ];
  }
  
  public updateThresholds(thresholds: ThresholdSettings) {
    this.thresholdSettings = thresholds;
    this.alertGenerator.setThresholds(thresholds);
  }
  
  // Main update method that can be called at different frequencies
  public updateMetrics(metricType?: 'cpu' | 'memory' | 'disk' | 'network'): SystemState {
    const now = new Date();
    let updatedSystemState = { ...this.systemState };
    let alertsUpdated = false;
    
    // Update specific metrics or all if not specified
    if (!metricType || metricType === 'cpu') {
      const cpuValue = this.cpuGenerator.generateNextValue();
      updatedSystemState.metrics.cpu = this.cpuGenerator.getCurrentState();
      updatedSystemState.lastUpdated.cpu = now;
      
      // Check correlations for CPU
      this.checkAndTriggerCorrelations('cpu', cpuValue);
      
      // Generate correlated error log if CPU is high
      const errorLog = this.logGenerator.generateCorrelatedErrorLog('cpu', cpuValue);
      if (errorLog) {
        updatedSystemState.logs = [errorLog, ...updatedSystemState.logs.slice(0, 99)];
      }
      
      // Check for alerts
      const cpuAlert = this.alertGenerator.checkThresholds(
        cpuValue,
        updatedSystemState.metrics.memory.current,
        updatedSystemState.metrics.disk.current,
        updatedSystemState.metrics.network.current
      );
      
      if (cpuAlert) {
        updatedSystemState.alerts = [cpuAlert, ...updatedSystemState.alerts.slice(0, 99)];
        alertsUpdated = true;
      }
    }
    
    if (!metricType || metricType === 'memory') {
      const memoryValue = this.memoryGenerator.generateNextValue();
      updatedSystemState.metrics.memory = this.memoryGenerator.getCurrentState();
      updatedSystemState.lastUpdated.memory = now;
      
      // Check correlations for memory
      this.checkAndTriggerCorrelations('memory', memoryValue);
      
      // Generate correlated error log if memory is high
      const errorLog = this.logGenerator.generateCorrelatedErrorLog('memory', memoryValue);
      if (errorLog) {
        updatedSystemState.logs = [errorLog, ...updatedSystemState.logs.slice(0, 99)];
      }
      
      // Check for alerts if not already updated
      if (!alertsUpdated) {
        const memoryAlert = this.alertGenerator.checkThresholds(
          updatedSystemState.metrics.cpu.current,
          memoryValue,
          updatedSystemState.metrics.disk.current,
          updatedSystemState.metrics.network.current
        );
        
        if (memoryAlert) {
          updatedSystemState.alerts = [memoryAlert, ...updatedSystemState.alerts.slice(0, 99)];
          alertsUpdated = true;
        }
      }
    }
    
    if (!metricType || metricType === 'disk') {
      const diskValue = this.diskGenerator.generateNextValue();
      updatedSystemState.metrics.disk = this.diskGenerator.getCurrentState();
      updatedSystemState.lastUpdated.disk = now;
      
      // Check correlations for disk
      this.checkAndTriggerCorrelations('disk', diskValue);
      
      // Generate correlated error log if disk is high
      const errorLog = this.logGenerator.generateCorrelatedErrorLog('disk', diskValue);
      if (errorLog) {
        updatedSystemState.logs = [errorLog, ...updatedSystemState.logs.slice(0, 99)];
      }
      
      // Check for alerts if not already updated
      if (!alertsUpdated) {
        const diskAlert = this.alertGenerator.checkThresholds(
          updatedSystemState.metrics.cpu.current,
          updatedSystemState.metrics.memory.current,
          diskValue,
          updatedSystemState.metrics.network.current
        );
        
        if (diskAlert) {
          updatedSystemState.alerts = [diskAlert, ...updatedSystemState.alerts.slice(0, 99)];
          alertsUpdated = true;
        }
      }
    }
    
    if (!metricType || metricType === 'network') {
      const networkValue = this.networkGenerator.generateNextValue();
      updatedSystemState.metrics.network = this.networkGenerator.getCurrentState();
      updatedSystemState.lastUpdated.network = now;
      
      // Check correlations for network
      this.checkAndTriggerCorrelations('network', networkValue);
      
      // Generate correlated error log if network is high
      const errorLog = this.logGenerator.generateCorrelatedErrorLog('network', networkValue);
      if (errorLog) {
        updatedSystemState.logs = [errorLog, ...updatedSystemState.logs.slice(0, 99)];
      }
      
      // Check for alerts if not already updated
      if (!alertsUpdated) {
        const networkAlert = this.alertGenerator.checkThresholds(
          updatedSystemState.metrics.cpu.current,
          updatedSystemState.metrics.memory.current,
          updatedSystemState.metrics.disk.current,
          networkValue
        );
        
        if (networkAlert) {
          updatedSystemState.alerts = [networkAlert, ...updatedSystemState.alerts.slice(0, 99)];
        }
      }
    }
    
    // Randomly generate a log entry (not tied to metrics)
    if (Math.random() < 0.3) { // 30% chance of a log entry
      const randomLog = this.logGenerator.generateRandomLog();
      updatedSystemState.logs = [randomLog, ...updatedSystemState.logs.slice(0, 99)];
      updatedSystemState.lastUpdated.logs = now;
    }
    
    // Randomly generate an alert (not tied to thresholds)
    if (Math.random() < 0.05) { // 5% chance of a random alert
      const randomAlert = this.alertGenerator.generateRandomAlert();
      updatedSystemState.alerts = [randomAlert, ...updatedSystemState.alerts.slice(0, 99)];
      updatedSystemState.lastUpdated.alerts = now;
    }
    
    this.systemState = updatedSystemState;
    return this.systemState;
  }
  
  private checkAndTriggerCorrelations(sourceMetric: string, value: number) {
    // Check if any correlation should be triggered
    this.correlations.forEach(correlation => {
      if (
        correlation.sourceMetric === sourceMetric && 
        value >= correlation.threshold && 
        !correlation.active
      ) {
        correlation.active = true;
        correlation.startTime = Date.now();
        
        // Schedule the impact on the target metric
        setTimeout(() => {
          this.applyCorrelationImpact(correlation);
        }, correlation.delay);
        
        // Schedule the end of correlation
        setTimeout(() => {
          correlation.active = false;
          correlation.startTime = undefined;
        }, correlation.delay + correlation.duration);
      }
    });
  }
  
  private applyCorrelationImpact(correlation: DataCorrelation) {
    // Apply the impact to the target metric
    switch (correlation.targetMetric) {
      case 'cpu':
        this.cpuGenerator.setExternalInfluence(correlation.impact);
        break;
      case 'memory':
        // For memory, we can simulate a memory leak
        this.memoryGenerator.simulateMemoryLeak(correlation.duration);
        break;
      case 'disk':
        // For disk, simulate a large file write
        this.diskGenerator.simulateLargeFileWrite(correlation.impact * 10);
        break;
      case 'network':
        // For network, simulate a bandwidth spike
        this.networkGenerator.simulateBandwidthSpike(correlation.duration);
        break;
    }
  }
  
  // Method to trigger special events for demonstration
  public triggerEvent(eventType: string) {
    switch (eventType) {
      case 'cpuSpike':
        this.cpuGenerator.simulateProcessSpike('node', 30);
        break;
      case 'memoryLeak':
        this.memoryGenerator.simulateMemoryLeak(120000); // 2 minutes
        break;
      case 'garbageCollection':
        this.memoryGenerator.simulateGarbageCollection();
        break;
      case 'diskCleanup':
        this.diskGenerator.simulateDiskCleanup(15);
        break;
      case 'largeDiskWrite':
        this.diskGenerator.simulateLargeFileWrite(10);
        break;
      case 'networkSpike':
        this.networkGenerator.simulateBandwidthSpike(30000); // 30 seconds
        break;
      case 'networkCongestion':
        this.networkGenerator.simulateNetworkCongestion(60000); // 1 minute
        break;
    }
  }
  
  // Convert system state to MockData format for backward compatibility
  public getMockData(): MockData {
    return {
      pipelines: this.systemState.pipelines,
      containers: this.systemState.containers,
      servers: this.systemState.servers,
      metrics: this.systemState.metrics,
      logs: this.systemState.logs,
      alerts: this.systemState.alerts
    };
  }
}
