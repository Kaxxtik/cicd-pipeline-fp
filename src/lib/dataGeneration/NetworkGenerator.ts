
import { BaseGenerator } from "./BaseGenerator";

export class NetworkGenerator extends BaseGenerator {
  private trafficPatterns: { start: number, end: number, multiplier: number }[] = [];
  
  constructor(initialValue: number = 3) {
    super("network", initialValue, 0.1, 15, 0.6);
    
    // Network has high volatility and strong seasonality
    this.trendStrength = 0.1;
    this.seasonalStrength = 0.5;
    this.noiseStrength = 0.3;
    
    // Define time-based traffic patterns (24-hour format)
    this.trafficPatterns = [
      { start: 9, end: 12, multiplier: 1.5 },  // Morning peak
      { start: 13, end: 16, multiplier: 1.3 }, // Afternoon peak
      { start: 20, end: 22, multiplier: 1.2 }, // Evening peak
      { start: 0, end: 5, multiplier: 0.5 }    // Night lull
    ];
  }
  
  protected getSeasonalComponent(): number {
    const baseComponent = super.getSeasonalComponent();
    
    // Apply time-of-day traffic patterns
    const hour = new Date().getHours();
    const pattern = this.trafficPatterns.find(p => hour >= p.start && hour < p.end);
    const timeMultiplier = pattern ? (pattern.multiplier - 1) * 0.2 : 0;
    
    return baseComponent + timeMultiplier;
  }
  
  // Simulate bandwidth spike (e.g., backup, large download)
  public simulateBandwidthSpike(duration: number = 10000): void {
    // Increase network usage by 300-500%
    const spikeMultiplier = Math.random() * 2 + 3;
    const originalValue = this.currentValue;
    this.currentValue = Math.min(this.max, this.currentValue * spikeMultiplier);
    
    // Add the spike to history
    const roundedValue = Math.round(this.currentValue * 10) / 10;
    this.history = [...this.history.slice(-59), roundedValue];
    
    // Reset after the specified duration
    setTimeout(() => {
      this.currentValue = originalValue;
    }, duration);
  }
  
  // Simulate network congestion (reduced bandwidth)
  public simulateNetworkCongestion(duration: number = 30000): void {
    // Reduce network by 50-70%
    const reductionFactor = Math.random() * 0.2 + 0.5;
    const originalValue = this.currentValue;
    this.currentValue = this.currentValue * reductionFactor;
    
    // Add the drop to history
    const roundedValue = Math.round(this.currentValue * 10) / 10;
    this.history = [...this.history.slice(-59), roundedValue];
    
    // Reset after the specified duration
    setTimeout(() => {
      this.currentValue = originalValue;
    }, duration);
  }
}
