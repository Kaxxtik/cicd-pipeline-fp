
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Wifi,
  ChevronDown,
  RefreshCw
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
  Line
} from "recharts";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

export function MetricsModule() {
  const { data, refreshRate, setRefreshRate } = useDashboardContext();
  const [timeRange, setTimeRange] = useState(TIME_RANGES[0]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
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
      </CardContent>
    </Card>
  );
}
