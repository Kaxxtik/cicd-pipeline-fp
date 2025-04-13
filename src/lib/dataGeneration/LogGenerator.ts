
import { LogEntry } from "@/lib/mockData";

interface LogTemplate {
  level: 'info' | 'warning' | 'error' | 'debug';
  service: string;
  templates: string[];
  variables?: Record<string, string[]>;
}

export class LogGenerator {
  private logTemplates: LogTemplate[] = [];
  private errorCorrelationTemplates: LogTemplate[] = [];
  
  constructor() {
    this.initializeTemplates();
  }
  
  private initializeTemplates() {
    // Regular log templates
    this.logTemplates = [
      {
        level: 'info',
        service: 'nginx',
        templates: [
          'Handled request {method} {path} {status}',
          'Client {ip} connected',
          'Upstream response time: {time}ms',
          'Request processed successfully'
        ],
        variables: {
          method: ['GET', 'POST', 'PUT', 'DELETE'],
          path: ['/api/v1/users', '/api/v1/products', '/api/v1/orders', '/health', '/metrics'],
          status: ['200', '201', '204', '304'],
          ip: ['192.168.1.1', '10.0.0.23', '172.16.254.1', '54.231.0.10'],
          time: ['12', '45', '87', '120', '32']
        }
      },
      {
        level: 'info',
        service: 'api',
        templates: [
          'User {userId} logged in',
          'Created resource with id {resourceId}',
          'Database query executed in {time}ms',
          'Cache hit ratio: {ratio}%'
        ],
        variables: {
          userId: ['user_123', 'admin_007', 'customer_458', 'user_781'],
          resourceId: ['res_42', 'doc_756', 'img_094', 'file_381'],
          time: ['24', '56', '84', '102', '17'],
          ratio: ['78.5', '92.1', '64.7', '88.3']
        }
      },
      {
        level: 'warning',
        service: 'api',
        templates: [
          'Slow query detected: {query} ({time}ms)',
          'Rate limit approaching for client {ip}',
          'Retrying operation after failure (attempt {attempt})',
          'High latency detected on endpoint {endpoint}'
        ],
        variables: {
          query: ['SELECT * FROM users', 'UPDATE orders SET status = "processed"', 'JOIN large_table ON id'],
          time: ['450', '612', '783', '924'],
          ip: ['192.168.1.1', '10.0.0.23', '172.16.254.1', '54.231.0.10'],
          attempt: ['2', '3', '4'],
          endpoint: ['/api/v1/reports', '/api/v1/analytics', '/api/v1/search']
        }
      },
      {
        level: 'error',
        service: 'api',
        templates: [
          'Database connection failed: {error}',
          'Unhandled exception in request handler: {error}',
          'Failed to process request: {error}',
          'Authentication failed for user {userId}'
        ],
        variables: {
          error: [
            'Connection timeout', 
            'No route to host',
            'Out of memory',
            'Permission denied',
            'Invalid input syntax'
          ],
          userId: ['user_123', 'admin_007', 'customer_458', 'user_781']
        }
      },
      {
        level: 'debug',
        service: 'api',
        templates: [
          'Request payload: {payload}',
          'Response body: {response}',
          'Headers: {headers}',
          'Session data: {session}'
        ],
        variables: {
          payload: [
            '{"id":123,"action":"update"}',
            '{"filter":{"status":"active"}}',
            '{"user":{"name":"John","role":"admin"}}'
          ],
          response: [
            '{"status":"success","data":[...]}',
            '{"error":null,"results":{"count":42}}',
            '{"message":"Operation completed"}'
          ],
          headers: [
            'Content-Type: application/json, Authorization: Bearer jwt...',
            'X-Request-ID: req-123, User-Agent: Mozilla...',
            'Accept: */*, Cache-Control: no-cache'
          ],
          session: [
            '{"user":{"id":123},"permissions":["read","write"]}',
            '{"authenticated":true,"expires":"2023-12-01T00:00:00Z"}',
            '{"locale":"en-US","theme":"dark"}'
          ]
        }
      },
      {
        level: 'info',
        service: 'database',
        templates: [
          'Connected to database {dbName}',
          'Query executed successfully in {time}ms',
          'Transaction completed',
          'Indexes updated'
        ],
        variables: {
          dbName: ['main', 'users', 'products', 'analytics'],
          time: ['31', '67', '94', '106', '22']
        }
      },
      {
        level: 'warning',
        service: 'database',
        templates: [
          'Slow query detected: {time}ms',
          'High connection pool usage: {usage}%',
          'Table {table} approaching size limit',
          'Deadlock detected and resolved'
        ],
        variables: {
          time: ['450', '612', '783', '924'],
          usage: ['85', '87', '92', '95'],
          table: ['users', 'orders', 'products', 'audit_log']
        }
      },
      {
        level: 'info',
        service: 'cache',
        templates: [
          'Cache hit for key {key}',
          'Cache miss for key {key}',
          'Cache eviction: {count} items',
          'Cache size: {size}MB'
        ],
        variables: {
          key: ['user:123', 'product:456', 'settings', 'menu:main'],
          count: ['5', '12', '27', '41'],
          size: ['256', '384', '512', '640']
        }
      }
    ];
    
    // Error correlation templates - used when metrics trigger events
    this.errorCorrelationTemplates = [
      {
        level: 'error',
        service: 'api',
        templates: [
          'Service unhealthy: CPU usage at {value}%',
          'Request timed out due to high system load',
          'Process terminated unexpectedly due to OOM',
          'Health check failed: system overloaded'
        ],
        variables: {
          value: ['92', '95', '97', '99']
        }
      },
      {
        level: 'error',
        service: 'database',
        templates: [
          'Database connection pool exhausted',
          'Query failed due to timeout',
          'Disk I/O performance degraded',
          'Out of memory error in query execution'
        ]
      },
      {
        level: 'error',
        service: 'cache',
        templates: [
          'Cache server disconnected',
          'Memory limit reached, entries evicted',
          'Failed to store object: out of memory',
          'Cache service restarting due to high memory pressure'
        ]
      },
      {
        level: 'error',
        service: 'auth-service',
        templates: [
          'Authentication service unresponsive',
          'Failed to validate tokens: service overloaded',
          'Connection pool limit reached',
          'Auth service scaling up due to high load'
        ]
      }
    ];
  }
  
  private parseTemplate(template: string, variables?: Record<string, string[]>): string {
    if (!variables) return template;
    
    return template.replace(/{(\w+)}/g, (match, variable) => {
      if (variables[variable]) {
        const values = variables[variable];
        return values[Math.floor(Math.random() * values.length)];
      }
      return match;
    });
  }
  
  public generateRandomLog(): LogEntry {
    // Pick a random template
    const template = this.logTemplates[Math.floor(Math.random() * this.logTemplates.length)];
    const messageTemplate = template.templates[Math.floor(Math.random() * template.templates.length)];
    
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: template.level,
      service: template.service,
      message: this.parseTemplate(messageTemplate, template.variables)
    };
  }
  
  public generateCorrelatedErrorLog(metricType: string, value: number): LogEntry | null {
    // Only generate error logs when values are high
    if (
      (metricType === 'cpu' && value < 85) ||
      (metricType === 'memory' && value < 85) ||
      (metricType === 'disk' && value < 90) ||
      (metricType === 'network' && value < 12)
    ) {
      return null;
    }
    
    // Pick a random error template
    const template = this.errorCorrelationTemplates[Math.floor(Math.random() * this.errorCorrelationTemplates.length)];
    const messageTemplate = template.templates[Math.floor(Math.random() * template.templates.length)];
    
    const variables: Record<string, string[]> = {
      ...template.variables,
      value: [value.toString()]
    };
    
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'error',
      service: template.service,
      message: this.parseTemplate(messageTemplate, variables)
    };
  }
}
