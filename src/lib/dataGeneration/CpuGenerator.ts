
import { BaseGenerator } from "./BaseGenerator";

export class CpuGenerator extends BaseGenerator {
  private processes: { name: string, usage: number }[] = [];
  
  constructor(initialValue: number = 30) {
    super("cpu", initialValue, 0, 100, 0.5);
    
    // CPU has higher trend and seasonal strength
    this.trendStrength = 0.12;
    this.seasonalStrength = 0.4;
    
    // Initialize some mock processes
    this.processes = [
      { name: "nginx", usage: 5 },
      { name: "node", usage: 12 },
      { name: "postgres", usage: 8 },
      { name: "redis", usage: 3 },
      { name: "system", usage: 2 }
    ];
  }
  
  protected getSeasonalComponent(): number {
    const baseComponent = super.getSeasonalComponent();
    
    // Add a more pronounced business hours pattern for CPU
    const { isBusinessHours } = this.options;
    const businessHoursComponent = isBusinessHours ? 0.2 : -0.1;
    
    return baseComponent + businessHoursComponent;
  }
  
  // Simulate process spikes
  public simulateProcessSpike(processName: string, magnitude: number): void {
    const process = this.processes.find(p => p.name === processName);
    if (process) {
      const originalUsage = process.usage;
      process.usage += magnitude;
      
      // Update the current value with the change
      this.currentValue += magnitude;
      this.currentValue = Math.min(this.max, this.currentValue);
      
      // Reset after 3-5 updates
      setTimeout(() => {
        if (process) {
          process.usage = originalUsage;
        }
      }, Math.floor(Math.random() * 2000 + 3000));
    }
  }
  
  public getTopProcesses(): { name: string, usage: number }[] {
    // Return processes sorted by usage
    return [...this.processes].sort((a, b) => b.usage - a.usage);
  }
}
