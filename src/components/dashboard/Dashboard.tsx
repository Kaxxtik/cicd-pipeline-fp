import { useEffect } from "react";
import { JenkinsPipelineModule } from "./modules/JenkinsPipelineModule";
import { DockerContainersModule } from "./modules/DockerContainersModule";
import { InfrastructureModule } from "./modules/InfrastructureModule";
import { MetricsModule } from "./modules/MetricsModule";
import { LogsModule } from "./modules/LogsModule";
import { AlertsModule } from "./modules/AlertsModule";
import { LogSimulatorModule } from "./modules/LogSimulatorModule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardContext, DashboardProvider, useDashboardContext } from "@/contexts/DashboardContext";
import { toast } from "sonner";
import { useContext } from "react";
import { 
  Zap, 
  MemoryStick, 
  HardDrive, 
  Wifi, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  Download,
  Gauge,
  Server,
  Cpu,
  BarChart3,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function DashboardContent() {
  const { 
    data,
    refreshRate,
    thresholds,
    triggerEvent
  } = useContext(DashboardContext);
  
  // On mount, show welcome toast
  useEffect(() => {
    toast.success("Dashboard loaded", {
      description: "Real-time monitoring with sophisticated data generation"
    });
  }, []);
  
  // Helper function to determine color based on value and thresholds
  const getMetricColor = (value: number, type: 'cpu' | 'memory' | 'disk' | 'network') => {
    if (value >= thresholds[type].critical) return "from-red-500 to-red-400";
    if (value >= thresholds[type].warning) return "from-amber-500 to-amber-400";
    return type === 'cpu' ? "from-blue-500 to-cyan-400" :
           type === 'memory' ? "from-purple-500 to-pink-400" :
           type === 'disk' ? "from-emerald-500 to-emerald-400" :
           "from-amber-500 to-amber-400";
  };
  
  // Format the values for display
  const formatValue = (value: number, type: 'cpu' | 'memory' | 'disk' | 'network') => {
    if (type === 'network') {
      return `${value} MB/s`;
    }
    return `${value}%`;
  };
  
  // Calculate percentage for network display
  const getNetworkPercentage = (value: number) => {
    return Math.min(value / 10 * 100, 100);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Cpu size={18} className="text-blue-400" />
                <span>CPU Usage</span>
              </span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">
                {data.metrics.cpu.current}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getMetricColor(data.metrics.cpu.current, 'cpu')} transition-all duration-500 ease-in-out`}
                  style={{ width: `${data.metrics.cpu.current}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Min</div>
                  <div className="font-medium text-white">{data.metrics.cpu.min}%</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Avg</div>
                  <div className="font-medium text-white">
                    {Math.round(data.metrics.cpu.history.reduce((a, b) => a + b, 0) / Math.max(1, data.metrics.cpu.history.length))}%
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Max</div>
                  <div className="font-medium text-white">{data.metrics.cpu.max}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="flex items-center gap-2">
                <MemoryStick size={18} className="text-purple-400" />
                <span>Memory Usage</span>
              </span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">
                {data.metrics.memory.current}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getMetricColor(data.metrics.memory.current, 'memory')} transition-all duration-500 ease-in-out`}
                  style={{ width: `${data.metrics.memory.current}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Min</div>
                  <div className="font-medium text-white">{data.metrics.memory.min}%</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Avg</div>
                  <div className="font-medium text-white">
                    {Math.round(data.metrics.memory.history.reduce((a, b) => a + b, 0) / Math.max(1, data.metrics.memory.history.length))}%
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Max</div>
                  <div className="font-medium text-white">{data.metrics.memory.max}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="flex items-center gap-2">
                <HardDrive size={18} className="text-emerald-400" />
                <span>Disk Usage</span>
              </span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">
                {data.metrics.disk.current}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getMetricColor(data.metrics.disk.current, 'disk')} transition-all duration-500 ease-in-out`}
                  style={{ width: `${data.metrics.disk.current}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Min</div>
                  <div className="font-medium text-white">{data.metrics.disk.min}%</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Avg</div>
                  <div className="font-medium text-white">
                    {Math.round(data.metrics.disk.history.reduce((a, b) => a + b, 0) / Math.max(1, data.metrics.disk.history.length))}%
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Max</div>
                  <div className="font-medium text-white">{data.metrics.disk.max}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Wifi size={18} className="text-amber-400" />
                <span>Network I/O</span>
              </span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">
                {data.metrics.network.current} MB/s
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getMetricColor(data.metrics.network.current, 'network')} transition-all duration-500 ease-in-out`}
                  style={{ width: `${getNetworkPercentage(data.metrics.network.current)}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Min</div>
                  <div className="font-medium text-white">{data.metrics.network.min} MB/s</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Avg</div>
                  <div className="font-medium text-white">
                    {Math.round(data.metrics.network.history.reduce((a, b) => a + b, 0) / Math.max(1, data.metrics.network.history.length) * 10) / 10} MB/s
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div>Max</div>
                  <div className="font-medium text-white">{data.metrics.network.max} MB/s</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="card-glass lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gauge size={18} className="text-cyan-400" />
                <span>System Overview</span>
              </div>
              <div className="text-xs bg-slate-800 px-2 py-1 rounded-full">
                Refreshing every {refreshRate}s
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Server size={12} />
                  <span>Active Servers</span>
                </div>
                <div className="text-xl font-semibold">
                  {data.servers.filter(s => s.status === 'online').length} / {data.servers.length}
                </div>
                <Progress value={(data.servers.filter(s => s.status === 'online').length / data.servers.length) * 100} 
                  className="h-1.5" 
                  indicatorClassName="bg-cyan-500" 
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <BarChart3 size={12} />
                  <span>Pipeline Success Rate</span>
                </div>
                <div className="text-xl font-semibold">
                  {Math.round((data.pipelines.filter(p => p.status === 'success').length / data.pipelines.length) * 100)}%
                </div>
                <Progress value={(data.pipelines.filter(p => p.status === 'success').length / data.pipelines.length) * 100} 
                  className="h-1.5" 
                  indicatorClassName="bg-green-500" 
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Bell size={12} />
                  <span>Active Alerts</span>
                </div>
                <div className="text-xl font-semibold">
                  {data.alerts.filter(a => !a.acknowledged).length}
                </div>
                <Progress 
                  value={(data.alerts.filter(a => !a.acknowledged).length / Math.max(1, data.alerts.length)) * 100} 
                  className="h-1.5" 
                  indicatorClassName={cn(
                    data.alerts.filter(a => !a.acknowledged).length > 5 ? "bg-red-500" : 
                    data.alerts.filter(a => !a.acknowledged).length > 2 ? "bg-amber-500" : 
                    "bg-emerald-500"
                  )} 
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Cpu size={12} />
                  <span>System Health</span>
                </div>
                <div className="text-xl font-semibold">
                  {Math.max(0, 100 - Math.round((
                    (data.metrics.cpu.current / 100) * 30 + 
                    (data.metrics.memory.current / 100) * 30 + 
                    (data.metrics.disk.current / 100) * 30 + 
                    (data.alerts.filter(a => !a.acknowledged).length / 10) * 10
                  )))}%
                </div>
                <Progress 
                  value={Math.max(0, 100 - ((
                    (data.metrics.cpu.current / 100) * 30 + 
                    (data.metrics.memory.current / 100) * 30 + 
                    (data.metrics.disk.current / 100) * 30 + 
                    (data.alerts.filter(a => !a.acknowledged).length / 10) * 10
                  )))} 
                  className="h-1.5" 
                  indicatorClassName={cn(
                    data.metrics.cpu.current > thresholds.cpu.critical || 
                    data.metrics.memory.current > thresholds.memory.critical || 
                    data.metrics.disk.current > thresholds.disk.critical
                      ? "bg-red-500" 
                      : data.metrics.cpu.current > thresholds.cpu.warning || 
                        data.metrics.memory.current > thresholds.memory.warning || 
                        data.metrics.disk.current > thresholds.disk.warning
                        ? "bg-amber-500" 
                        : "bg-emerald-500"
                  )} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-400" />
              <span>Active Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 h-[200px] relative">
              {data.alerts.filter(alert => !alert.acknowledged).length === 0 ? (
                <div className="text-center py-4 text-slate-400">
                  <ShieldAlert size={24} className="mx-auto mb-2 text-green-500 opacity-70" />
                  <div>No active alerts</div>
                </div>
              ) : (
                <ScrollArea className="h-[160px] w-full pr-4">
                  <div className="space-y-2">
                    {data.alerts.filter(alert => !alert.acknowledged).slice(0, 10).map(alert => (
                      <div 
                        key={alert.id} 
                        className={`px-3 py-2 rounded-md ${
                          alert.type === 'error' 
                            ? 'bg-red-950/30 border-l-2 border-red-500 animate-pulse' 
                            : 'bg-amber-950/30 border-l-2 border-amber-500'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="font-medium text-sm">{alert.message}</div>
                          <div className="text-xs opacity-70">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              {data.alerts.filter(alert => !alert.acknowledged).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs"
                  onClick={() => {
                    document.getElementById('alerts')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View All Alerts
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="card-glass mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Event Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 h-10 w-full transition-all hover:bg-blue-900/30 hover:border-blue-500/50"
                    onClick={() => triggerEvent('cpuSpike')}
                  >
                    <Zap size={14} className="text-blue-400" />
                    <span>CPU Spike</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Simulate high CPU usage</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 h-10 w-full transition-all hover:bg-purple-900/30 hover:border-purple-500/50"
                    onClick={() => triggerEvent('memoryLeak')}
                  >
                    <MemoryStick size={14} className="text-purple-400" />
                    <span>Memory Leak</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Simulate gradual memory consumption</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 h-10 w-full transition-all hover:bg-emerald-900/30 hover:border-emerald-500/50"
                    onClick={() => triggerEvent('garbageCollection')}
                  >
                    <Trash2 size={14} className="text-emerald-400" />
                    <span>GC</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Simulate memory garbage collection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 h-10 w-full transition-all hover:bg-cyan-900/30 hover:border-cyan-500/50"
                    onClick={() => triggerEvent('diskCleanup')}
                  >
                    <HardDrive size={14} className="text-blue-400" />
                    <span>Disk Cleanup</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Simulate disk space cleanup</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 h-10 w-full transition-all hover:bg-blue-900/30 hover:border-blue-500/50"
                    onClick={() => triggerEvent('largeDiskWrite')}
                  >
                    <Download size={14} className="text-cyan-400" />
                    <span>Disk Write</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Simulate large file being written</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 h-10 w-full transition-all hover:bg-amber-900/30 hover:border-amber-500/50"
                    onClick={() => triggerEvent('networkSpike')}
                  >
                    <Wifi size={14} className="text-amber-400" />
                    <span>Network Spike</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Simulate high network traffic</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 h-10 w-full transition-all hover:bg-red-900/30 hover:border-red-500/50"
                    onClick={() => triggerEvent('networkCongestion')}
                  >
                    <Loader2 size={14} className="text-red-400" />
                    <span>Net Congestion</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Simulate network congestion</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 h-10 w-full transition-all hover:bg-purple-900/30 hover:border-purple-500/50"
                      >
                        <Zap size={14} className="text-purple-400" />
                        <span>Trigger All</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Trigger All Events</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will simulate a cascade of system events. High load will be generated across all metrics. Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => {
                            ['cpuSpike', 'memoryLeak', 'networkSpike', 'largeDiskWrite'].forEach(event => {
                              setTimeout(() => triggerEvent(event), Math.random() * 2000);
                            });
                            toast.warning("System stress test initiated", {
                              description: "Multiple system events have been triggered"
                            });
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Trigger multiple events for stress testing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <JenkinsPipelineModule />
        <div id="containers">
          <DockerContainersModule />
        </div>
        <div id="infrastructure">
          <InfrastructureModule />
        </div>
        <div id="metrics">
          <MetricsModule />
        </div>
        <div id="logs">
          <LogsModule />
        </div>
        <div id="logsimulator">
          <LogSimulatorModule />
        </div>
        <div id="alerts">
          <AlertsModule />
        </div>
      </div>
    </DashboardLayout>
  );
}

export function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
