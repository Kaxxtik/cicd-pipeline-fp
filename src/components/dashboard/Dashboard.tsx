
import { useState, useEffect } from "react";
import { JenkinsPipelineModule } from "./modules/JenkinsPipelineModule";
import { DockerContainersModule } from "./modules/DockerContainersModule";
import { InfrastructureModule } from "./modules/InfrastructureModule";
import { MetricsModule } from "./modules/MetricsModule";
import { LogsModule } from "./modules/LogsModule";
import { AlertsModule } from "./modules/AlertsModule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardContext, DashboardProvider } from "@/contexts/DashboardContext";
import { generateMockData } from "@/lib/mockData";
import { toast } from "sonner";
import { useInterval } from "@/hooks/useInterval";
import { useContext } from "react";

function DashboardContent() {
  const { data, setData, refreshRate } = useContext(DashboardContext);
  
  // Update dashboard data every refreshRate seconds
  useInterval(() => {
    const newData = generateMockData(data);
    setData(newData);
    
    // Generate random alerts occasionally
    if (Math.random() < 0.2) {
      const alertTypes = ["Container restart detected", "High CPU usage", "Pipeline failure", "Disk space warning"];
      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = Math.random() < 0.3 ? "error" : "warning";
      
      toast[severity]("New Alert", {
        description: randomAlert,
      });
      
      // Add to alerts list
      const newAlerts = [...data.alerts];
      newAlerts.unshift({
        id: Date.now().toString(),
        message: randomAlert,
        type: severity,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
      
      setData(prev => ({
        ...prev,
        alerts: newAlerts.slice(0, 100) // Limit to 100 alerts
      }));
    }
  }, refreshRate * 1000);
  
  // On mount, show welcome toast
  useEffect(() => {
    toast.success("Dashboard loaded", {
      description: "Real-time monitoring started"
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
            <CardTitle className="text-lg">Active Alerts</CardTitle>
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
