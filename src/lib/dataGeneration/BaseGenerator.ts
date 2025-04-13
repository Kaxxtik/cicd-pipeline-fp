
import { GeneratorOptions, MetricState } from "./types";

export abstract class BaseGenerator {
  protected name: string;
  protected min: number;
  protected max: number;
  protected volatility: number;
  protected trendStrength: number = 0.1;
  protected noiseStrength: number = 0.2;
  protected seasonalStrength: number = 0.3;
  protected currentTrend: number = 0;
  protected currentValue: number;
  protected history: number[] = [];
  protected options: GeneratorOptions;
  
  constructor(name: string, initialValue: number, min: number, max: number, volatility: number) {
    this.name = name;
    this.currentValue = initialValue;
    this.min = min;
    this.max = max;
    this.volatility = volatility;
    this.options = this.getDefaultOptions();
    
    // Initialize history with the current value
    this.history = Array(60).fill(initialValue);
  }
  
  protected getDefaultOptions(): GeneratorOptions {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0-6 (Sunday-Saturday)
    
    return {
      timeOfDay: (hour >= 8 && hour < 20) ? 'day' : 'night',
      dayOfWeek: dayOfWeek,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isBusinessHours: hour >= 9 && hour <= 17 && !(dayOfWeek === 0 || dayOfWeek === 6)
    };
  }
  
  protected updateOptions() {
    this.options = this.getDefaultOptions();
  }
  
  protected getTrendComponent(): number {
    // Gradually change the trend direction
    this.currentTrend = this.currentTrend * 0.95 + (Math.random() - 0.5) * 0.1;
    return this.currentTrend * this.trendStrength;
  }
  
  protected getNoiseComponent(): number {
    return (Math.random() - 0.5) * this.noiseStrength * this.volatility;
  }
  
  protected getSeasonalComponent(): number {
    const { isBusinessHours, timeOfDay } = this.options;
    
    // Higher during business hours, lower at night
    let seasonalFactor = 0;
    
    if (isBusinessHours) {
      seasonalFactor = 0.5; // Business hours base load
    } else if (timeOfDay === 'day') {
      seasonalFactor = 0.3; // Day time, non-business hours
    } else {
      seasonalFactor = -0.3; // Night time
    }
    
    return seasonalFactor * this.seasonalStrength;
  }
  
  protected applySpikeChance(): number {
    // Occasionally apply spikes with different probabilities based on time
    const { isBusinessHours } = this.options;
    
    // Higher spike chance during business hours
    const spikeChance = isBusinessHours ? 0.03 : 0.01;
    
    if (Math.random() < spikeChance) {
      const spikeDirection = Math.random() > 0.7 ? 1 : -1; // 70% positive spikes
      const spikeMagnitude = Math.random() * 0.2 + 0.1; // Spike between 10-30%
      return spikeDirection * spikeMagnitude;
    }
    
    return 0;
  }
  
  public generateNextValue(externalFactor: number = 0): number {
    this.updateOptions();
    
    // Calculate components
    const trend = this.getTrendComponent();
    const noise = this.getNoiseComponent();
    const seasonal = this.getSeasonalComponent();
    const spike = this.applySpikeChance();
    
    // Calculate change
    const change = trend + noise + seasonal + spike + externalFactor;
    
    // Apply change and ensure within bounds
    this.currentValue = Math.max(this.min, Math.min(this.max, this.currentValue + change * (this.max - this.min)));
    
    // Round to one decimal place for display
    const roundedValue = Math.round(this.currentValue * 10) / 10;
    
    // Update history
    this.history = [...this.history.slice(-59), roundedValue];
    
    return roundedValue;
  }
  
  public getCurrentState(): MetricState {
    return {
      current: Math.round(this.currentValue * 10) / 10,
      history: [...this.history],
      min: Math.min(...this.history),
      max: Math.max(...this.history)
    };
  }
  
  public setExternalInfluence(value: number) {
    this.generateNextValue(value);
  }
}
