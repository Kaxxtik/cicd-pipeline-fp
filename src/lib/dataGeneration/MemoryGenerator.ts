
import { BaseGenerator } from "./BaseGenerator";

export class MemoryGenerator extends BaseGenerator {
  private memoryLeakSimulation: boolean = false;
  private leakRate: number = 0;
  private leakStartValue: number = 0;
  
  constructor(initialValue: number = 40) {
    super("memory", initialValue, 0, 100, 0.3);
    
    // Memory has less volatility but stronger trends
    this.trendStrength = 0.15;
    this.seasonalStrength = 0.25;
    this.noiseStrength = 0.1;
  }
  
  protected getTrendComponent(): number {
    const baseTrend = super.getTrendComponent();
    
    // If we're simulating a memory leak, add the leak rate
    if (this.memoryLeakSimulation) {
      return baseTrend + this.leakRate;
    }
    
    return baseTrend;
  }
  
  // Simulate memory leak (gradual increase)
  public simulateMemoryLeak(duration: number = 60000): void {
    // Only start a leak if one isn't already in progress
    if (!this.memoryLeakSimulation) {
      this.memoryLeakSimulation = true;
      this.leakStartValue = this.currentValue;
      
      // Set a leak rate that will increase by 15-30% over the duration
      const targetIncrease = (Math.random() * 15 + 15) / 100;
      const updates = duration / 1000; // assuming 1 update per second
      this.leakRate = targetIncrease / updates;
      
      // Stop the leak after the specified duration
      setTimeout(() => {
        this.memoryLeakSimulation = false;
        this.leakRate = 0;
      }, duration);
    }
  }
  
  // Simulate garbage collection (sudden drop)
  public simulateGarbageCollection(): void {
    // Reduce memory by 10-20%
    const reduction = this.currentValue * (Math.random() * 0.1 + 0.1);
    this.currentValue = Math.max(this.min, this.currentValue - reduction);
    
    // Add the drop to history
    const roundedValue = Math.round(this.currentValue * 10) / 10;
    this.history = [...this.history.slice(-59), roundedValue];
  }
}
