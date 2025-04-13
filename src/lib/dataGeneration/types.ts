
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

// Event simulation thresholds
export interface SystemThresholds {
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

// Default threshold values
export const DEFAULT_THRESHOLDS: SystemThresholds = {
  cpu: {
    warning: 70,
    critical: 90,
  },
  memory: {
    warning: 75,
    critical: 90,
  },
  disk: {
    warning: 80,
    critical: 95,
  },
  network: {
    warning: 6,
    critical: 9,
  },
};

// Incident types for the incident management system
export interface Incident {
  id: string;
  title: string;
  description: string;
  status: "open" | "investigating" | "resolved" | "closed";
  severity: "low" | "medium" | "high" | "critical";
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  relatedMetrics?: ("cpu" | "memory" | "disk" | "network")[];
  events: IncidentEvent[];
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  type: "creation" | "update" | "comment" | "status-change" | "resolution";
  content: string;
  timestamp: Date;
  user?: string;
}

// Default correlations between metrics
export const DEFAULT_CORRELATIONS: DataCorrelation[] = [
  {
    sourceMetric: 'cpu',
    targetMetric: 'memory',
    threshold: 70,
    impact: 0.5,
    delay: 2000,
    duration: 10000,
    active: false,
  },
  {
    sourceMetric: 'memory',
    targetMetric: 'disk',
    threshold: 85,
    impact: 0.3,
    delay: 5000,
    duration: 15000,
    active: false,
  },
  {
    sourceMetric: 'network',
    targetMetric: 'cpu',
    threshold: 7,
    impact: 0.4, 
    delay: 1000,
    duration: 8000,
    active: false,
  },
];
