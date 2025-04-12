
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Wifi,
  ChevronDown,
  RefreshCw,
  LineChart as LineChartIcon,
  BarChartHorizontal,
  Terminal,
  Code,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TIME_RANGES = [
  { label: '1 hour', value: 60, interval: 5 },
  { label: '6 hours', value: 360, interval: 30 },
  { label: '24 hours', value: 1440, interval: 120 },
  { label: '7 days', value: 10080, interval: 1440 },
];

const METRICS_OPTIONS = [
  { label: 'CPU Usage', value: 'cpu', color: 'chart-blue', unit: '%', icon: Cpu },
  { label: 'Memory Usage', value: 'memory', color: 'chart-purple', unit: '%', icon: MemoryStick },
  { label: 'Disk Usage', value: 'disk', color: 'chart-green', unit: '%', icon: HardDrive },
  { label: 'Network I/O', value: 'network', color: 'chart-yellow', unit: 'MB/s', icon: Wifi },
];

// Prometheus-style metric names
const PROMETHEUS_METRICS = [
  'node_cpu_seconds_total{cpu="0",mode="idle"}',
  'node_memory_MemAvailable_bytes',
  'node_filesystem_avail_bytes{mountpoint="/"}',
  'node_network_receive_bytes_total{device="eth0"}',
  'node_network_transmit_bytes_total{device="eth0"}',
  'process_resident_memory_bytes{job="api-server"}',
  'http_requests_total{method="GET",status="200"}',
  'http_request_duration_seconds{quantile="0.99"}',
];

// Response times for different services
const generateResponseTimeData = () => {
  const services = ['api', 'auth', 'database', 'cache', 'storage'];
  return services.map(service => ({
    name: service,
    p50: Math.random() * 100,
    p90: Math.random() * 200 + 100,
    p99: Math.random() * 300 + 300,
  }));
};

// Create sample data for other metrics
const generateMetricsData = () => {
  return [
    { name: 'Requests', value: Math.floor(Math.random() * 1000) + 500 },
    { name: 'Errors', value: Math.floor(Math.random() * 50) },
    { name: 'Latency', value: Math.floor(Math.random() * 200) + 50 },
    { name: 'Users', value: Math.floor(Math.random() * 500) + 100 },
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function MetricsModule() {
  const { data, refreshRate, setRefreshRate } = useDashboardContext();
  const [timeRange, setTimeRange] = useState(TIME_RANGES[0]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("line-charts");
  const [responseTimeData, setResponseTimeData] = useState(generateResponseTimeData());
  const [metricsData, setMetricsData] = useState(generateMetricsData());
  const [prometheusValues, setPrometheusValues] = useState<Record<string, number>>(
    PROMETHEUS_METRICS.reduce((acc, metric) => {
      acc[metric] = Math.random() * 1000;
      return acc;
    }, {} as Record<string, number>)
  );
  
  // Update response time data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTimeData(generateResponseTimeData());
      setMetricsData(generateMetricsData());
      
      // Update Prometheus-style metrics
      setPrometheusValues(prev => {
        const newValues = { ...prev };
        PROMETHEUS_METRICS.forEach(metric => {
          // Apply small random change to existing values
          newValues[metric] = prev[metric] * (0.95 + Math.random() * 0.1);
        });
        return newValues;
      });
    }, refreshRate * 1000);
    
    return () => clearInterval(interval);
  }, [refreshRate]);
  
  const formatData = (metricKey: string) => {
    return data.metrics[metricKey as keyof typeof data.metrics].history.map((value, i) => ({
      time: i,
      value: value
    }));
  };

  const handleRefreshRateChange = (rate: number) => {
    setRefreshRate(rate);
    setOpenDropdown(null);
  };
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} />
            <span>Metrics & Charts</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700"
              >
                <Clock size={14} />
                <span>{timeRange.label}</span>
                <ChevronDown size={14} />
              </button>
              
              {openDropdown === 'time' && (
                <div className="absolute top-full right-0 mt-1 bg-slate-800 rounded-md shadow-lg z-10 min-w-[120px]">
                  {TIME_RANGES.map((range) => (
                    <button
                      key={range.value}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-xs hover:bg-slate-700",
                        timeRange.value === range.value ? "text-blue-400" : "text-slate-200"
                      )}
                      onClick={() => {
                        setTimeRange(range);
                        setOpenDropdown(null);
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'refresh' ? null : 'refresh')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700"
              >
                <RefreshCw size={14} />
                <span>{refreshRate}s</span>
                <ChevronDown size={14} />
              </button>
              
              {openDropdown === 'refresh' && (
                <div className="absolute top-full right-0 mt-1 bg-slate-800 rounded-md shadow-lg z-10 min-w-[100px]">
                  {[5, 10, 30, 60].map((rate) => (
                    <button
                      key={rate}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-xs hover:bg-slate-700",
                        refreshRate === rate ? "text-blue-400" : "text-slate-200"
                      )}
                      onClick={() => handleRefreshRateChange(rate)}
                    >
                      {rate}s
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="line-charts" className="flex items-center gap-1">
              <LineChartIcon size={14} />
              <span>Line Charts</span>
            </TabsTrigger>
            <TabsTrigger value="bar-charts" className="flex items-center gap-1">
              <BarChartHorizontal size={14} />
              <span>Bar Charts</span>
            </TabsTrigger>
            <TabsTrigger value="prometheus" className="flex items-center gap-1">
              <Terminal size={14} />
              <span>Prometheus</span>
            </TabsTrigger>
            <TabsTrigger value="misc" className="flex items-center gap-1">
              <Code size={14} />
              <span>Misc Metrics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="line-charts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {METRICS_OPTIONS.map((metric) => {
                const MetricIcon = metric.icon;
                const currentData = data.metrics[metric.value as keyof typeof data.metrics];
                
                return (
                  <div 
                    key={metric.value}
                    className="border border-slate-800 rounded-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-slate-800/30 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MetricIcon className={`text-${metric.color}`} size={16} />
                        <div className="font-medium">{metric.label}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-slate-400">Current:</div>
                        <div className="font-medium">
                          {currentData.current}{metric.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={formatData(metric.value)}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id={`gradient-${metric.value}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={`hsl(var(--${metric.color}))`} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={`hsl(var(--${metric.color}))`} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="time" 
                            tick={false} 
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            domain={[
                              Math.max(0, Math.floor(currentData.min - 10)), 
                              Math.ceil(currentData.max + 10)
                            ]}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickCount={5}
                            axisLine={false}
                            tickLine={false}
                          />
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-slate-900 px-3 py-2 border border-slate-700 rounded shadow-lg">
                                    <p className="text-xs font-medium">
                                      {`${payload[0].value}${metric.unit}`}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={`hsl(var(--${metric.color}))`} 
                            fillOpacity={1}
                            fill={`url(#gradient-${metric.value})`} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="border-t border-slate-800 px-4 py-2 bg-slate-900/30 text-xs text-slate-400 flex justify-between">
                      <div>Min: {currentData.min}{metric.unit}</div>
                      <div>Max: {currentData.max}{metric.unit}</div>
                      <div>Avg: {Math.round(currentData.history.reduce((a, b) => a + b, 0) / currentData.history.length)}{metric.unit}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="bar-charts" className="space-y-6">
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-slate-800/30">
                <h3 className="font-medium">Service Response Times</h3>
              </div>
              <div className="p-4 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={responseTimeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#475569' }}
                      label={{ 
                        value: 'Response Time (ms)', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: '#94a3b8',
                        fontSize: 12 
                      }} 
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 px-3 py-2 border border-slate-700 rounded shadow-lg">
                              <p className="text-sm font-medium mb-1">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
                                  {`${entry.name}: ${entry.value.toFixed(2)} ms`}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                    />
                    <Bar dataKey="p50" name="p50 (Median)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="p90" name="p90" fill="#818cf8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="p99" name="p99" fill="#e879f9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="prometheus" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal size={14} />
                  <span>Prometheus Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-xs">
                  {PROMETHEUS_METRICS.map((metric, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-800 last:border-0">
                      <span className="text-emerald-400">{metric}</span>
                      <span className="text-amber-300">
                        {prometheusValues[metric]?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(prometheusValues).slice(0, 4).map(([metric, value], idx) => (
                <div key={idx} className="bg-slate-800/30 border border-slate-800 rounded-md p-3">
                  <div className="text-xs font-mono mb-2 text-emerald-400 truncate">{metric}</div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-lg">{value.toFixed(2)}</div>
                    <Progress 
                      value={Math.min(100, (value / 1000) * 100)} 
                      className="h-2 flex-1"
                      indicatorClassName="bg-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="misc" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/30">
                  <h3 className="font-medium">Metric Distribution</h3>
                </div>
                <div className="p-4 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metricsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {metricsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 px-3 py-2 border border-slate-700 rounded shadow-lg">
                                <p className="text-xs font-medium mb-1">
                                  {payload[0].name}: {payload[0].value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/30">
                  <h3 className="font-medium">Request Rates</h3>
                </div>
                <div className="p-4 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[...Array(24)].map((_, i) => ({
                        hour: i,
                        rate: Math.random() * 100 + 50
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        label={{ value: 'Hour', position: 'insideBottom', fill: '#94a3b8', fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        label={{ value: 'Req/s', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 px-3 py-2 border border-slate-700 rounded shadow-lg">
                                <p className="text-xs font-medium">
                                  {`Hour ${label}: ${payload[0].value.toFixed(2)} req/s`}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#8884d8" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-slate-800/30">
                <h3 className="font-medium">System Load Average</h3>
              </div>
              <div className="p-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...Array(20)].map((_, i) => ({
                      time: i,
                      load1: Math.random() * 2 + 0.5,
                      load5: Math.random() * 1.5 + 1,
                      load15: Math.random() * 1 + 1.5
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      label={{ value: 'Time', position: 'insideBottom', fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      label={{ value: 'Load', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 px-3 py-2 border border-slate-700 rounded shadow-lg">
                              {payload.map((entry, index) => (
                                <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
                                  {`${entry.name}: ${entry.value.toFixed(2)}`}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="load1" name="1m" stroke="#38bdf8" dot={false} />
                    <Line type="monotone" dataKey="load5" name="5m" stroke="#818cf8" dot={false} />
                    <Line type="monotone" dataKey="load15" name="15m" stroke="#e879f9" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
