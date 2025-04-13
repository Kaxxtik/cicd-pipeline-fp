
import { BaseGenerator } from "./BaseGenerator";

export class DiskGenerator extends BaseGenerator {
  private diskGrowthRate: number = 0.001; // slow background growth
  
  constructor(initialValue: number = 60) {
    super("disk", initialValue, 0, 100, 0.1);
    
    // Disk usage is the least volatile
    this.trendStrength = 0.05;
    this.seasonalStrength = 0.05;
    this.noiseStrength = 0.05;
  }
  
  protected getTrendComponent(): number {
    // Disk usage has a slight upward trend by default
    return super.getTrendComponent() + this.diskGrowthRate;
  }
  
  // Simulate disk cleanup (sudden drop)
  public simulateDiskCleanup(percentageReduction: number = 10): void {
    const reduction = Math.min(percentageReduction, this.currentValue * (percentageReduction / 100));
    this.currentValue = Math.max(this.min, this.currentValue - reduction);
    
    // Add the drop to history
    const roundedValue = Math.round(this.currentValue * 10) / 10;
    this.history = [...this.history.slice(-59), roundedValue];
  }
  
  // Simulate large file write (sudden increase)
  public simulateLargeFileWrite(sizePercentage: number = 5): void {
    const increase = this.max * (sizePercentage / 100);
    this.currentValue = Math.min(this.max, this.currentValue + increase);
    
    // Add the spike to history
    const roundedValue = Math.round(this.currentValue * 10) / 10;
    this.history = [...this.history.slice(-59), roundedValue];
  }
  
  // Simulate disk I/O pressure, affecting both CPU and disk usage
  public simulateDiskIOPressure(intensity: number = 0.8, duration: number = 10000): void {
    // Current value increases temporarily
    const originalValue = this.currentValue;
    const increase = this.max * 0.15 * intensity;
    
    this.currentValue = Math.min(this.max, this.currentValue + increase);
    
    // Add the spike to history
    const roundedValue = Math.round(this.currentValue * 10) / 10;
    this.history = [...this.history.slice(-59), roundedValue];
    
    // Return to normal gradually
    setTimeout(() => {
      this.currentValue = Math.min(this.max, originalValue + (this.diskGrowthRate * 5));
    }, duration);
  }
  
  // Simulate disk error event
  public simulateDiskError(): boolean {
    // Higher chance of error when disk is near capacity
    const errorThreshold = this.currentValue > 90 ? 0.7 : this.currentValue > 80 ? 0.3 : 0.05;
    return Math.random() < errorThreshold;
  }
}
