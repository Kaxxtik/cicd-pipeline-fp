
import { AlertData, ContainerData, LogEntry, PipelineData, ServerData } from "@/lib/mockData";

export interface MetricState {
  current: number;
  history: number[];
  min: number;
  max: number;
}

export interface SystemState {
  pipelines: PipelineData[];
  containers: ContainerData[];
  servers: ServerData[];
  metrics: {
    cpu: MetricState;
    memory: MetricState;
    disk: MetricState;
    network: MetricState;
  };
  logs: LogEntry[];
  alerts: AlertData[];
  lastUpdated: {
    cpu: Date;
    memory: Date;
    disk: Date;
    network: Date;
    container: Date;
    infrastructure: Date;
    logs: Date;
    alerts: Date;
  };
}

export interface GeneratorOptions {
  timeOfDay: 'day' | 'night';
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isWeekend: boolean;
  isBusinessHours: boolean;
}

export interface DataCorrelation {
  sourceMetric: string;
  targetMetric: string; 
  threshold: number;
  impact: number;
  delay: number; // in milliseconds
  duration: number; // in milliseconds
  active: boolean;
  startTime?: number;
}
