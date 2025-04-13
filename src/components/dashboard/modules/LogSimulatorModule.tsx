import { useState, useEffect, useRef } from "react";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Terminal, 
  Play,
  Pause,
  Filter,
  RefreshCw,
  Sliders,
  Clock,
  Info,
  AlertTriangle,
  AlertCircle,
  X,
  Code,
  CheckCircle2,
  Server,
  Database,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInterval } from "@/hooks/useInterval";
import { toast } from "sonner";

// Define log types and services for simulation
type LogLevel = 'info' | 'warning' | 'error' | 'debug' | 'success';
type LogService = 'api' | 'auth' | 'database' | 'frontend' | 'cache' | 'system' | 'security';

interface SimulatedLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  service: LogService;
  message: string;
  details?: string;
}

export function LogSimulatorModule() {
  const { logUpdateRate, setLogUpdateRate } = useDashboardContext();
  const [logs, setLogs] = useState<SimulatedLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [filterLevel, setFilterLevel] = useState<LogLevel | null>(null);
  const [filterService, setFilterService] = useState<LogService | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const maxLogs = 100; // Maximum number of logs to keep
  
  // Configuration for realistic log patterns
  const logPatterns = {
    info: [
      "Request processed successfully for user {userId}",
      "Cache refreshed for {service} data",
      "New user registered: {userId}",
      "Payment processed successfully: ${amount}",
      "Background job completed in {time}ms",
      "Session started for user {userId}",
      "Configuration reloaded for {service}",
      "Health check passed for {service}"
    ],
    warning: [
      "High memory usage detected: {memory}%",
      "Slow database query: {query} took {time}ms",
      "Rate limit approaching for client {clientId}",
      "API request rate high for endpoint {endpoint}",
      "Deprecated API call from client {clientId}",
      "Stale cache entries detected for {service}",
      "Unusual traffic pattern detected from {ip}",
      "Connection pool nearing capacity: {current}/{max}"
    ],
    error: [
      "Database connection failed: {errCode}",
      "API request timeout after {time}ms",
      "Authentication failure for user {userId}",
      "Failed to process payment: {errorMessage}",
      "Permission denied for resource {resource}",
      "Service {service} unavailable",
      "Memory limit exceeded for process {process}",
      "Unhandled exception in {method}: {errorMessage}"
    ],
    debug: [
      "Request payload: {payload}",
      "Response time: {time}ms for {endpoint}",
      "Cache hit ratio: {ratio}%",
      "Connection pool stats: active={active}, idle={idle}, waiting={waiting}",
      "Processing request {method} {url}",
      "Session data: {sessionData}",
      "Database query execution plan: {plan}",
      "API call trace: {trace}"
    ],
    success: [
      "Deployment completed successfully",
      "Database migration complete: {time}ms",
      "Backup completed successfully",
      "Service {service} started successfully",
      "API integration test passed",
      "Cache optimization completed: {improvement}% improvement",
      "System update applied successfully",
      "Auto-scaling complete: {nodes} nodes added"
    ]
  };
  
  const servicePatterns: Record<LogService, string[]> = {
    api: [
      "GET /api/v1/users",
      "POST /api/v1/orders",
      "PUT /api/v1/products/{id}",
      "DELETE /api/v1/comments/{id}",
      "API rate limit config updated",
      "API gateway routing table refreshed",
      "REST endpoint response time"
    ],
    auth: [
      "Login attempt for user {userId}",
      "Password reset requested",
      "Token verification",
      "User permissions updated",
      "OAuth callback from provider {provider}",
      "MFA challenge issued",
      "Session token refreshed"
    ],
    database: [
      "Query optimization completed",
      "Index rebuild scheduled",
      "Connection pool resized",
      "Transaction rollback",
      "Slow query detected",
      "Replication lag",
      "Schema migration"
    ],
    frontend: [
      "Asset compilation complete",
      "Client-side error reported",
      "UI rendering performance",
      "User interaction tracking",
      "Bundle size optimization",
      "Frontend cache invalidation",
      "CSP violation report"
    ],
    cache: [
      "Cache hit ratio: {ratio}%",
      "Cache eviction policy triggered",
      "Redis master/slave sync",
      "Memory pressure detected",
      "Cache invalidation for key pattern {pattern}",
      "Cache warming completed",
      "Distributed cache consensus"
    ],
    system: [
      "System load average: {load}",
      "Disk space usage: {usage}%",
      "Network interface throughput",
      "Process {pid} memory usage",
      "Scheduled maintenance starting",
      "Host metrics collection",
      "System time synchronized"
    ],
    security: [
      "Suspicious login attempt from {ip}",
      "Firewall rule updated",
      "Rate limiting applied to {ip}",
      "Security scan completed",
      "Potential SQL injection attempt",
      "TLS certificate renewal",
      "WAF blocked request"
    ]
  };
  
  // Generate a random IP address
  const randomIP = () => {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  };
  
  // Generate a random user ID
  const randomUserId = () => {
    return `user_${Math.floor(Math.random() * 10000)}`;
  };
  
  // Generate a random client ID
  const randomClientId = () => {
    return `client_${Math.floor(Math.random() * 1000)}`;
  };
  
  // Generate a random amount between 1.00 and 999.99
  const randomAmount = () => {
    return (Math.random() * 999 + 1).toFixed(2);
  };
  
  // Generate a random time between 10ms and 5000ms
  const randomTime = () => {
    return Math.floor(Math.random() * 4990 + 10);
  };
  
  // Generate random execution stats
  const randomStats = () => {
    const active = Math.floor(Math.random() * 20 + 1);
    const idle = Math.floor(Math.random() * 30 + 5);
    const waiting = Math.floor(Math.random() * 10);
    return { active, idle, waiting };
  };
  
  // Generate random ratio between 50% and 100%
  const randomRatio = () => {
    return Math.floor(Math.random() * 50 + 50);
  };
  
  // Generate a random service name
  const randomService = () => {
    const services = ["users-api", "auth-service", "payment-processor", "notification-service", "data-aggregator", "recommendation-engine"];
    return services[Math.floor(Math.random() * services.length)];
  };
  
  // Replace placeholders in log messages with realistic values
  const formatLogMessage = (message: string): string => {
    return message
      .replace(/{userId}/g, randomUserId())
      .replace(/{clientId}/g, randomClientId())
      .replace(/{ip}/g, randomIP())
      .replace(/{amount}/g, randomAmount())
      .replace(/{time}/g, randomTime().toString())
      .replace(/{memory}/g, Math.floor(Math.random() * 40 + 60).toString())
      .replace(/{service}/g, randomService())
      .replace(/{ratio}/g, randomRatio().toString())
      .replace(/{improvement}/g, Math.floor(Math.random() * 30 + 10).toString())
      .replace(/{nodes}/g, Math.floor(Math.random() * 5 + 1).toString())
      .replace(/{method}/g, ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)])
      .replace(/{endpoint}/g, ["/api/users", "/api/products", "/api/orders", "/api/auth"][Math.floor(Math.random() * 4)])
      .replace(/{provider}/g, ["Google", "Facebook", "Twitter", "GitHub"][Math.floor(Math.random() * 4)])
      .replace(/{load}/g, (Math.random() * 4 + 0.1).toFixed(2))
      .replace(/{usage}/g, Math.floor(Math.random() * 60 + 20).toString())
      .replace(/{pid}/g, Math.floor(Math.random() * 10000 + 1000).toString())
      .replace(/{errCode}/g, ["ERR_CONNECTION_REFUSED", "ERR_TIMEOUT", "ERR_AUTH_FAILED"][Math.floor(Math.random() * 3)])
      .replace(/{errorMessage}/g, ["Unexpected EOF", "Invalid input", "Resource not found", "Connection reset"][Math.floor(Math.random() * 4)])
      .replace(/{query}/g, ["SELECT * FROM users", "UPDATE products SET price", "INSERT INTO orders"][Math.floor(Math.random() * 3)])
      .replace(/{resource}/g, ["/api/admin", "/api/reports", "/api/payments"][Math.floor(Math.random() * 3)])
      .replace(/{process}/g, ["web-server", "worker", "cron-job"][Math.floor(Math.random() * 3)])
      .replace(/{method}/g, ["UserController.authenticate", "PaymentService.process", "DataRepository.query"][Math.floor(Math.random() * 3)])
      .replace(/{url}/g, ["/api/v1/users?limit=50", "/api/v1/orders/status", "/api/v1/products/featured"][Math.floor(Math.random() * 3)])
      .replace(/{plan}/g, ["IndexScan on users", "HashJoin on orders", "TableScan on products"][Math.floor(Math.random() * 3)])
      .replace(/{trace}/g, ["Gateway -> Auth -> Database", "Frontend -> API -> Cache", "Webhook -> Queue -> Worker"][Math.floor(Math.random() * 3)])
      .replace(/{pattern}/g, ["user:*", "product:featured:*", "session:*"][Math.floor(Math.random() * 3)]);
  };

  // Generate random log details for expandable view
  const generateLogDetails = (log: SimulatedLog): string => {
    const details = [];
    
    details.push(`Timestamp: ${log.timestamp.toISOString()}`);
    details.push(`Level: ${log.level.toUpperCase()}`);
    details.push(`Service: ${log.service}`);
    
    if (log.service === 'api') {
      details.push(`Request ID: req_${Math.random().toString(36).substring(2, 10)}`);
      details.push(`Method: ${["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)]}`);
      details.push(`Path: /api/v1/${["users", "products", "orders", "comments"][Math.floor(Math.random() * 4)]}`);
      details.push(`Status: ${[200, 201, 400, 401, 403, 404, 500][Math.floor(Math.random() * 7)]}`);
      details.push(`Response Time: ${randomTime()}ms`);
      details.push(`IP Address: ${randomIP()}`);
    } else if (log.service === 'database') {
      details.push(`Query ID: qry_${Math.random().toString(36).substring(2, 10)}`);
      details.push(`Database: ${["users", "products", "transactions", "analytics"][Math.floor(Math.random() * 4)]}`);
      details.push(`Execution Time: ${randomTime()}ms`);
      details.push(`Rows Affected: ${Math.floor(Math.random() * 1000)}`);
      details.push(`Connection Pool: ${randomStats().active}/${randomStats().idle}/${randomStats().waiting}`);
    } else if (log.service === 'auth') {
      details.push(`User ID: ${randomUserId()}`);
      details.push(`Session ID: sess_${Math.random().toString(36).substring(2, 10)}`);
      details.push(`IP Address: ${randomIP()}`);
      details.push(`User Agent: ${["Chrome/98.0.4758", "Firefox/97.0", "Safari/15.3", "Edge/98.0.1108"][Math.floor(Math.random() * 4)]}`);
    }
    
    // Add stack trace for errors
    if (log.level === 'error') {
      details.push('');
      details.push('Stack Trace:');
      details.push(`  at ${log.service}Service.process (${log.service}.js:${Math.floor(Math.random() * 500) + 100}:${Math.floor(Math.random() * 50) + 10})`);
      details.push(`  at RequestHandler.handleRequest (handler.js:${Math.floor(Math.random() * 300) + 50}:${Math.floor(Math.random() * 30) + 5})`);
      details.push(`  at processTicksAndRejections (internal/process/task_queues.js:${Math.floor(Math.random() * 100) + 50}:${Math.floor(Math.random() * 20) + 5})`);
    }
    
    return details.join('\n');
  };
  
  // Generate a new log entry
  const generateLog = (): SimulatedLog => {
    // Define probabilities for different log levels
    const levelProbabilities: [LogLevel, number][] = [
      ['info', 0.6],     // 60% chance for info logs
      ['warning', 0.15], // 15% chance for warning logs
      ['error', 0.1],    // 10% chance for error logs
      ['debug', 0.1],    // 10% chance for debug logs
      ['success', 0.05]  // 5% chance for success logs
    ];
    
    // Select a random log level based on probabilities
    let randomNum = Math.random();
    let level: LogLevel = 'info';
    
    for (const [lvl, prob] of levelProbabilities) {
      if (randomNum < prob) {
        level = lvl;
        break;
      }
      randomNum -= prob;
    }
    
    // Select a random service
    const services: LogService[] = ['api', 'auth', 'database', 'frontend', 'cache', 'system', 'security'];
    const service = services[Math.floor(Math.random() * services.length)];
    
    // Get service-specific message patterns and then select from level-specific patterns
    const serviceSpecificPatterns = servicePatterns[service];
    const serviceMessage = serviceSpecificPatterns[Math.floor(Math.random() * serviceSpecificPatterns.length)];
    
    // Get level-specific message patterns
    const levelSpecificPatterns = logPatterns[level];
    const levelMessage = levelSpecificPatterns[Math.floor(Math.random() * levelSpecificPatterns.length)];
    
    // Choose between a service-specific or level-specific message
    const message = Math.random() > 0.5 ? serviceMessage : levelMessage;
    
    // Create the log entry
    const log: SimulatedLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      level,
      service,
      message: formatLogMessage(message)
    };
    
    // Generate detailed information for this log
    log.details = generateLogDetails(log);
    
    return log;
  };
  
  // Function to add log with occasional error correlation
  const addLog = () => {
    // Occasionally cluster related logs together
    const clusterLogs = Math.random() < 0.15;
    const newLogs: SimulatedLog[] = [];
    
    // Add a primary log
    const primaryLog = generateLog();
    newLogs.push(primaryLog);
    
    // Add related logs if clustering
    if (clusterLogs) {
      const relatedLogsCount = Math.floor(Math.random() * 3) + 1; // 1-3 related logs
      
      for (let i = 0; i < relatedLogsCount; i++) {
        const relatedLog = generateLog();
        // Make the related log somewhat similar to the primary log
        relatedLog.service = primaryLog.service;
        
        // If primary log is an error, escalate the sequence with related warnings/errors
        if (primaryLog.level === 'error') {
          relatedLog.level = ['warning', 'error'][Math.floor(Math.random() * 2)] as LogLevel;
          
          // Rarely trigger a toast notification for critical clusters
          if (i === 0 && Math.random() < 0.3) {
            toast.error("Critical Error Detected", {
              description: `Multiple issues detected in ${primaryLog.service} service`,
            });
          }
        }
        
        newLogs.push(relatedLog);
      }
    }
    
    // Add the new logs to the state
    setLogs(prevLogs => {
      const combined = [...newLogs, ...prevLogs];
      // Keep only the most recent logs up to maxLogs
      return combined.slice(0, maxLogs);
    });
    
    // Scroll to the bottom if auto-scroll is enabled
    if (autoScroll && scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 50);
    }
  };
  
  // Use interval to add logs at the specified rate
  useInterval(() => {
    if (isSimulating) {
      addLog();
    }
  }, logUpdateRate * 1000);
  
  // Log level icon mapping
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return <Info size={14} className="text-blue-400" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-yellow-400" />;
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />;
      case 'debug':
        return <Code size={14} className="text-emerald-400" />;
      case 'success':
        return <CheckCircle2 size={14} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  // Service icon mapping
  const getServiceIcon = (service: LogService) => {
    switch (service) {
      case 'api':
        return <Code size={14} className="text-violet-400" />;
      case 'auth':
        return <Shield size={14} className="text-blue-400" />;
      case 'database':
        return <Database size={14} className="text-amber-400" />;
      case 'system':
        return <Server size={14} className="text-emerald-400" />;
      default:
        return null;
    }
  };
  
  // Log level class mapping for styling
  const getLevelClass = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return 'text-blue-400 border-blue-400/20';
      case 'warning':
        return 'text-yellow-400 border-yellow-400/20';
      case 'error':
        return 'text-red-500 border-red-500/20';
      case 'debug':
        return 'text-emerald-400 border-emerald-400/20';
      case 'success':
        return 'text-green-500 border-green-500/20';
      default:
        return 'text-slate-400 border-slate-400/20';
    }
  };
  
  // Filter logs based on current filters and search
  const filteredLogs = logs.filter(log => {
    const matchesLevel = !filterLevel || log.level === filterLevel;
    const matchesService = !filterService || log.service === filterService;
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLevel && matchesService && matchesSearch;
  });
  
  // Add initial logs on component mount
  useEffect(() => {
    // Add some initial logs
    const initialLogs: SimulatedLog[] = [];
    for (let i = 0; i < 15; i++) {
      initialLogs.push(generateLog());
    }
    setLogs(initialLogs);
  }, []);
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Terminal size={18} />
            <span>Log Simulator</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Clock size={14} />
              <span>Refresh Rate:</span>
              <select
                value={logUpdateRate}
                onChange={(e) => setLogUpdateRate(Number(e.target.value))}
                className="bg-slate-800 border-none rounded px-2 py-1 text-slate-200"
              >
                <option value="0.5">0.5s</option>
                <option value="1">1s</option>
                <option value="2">2s</option>
                <option value="5">5s</option>
                <option value="10">10s</option>
              </select>
            </div>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                "p-1.5 rounded-md hover:bg-slate-800 transition-colors",
                isSimulating ? "text-emerald-400" : "text-slate-400"
              )}
              title={isSimulating ? "Pause simulation" : "Start simulation"}
            >
              {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={cn(
                "p-1.5 rounded-md hover:bg-slate-800 transition-colors",
                autoScroll ? "text-blue-400" : "text-slate-400"
              )}
              title={autoScroll ? "Disable auto-scroll" : "Enable auto-scroll"}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Filter size={14} />
                <span>Level:</span>
              </div>
              {['info', 'warning', 'error', 'debug', 'success'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(filterLevel === level as LogLevel ? null : level as LogLevel)}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border",
                    filterLevel === level 
                      ? getLevelClass(level as LogLevel) 
                      : "border-slate-700 text-slate-400 hover:bg-slate-800"
                  )}
                >
                  {getLevelIcon(level as LogLevel)}
                  <span>{level}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Filter size={14} />
                <span>Service:</span>
              </div>
              <select
                value={filterService || ""}
                onChange={(e) => setFilterService(e.target.value as LogService || null)}
                className="bg-slate-800 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Services</option>
                <option value="api">API</option>
                <option value="auth">Auth</option>
                <option value="database">Database</option>
                <option value="frontend">Frontend</option>
                <option value="cache">Cache</option>
                <option value="system">System</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        
        <div 
          className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/30"
          style={{ height: '500px' }}
        >
          <div className="flex items-center justify-between p-2 bg-slate-800/50 text-xs font-mono border-b border-slate-700">
            <div className="flex items-center gap-1.5">
              <Terminal size={14} className="text-slate-400" />
              <span className="text-slate-300">system_logs</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>{filteredLogs.length} entries</span>
              <button 
                onClick={() => setLogs([])}
                className="hover:text-slate-200"
                title="Clear logs"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          
          <div 
            className="p-2 font-mono text-xs overflow-auto h-[455px]" 
            ref={scrollAreaRef}
            style={{ scrollBehavior: "smooth" }}
          >
            {filteredLogs.length > 0 ? (
              <div className="space-y-1.5">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="group">
                    <div 
                      className={cn(
                        "p-1.5 rounded flex items-start gap-2 hover:bg-slate-800/40 cursor-pointer",
                        showDetails === log.id ? "bg-slate-800/50" : ""
                      )}
                      onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getLevelIcon(log.level)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-slate-400">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <div className={cn(
                            "px-1.5 py-0.5 rounded-sm text-[10px] uppercase font-semibold tracking-wider",
                            {
                              'bg-blue-500/10 text-blue-400': log.level === 'info',
                              'bg-yellow-500/10 text-yellow-400': log.level === 'warning',
                              'bg-red-500/10 text-red-500': log.level === 'error',
                              'bg-emerald-500/10 text-emerald-400': log.level === 'debug',
                              'bg-green-500/10 text-green-500': log.level === 'success'
                            }
                          )}>
                            {log.level}
                          </div>
                          <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-slate-800 rounded-sm text-[10px]">
                            {getServiceIcon(log.service)}
                            <span className="text-slate-300">{log.service}</span>
                          </div>
                        </div>
                        <div className="text-slate-200 break-words" style={{ wordBreak: 'break-word' }}>
                          {log.message}
                        </div>
                      </div>
                    </div>
                    
                    {showDetails === log.id && (
                      <div className="mt-1 ml-6 p-2 bg-slate-800/30 border-l-2 border-slate-700 rounded-sm">
                        <pre className="whitespace-pre-wrap text-slate-300 text-[10px]">
                          {log.details}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                No logs matching current filters
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-slate-400 mb-1">Custom Log Input</div>
          <div className="flex gap-2">
            <Textarea 
              placeholder="Enter a custom log message to add to the stream..."
              className="bg-slate-800 border-slate-700 text-slate-200 text-xs font-mono resize-none h-16"
            />
            <div className="flex flex-col gap-1">
              <select className="bg-slate-800 border-slate-700 text-slate-300 text-xs rounded px-2 py-1 h-8">
                <option value="info">INFO</option>
                <option value="warning">WARNING</option>
                <option value="error">ERROR</option>
                <option value="debug">DEBUG</option>
                <option value="success">SUCCESS</option>
              </select>
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs h-8 px-3 rounded">
                Add Log
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
