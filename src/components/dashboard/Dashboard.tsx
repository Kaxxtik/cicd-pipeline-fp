
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
  Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>System Overview</span>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                Refreshing every {refreshRate}s
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-400">CPU Load</div>
                <div className="text-xl font-semibold">{data.metrics.cpu.current}%</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${data.metrics.cpu.current}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Memory Usage</div>
                <div className="text-xl font-semibold">{data.metrics.memory.current}%</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
                    style={{ width: `${data.metrics.memory.current}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Disk Usage</div>
                <div className="text-xl font-semibold">{data.metrics.disk.current}%</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{ width: `${data.metrics.disk.current}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Network I/O</div>
                <div className="text-xl font-semibold">{data.metrics.network.current} MB/s</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                    style={{ width: `${Math.min(data.metrics.network.current / 10 * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Active Alerts</span>
              <div className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                {data.alerts.filter(alert => !alert.acknowledged).length} active
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.alerts.filter(alert => !alert.acknowledged).slice(0, 3).map(alert => (
                <div 
                  key={alert.id} 
                  className={`px-3 py-2 rounded-md ${
                    alert.type === 'error' 
                      ? 'bg-red-950/30 border-l-2 border-red-500' 
                      : 'bg-amber-950/30 border-l-2 border-amber-500'
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-xs opacity-70">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {data.alerts.filter(alert => !alert.acknowledged).length === 0 && (
                <div className="text-center py-2 text-slate-400">No active alerts</div>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-9"
              onClick={() => triggerEvent('cpuSpike')}
            >
              <Zap size={14} className="text-amber-400" />
              <span>CPU Spike</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-9"
              onClick={() => triggerEvent('memoryLeak')}
            >
              <MemoryStick size={14} className="text-purple-400" />
              <span>Memory Leak</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-9"
              onClick={() => triggerEvent('garbageCollection')}
            >
              <Trash2 size={14} className="text-emerald-400" />
              <span>GC</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-9"
              onClick={() => triggerEvent('diskCleanup')}
            >
              <HardDrive size={14} className="text-blue-400" />
              <span>Disk Cleanup</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-9"
              onClick={() => triggerEvent('largeDiskWrite')}
            >
              <Download size={14} className="text-cyan-400" />
              <span>Disk Write</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-9"
              onClick={() => triggerEvent('networkSpike')}
            >
              <Wifi size={14} className="text-amber-400" />
              <span>Network Spike</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-9"
              onClick={() => triggerEvent('networkCongestion')}
            >
              <Loader2 size={14} className="text-red-400" />
              <span>Net Congestion</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6" id="pipelines">
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
