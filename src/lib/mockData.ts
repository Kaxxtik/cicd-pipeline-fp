export interface MockData {
  pipelines: PipelineData[];
  containers: ContainerData[];
  servers: ServerData[];
  metrics: {
    cpu: MetricData;
    memory: MetricData;
    disk: MetricData;
    network: MetricData;
  };
  logs: LogEntry[];
  alerts: AlertData[];
}

export interface PipelineData {
  id: string;
  name: string;
  status: 'success' | 'building' | 'failed' | 'unstable';
  stages: PipelineStage[];
  lastRun: string;
  duration: string;
  branch: string;
}

export interface PipelineStage {
  name: string;
  status: 'success' | 'building' | 'failed' | 'pending' | 'skipped';
  duration: string;
}

export interface ContainerData {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'restarting' | 'exited';
  health: 'healthy' | 'unhealthy' | 'starting';
  cpu: number;
  memory: number;
  uptime: string;
  restarts: number;
  ports?: {host: string, container: string, protocol: string}[];
  volumes?: {host: string, container: string}[];
  networks?: string[];
  environment?: string[];
}

export interface ServerData {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  load: number[];
}

export interface MetricData {
  current: number;
  history: number[];
  min: number;
  max: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  service: string;
  message: string;
}

export interface AlertData {
  id: string;
  timestamp: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  acknowledged: boolean;
}

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const chance = (percentage: number) => Math.random() < percentage / 100;

const randomWalk = (previous: number, min: number, max: number, maxChange: number): number => {
  const change = (Math.random() - 0.5) * 2 * maxChange;
  return Math.max(min, Math.min(max, previous + change));
};

export function generateMockData(previous?: MockData): MockData {
  if (previous) {
    const newCpuValue = randomWalk(previous.metrics.cpu.current, 0, 100, 5);
    const newMemValue = randomWalk(previous.metrics.memory.current, 0, 100, 3);
    const newDiskValue = randomWalk(previous.metrics.disk.current, 0, 100, 1);
    const newNetValue = randomWalk(previous.metrics.network.current, 0.1, 15, 1);
    
    const updatedData = {
      ...previous,
      metrics: {
        cpu: {
          current: Math.round(newCpuValue * 10) / 10,
          history: [...previous.metrics.cpu.history.slice(-59), Math.round(newCpuValue * 10) / 10],
          min: Math.min(...previous.metrics.cpu.history, newCpuValue),
          max: Math.max(...previous.metrics.cpu.history, newCpuValue)
        },
        memory: {
          current: Math.round(newMemValue * 10) / 10,
          history: [...previous.metrics.memory.history.slice(-59), Math.round(newMemValue * 10) / 10],
          min: Math.min(...previous.metrics.memory.history, newMemValue),
          max: Math.max(...previous.metrics.memory.history, newMemValue)
        },
        disk: {
          current: Math.round(newDiskValue * 10) / 10,
          history: [...previous.metrics.disk.history.slice(-59), Math.round(newDiskValue * 10) / 10],
          min: Math.min(...previous.metrics.disk.history, newDiskValue),
          max: Math.max(...previous.metrics.disk.history, newDiskValue)
        },
        network: {
          current: Math.round(newNetValue * 10) / 10,
          history: [...previous.metrics.network.history.slice(-59), Math.round(newNetValue * 10) / 10],
          min: Math.min(...previous.metrics.network.history, newNetValue),
          max: Math.max(...previous.metrics.network.history, newNetValue)
        }
      }
    };
    
    if (chance(5)) {
      const pipelineToUpdate = randomBetween(0, updatedData.pipelines.length - 1);
      const newStatus = ['success', 'building', 'failed', 'unstable'][randomBetween(0, 3)] as 'success' | 'building' | 'failed' | 'unstable';
      
      updatedData.pipelines[pipelineToUpdate] = {
        ...updatedData.pipelines[pipelineToUpdate],
        status: newStatus,
        lastRun: new Date().toISOString()
      };
      
      updatedData.pipelines[pipelineToUpdate].stages = updatedData.pipelines[pipelineToUpdate].stages.map((stage, idx) => {
        let status: 'success' | 'building' | 'failed' | 'pending' | 'skipped' = 'pending';
        
        if (newStatus === 'building') {
          if (idx < randomBetween(0, updatedData.pipelines[pipelineToUpdate].stages.length - 1)) {
            status = 'success';
          } else if (idx === randomBetween(0, updatedData.pipelines[pipelineToUpdate].stages.length - 1)) {
            status = 'building';
          } else {
            status = 'pending';
          }
        } else if (newStatus === 'failed') {
          const failedStage = randomBetween(0, updatedData.pipelines[pipelineToUpdate].stages.length - 1);
          if (idx < failedStage) {
            status = 'success';
          } else if (idx === failedStage) {
            status = 'failed';
          } else {
            status = 'skipped';
          }
        } else if (newStatus === 'success') {
          status = 'success';
        } else if (newStatus === 'unstable') {
          status = chance(30) ? 'failed' : 'success';
        }
        
        return {
          ...stage,
          status
        };
      });
    }
    
    if (chance(10)) {
      const containerToUpdate = randomBetween(0, updatedData.containers.length - 1);
      const newStatus = ['running', 'stopped', 'restarting', 'exited'][randomBetween(0, 3)] as 'running' | 'stopped' | 'restarting' | 'exited';
      const newHealth = ['healthy', 'unhealthy', 'starting'][randomBetween(0, 2)] as 'healthy' | 'unhealthy' | 'starting';
      
      updatedData.containers[containerToUpdate] = {
        ...updatedData.containers[containerToUpdate],
        status: newStatus,
        health: newStatus === 'running' ? newHealth : 'unhealthy',
        restarts: newStatus === 'restarting' 
          ? updatedData.containers[containerToUpdate].restarts + 1 
          : updatedData.containers[containerToUpdate].restarts
      };
    }
    
    updatedData.servers = updatedData.servers.map(server => {
      return {
        ...server,
        cpu: Math.round(randomWalk(server.cpu, 0, 100, 10)),
        memory: Math.round(randomWalk(server.memory, 0, 100, 5)),
        disk: Math.round(randomWalk(server.disk, 0, 100, 2)),
        status: server.status === 'offline' && chance(20) ? 'online' : (server.status === 'online' && chance(2) ? 'offline' : server.status),
        load: [
          randomWalk(server.load[0], 0, 5, 0.3),
          randomWalk(server.load[1], 0, 5, 0.2),
          randomWalk(server.load[2], 0, 5, 0.1),
        ]
      };
    });
    
    const logServices = ['nginx', 'api', 'database', 'auth-service', 'worker', 'cache', 'frontend'];
    const logLevels = ['info', 'warning', 'error', 'debug'];
    const randomService = logServices[randomBetween(0, logServices.length - 1)];
    const randomLevel = logLevels[randomBetween(0, logLevels.length - 1)] as 'info' | 'warning' | 'error' | 'debug';
    
    let logMessage = '';
    if (randomLevel === 'info') {
      const infoMessages = [
        'Request processed successfully',
        'User logged in',
        'Cache refreshed',
        'Scheduled task completed',
        'Configuration reloaded'
      ];
      logMessage = infoMessages[randomBetween(0, infoMessages.length - 1)];
    } else if (randomLevel === 'warning') {
      const warnMessages = [
        'High memory usage detected',
        'Slow database query',
        'Rate limit approaching',
        'Connection pool nearing capacity',
        'Stale cache entries detected'
      ];
      logMessage = warnMessages[randomBetween(0, warnMessages.length - 1)];
    } else if (randomLevel === 'error') {
      const errorMessages = [
        'Database connection failed',
        'API request timeout',
        'Authentication failure',
        'Permission denied for resource',
        'Invalid configuration parameter'
      ];
      logMessage = errorMessages[randomBetween(0, errorMessages.length - 1)];
    } else {
      const debugMessages = [
        'Request payload: {"id":123,"status":"pending"}',
        'Connection pool stats: active=5, idle=10, waiting=0',
        'Cache hit ratio: 78.3%',
        'Processing request POST /api/v1/users',
        'Initializing module'
      ];
      logMessage = debugMessages[randomBetween(0, debugMessages.length - 1)];
    }
    
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: randomLevel,
      service: randomService,
      message: logMessage
    };
    
    updatedData.logs = [newLog, ...updatedData.logs.slice(0, 99)];
    
    return updatedData;
  }
  
  const initialCpuValue = randomBetween(20, 60);
  const initialMemValue = randomBetween(30, 70);
  const initialDiskValue = randomBetween(40, 80);
  const initialNetValue = randomBetween(1, 8);
  
  const generateHistory = (current: number, len: number, min: number, max: number, variation: number) => {
    let value = current;
    const history = [];
    
    for (let i = 0; i < len; i++) {
      history.unshift(Math.round(value * 10) / 10);
      value = randomWalk(value, min, max, variation);
    }
    
    return history;
  };
  
  const cpuHistory = generateHistory(initialCpuValue, 60, 0, 100, 5);
  const memHistory = generateHistory(initialMemValue, 60, 0, 100, 3);
  const diskHistory = generateHistory(initialDiskValue, 60, 0, 100, 1);
  const netHistory = generateHistory(initialNetValue, 60, 0.1, 15, 1);
  
  return {
    pipelines: [
      {
        id: '1',
        name: 'Main Application Build',
        status: 'success',
        lastRun: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        duration: '4m 52s',
        branch: 'main',
        stages: [
          { name: 'Checkout', status: 'success', duration: '5s' },
          { name: 'Install Dependencies', status: 'success', duration: '1m 24s' },
          { name: 'Test', status: 'success', duration: '1m 12s' },
          { name: 'Build', status: 'success', duration: '1m 45s' },
          { name: 'Deploy', status: 'success', duration: '26s' }
        ]
      },
      {
        id: '2',
        name: 'API Service Pipeline',
        status: 'building',
        lastRun: new Date().toISOString(),
        duration: '3m 10s',
        branch: 'develop',
        stages: [
          { name: 'Checkout', status: 'success', duration: '4s' },
          { name: 'Install Dependencies', status: 'success', duration: '1m 5s' },
          { name: 'Test', status: 'success', duration: '45s' },
          { name: 'Build', status: 'building', duration: '1m 16s' },
          { name: 'Deploy', status: 'pending', duration: '0s' }
        ]
      },
      {
        id: '3',
        name: 'Database Migration',
        status: 'failed',
        lastRun: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        duration: '2m 12s',
        branch: 'feature/db-update',
        stages: [
          { name: 'Checkout', status: 'success', duration: '3s' },
          { name: 'Validate Schema', status: 'success', duration: '15s' },
          { name: 'Run Migrations', status: 'failed', duration: '1m 54s' },
          { name: 'Integration Tests', status: 'skipped', duration: '0s' },
          { name: 'Documentation', status: 'skipped', duration: '0s' }
        ]
      },
      {
        id: '4',
        name: 'Frontend Release',
        status: 'unstable',
        lastRun: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        duration: '6m 34s',
        branch: 'release/v2.1.0',
        stages: [
          { name: 'Checkout', status: 'success', duration: '5s' },
          { name: 'Install Dependencies', status: 'success', duration: '1m 10s' },
          { name: 'Lint', status: 'success', duration: '32s' },
          { name: 'Test', status: 'success', duration: '2m 15s' },
          { name: 'E2E Tests', status: 'failed', duration: '1m 22s' },
          { name: 'Build', status: 'success', duration: '1m 10s' }
        ]
      }
    ],
    containers: [
      {
        id: 'c1',
        name: 'api-gateway',
        image: 'nginx:alpine',
        status: 'running',
        health: 'healthy',
        cpu: 12,
        memory: 23,
        uptime: '45d 12h',
        restarts: 1,
        ports: [
          { host: '80', container: '80', protocol: 'tcp' },
          { host: '443', container: '443', protocol: 'tcp' }
        ],
        volumes: [
          { host: '/etc/nginx/conf.d', container: '/etc/nginx/conf.d' },
          { host: '/var/log/nginx', container: '/var/log/nginx' }
        ],
        networks: ['frontend', 'backend'],
        environment: ['NGINX_HOST=example.com', 'NGINX_PORT=80']
      },
      {
        id: 'c2',
        name: 'backend-api',
        image: 'backend:latest',
        status: 'running',
        health: 'healthy',
        cpu: 35,
        memory: 48,
        uptime: '12d 5h',
        restarts: 0,
        ports: [
          { host: '8080', container: '8080', protocol: 'tcp' }
        ],
        volumes: [
          { host: '/data/api', container: '/app/data' }
        ],
        networks: ['backend', 'database'],
        environment: ['NODE_ENV=production', 'PORT=8080', 'DB_HOST=postgres-db']
      },
      {
        id: 'c3',
        name: 'redis-cache',
        image: 'redis:7',
        status: 'running',
        health: 'healthy',
        cpu: 8,
        memory: 15,
        uptime: '45d 12h',
        restarts: 0,
        ports: [
          { host: '6379', container: '6379', protocol: 'tcp' }
        ],
        volumes: [
          { host: '/data/redis', container: '/data' }
        ],
        networks: ['backend', 'cache'],
        environment: ['REDIS_PASSWORD=secret', 'REDIS_AOF=yes']
      },
      {
        id: 'c4',
        name: 'postgres-db',
        image: 'postgres:15',
        status: 'running',
        health: 'healthy',
        cpu: 22,
        memory: 45,
        uptime: '45d 12h',
        restarts: 0,
        ports: [
          { host: '5432', container: '5432', protocol: 'tcp' }
        ],
        volumes: [
          { host: '/data/postgres', container: '/var/lib/postgresql/data' }
        ],
        networks: ['database'],
        environment: ['POSTGRES_USER=admin', 'POSTGRES_PASSWORD=secret', 'POSTGRES_DB=app']
      },
      {
        id: 'c5',
        name: 'auth-service',
        image: 'auth:1.2.0',
        status: 'restarting',
        health: 'starting',
        cpu: 0,
        memory: 5,
        uptime: '0s',
        restarts: 3,
        ports: [
          { host: '8081', container: '8081', protocol: 'tcp' }
        ],
        volumes: [],
        networks: ['backend'],
        environment: ['JWT_SECRET=supersecret', 'API_KEY=123456']
      },
      {
        id: 'c6',
        name: 'frontend',
        image: 'nginx:frontend',
        status: 'running',
        health: 'healthy',
        cpu: 5,
        memory: 12,
        uptime: '7d 3h',
        restarts: 0,
        ports: [
          { host: '3000', container: '80', protocol: 'tcp' }
        ],
        volumes: [
          { host: '/app/build', container: '/usr/share/nginx/html' }
        ],
        networks: ['frontend'],
        environment: ['NODE_ENV=production']
      },
      {
        id: 'c7',
        name: 'elasticsearch',
        image: 'elasticsearch:8.8.0',
        status: 'running',
        health: 'unhealthy',
        cpu: 87,
        memory: 92,
        uptime: '12h 40m',
        restarts: 2,
        ports: [
          { host: '9200', container: '9200', protocol: 'tcp' },
          { host: '9300', container: '9300', protocol: 'tcp' }
        ],
        volumes: [
          { host: '/data/elasticsearch', container: '/usr/share/elasticsearch/data' }
        ],
        networks: ['logging'],
        environment: ['discovery.type=single-node', 'ES_JAVA_OPTS=-Xms512m -Xmx512m', 'xpack.security.enabled=false']
      },
      {
        id: 'c8',
        name: 'monitoring-agent',
        image: 'prometheus:latest',
        status: 'running',
        health: 'healthy',
        cpu: 15,
        memory: 32,
        uptime: '45d 12h',
        restarts: 0,
        ports: [
          { host: '9090', container: '9090', protocol: 'tcp' }
        ],
        volumes: [
          { host: '/etc/prometheus', container: '/etc/prometheus' }
        ],
        networks: ['monitoring'],
        environment: ['SCRAPE_INTERVAL=15s']
      }
    ],
    servers: [
      {
        id: 's1',
        name: 'prod-app-1',
        ip: '10.0.1.4',
        status: 'online',
        cpu: 42,
        memory: 65,
        disk: 72,
        uptime: '120d 5h 22m',
        load: [1.25, 1.15, 0.92]
      },
      {
        id: 's2',
        name: 'prod-app-2',
        ip: '10.0.1.5',
        status: 'online',
        cpu: 36,
        memory: 58,
        disk: 65,
        uptime: '120d 5h 22m',
        load: [0.85, 0.92, 0.88]
      },
      {
        id: 's3',
        name: 'prod-db-1',
        ip: '10.0.1.8',
        status: 'warning',
        cpu: 78,
        memory: 82,
        disk: 91,
        uptime: '90d 12h 10m',
        load: [2.15, 1.95, 1.87]
      },
      {
        id: 's4',
        name: 'prod-cache-1',
        ip: '10.0.1.12',
        status: 'online',
        cpu: 25,
        memory: 42,
        disk: 38,
        uptime: '45d 8h 54m',
        load: [0.45, 0.52, 0.48]
      },
      {
        id: 's5',
        name: 'staging-app-1',
        ip: '10.0.2.4',
        status: 'online',
        cpu: 15,
        memory: 40,
        disk: 45,
        uptime: '15d 3h 12m',
        load: [0.35, 0.28, 0.32]
      },
      {
        id: 's6',
        name: 'staging-db-1',
        ip: '10.0.2.8',
        status: 'offline',
        cpu: 0,
        memory: 0,
        disk: 0,
        uptime: '0d 0h 0m',
        load: [0, 0, 0]
      }
    ],
    metrics: {
      cpu: {
        current: initialCpuValue,
        history: cpuHistory,
        min: Math.min(...cpuHistory),
        max: Math.max(...cpuHistory)
      },
      memory: {
        current: initialMemValue,
        history: memHistory,
        min: Math.min(...memHistory),
        max: Math.max(...memHistory)
      },
      disk: {
        current: initialDiskValue,
        history: diskHistory,
        min: Math.min(...diskHistory),
        max: Math.max(...diskHistory)
      },
      network: {
        current: initialNetValue,
        history: netHistory,
        min: Math.min(...netHistory),
        max: Math.max(...netHistory)
      }
    },
    logs: Array(50).fill(null).map((_, idx) => {
      const logTime = new Date(Date.now() - 1000 * 60 * (50 - idx) / 5);
      const services = ['nginx', 'api', 'database', 'auth-service', 'worker', 'cache', 'frontend'];
      const levels = ['info', 'warning', 'error', 'debug'];
      const level = levels[Math.floor(Math.random() * levels.length)] as 'info' | 'warning' | 'error' | 'debug';
      
      let message = '';
      if (level === 'info') {
        const messages = ['Request processed', 'User logged in', 'Cache refreshed', 'Task completed'];
        message = messages[Math.floor(Math.random() * messages.length)];
      } else if (level === 'warning') {
        const messages = ['High memory usage', 'Slow query detected', 'Rate limit reached'];
        message = messages[Math.floor(Math.random() * messages.length)];
      } else if (level === 'error') {
        const messages = ['Connection failed', 'Timeout error', 'Authentication failed'];
        message = messages[Math.floor(Math.random() * messages.length)];
      } else {
        const messages = ['Processing request', 'Checking cache', 'Validating input'];
        message = messages[Math.floor(Math.random() * messages.length)];
      }
      
      return {
        id: `log-${idx}`,
        timestamp: logTime.toISOString(),
        level: level,
        service: services[Math.floor(Math.random() * services.length)],
        message
      };
    }),
    alerts: [
      {
        id: 'a1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        type: 'error',
        message: 'Database connection pool exhausted',
        acknowledged: false
      },
      {
        id: 'a2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        type: 'warning',
        message: 'API response time above threshold',
        acknowledged: false
      },
      {
        id: 'a3',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        type: 'warning',
        message: 'High memory usage on prod-db-1',
        acknowledged: true
      },
      {
        id: 'a4',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        type: 'error',
        message: 'Pipeline failure: Database Migration',
        acknowledged: true
      },
      {
        id: 'a5',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        type: 'warning',
        message: 'Disk space above 85% on prod-db-1',
        acknowledged: true
      },
    ]
  };
}
