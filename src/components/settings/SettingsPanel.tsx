
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Download, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { SystemThresholds } from "@/lib/dataGeneration/types";

export function SettingsPanel() {
  const { theme, toggleTheme } = useTheme();
  const dashboardContext = useDashboardContext();
  const [localThresholds, setLocalThresholds] = useState<SystemThresholds>(dashboardContext.thresholds);
  const [refreshRate, setRefreshRate] = useState(dashboardContext.refreshRate);
  const [showEmpty, setShowEmpty] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const handleSaveThresholds = () => {
    dashboardContext.setThresholds(localThresholds);
    toast.success("Thresholds updated successfully");
  };
  
  const handleSaveRefreshRate = () => {
    dashboardContext.setRefreshRate(refreshRate);
    toast.success("Refresh rate updated successfully");
  };
  
  const handleExportMetrics = () => {
    const metrics = dashboardContext.data.metrics;
    const data = JSON.stringify(metrics, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Metrics exported successfully");
  };
  
  const handleExportLogs = () => {
    const logs = dashboardContext.data.logs;
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Logs exported successfully");
  };
  
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="thresholds">Alert Thresholds</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the general appearance and behavior of the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">Dark Theme</Label>
                  <div className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </div>
                </div>
                <Switch 
                  id="theme" 
                  checked={theme === "dark"} 
                  onCheckedChange={toggleTheme} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoRefresh">Auto-Refresh</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data
                  </div>
                </div>
                <Switch 
                  id="autoRefresh" 
                  checked={autoRefresh} 
                  onCheckedChange={setAutoRefresh} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="refreshRate">Refresh Rate</Label>
                  <span className="text-sm text-muted-foreground">{refreshRate} seconds</span>
                </div>
                <Slider
                  id="refreshRate"
                  min={1}
                  max={60}
                  step={1}
                  value={[refreshRate]}
                  onValueChange={(value) => setRefreshRate(value[0])}
                />
                <Button 
                  onClick={handleSaveRefreshRate} 
                  size="sm" 
                  className="mt-2"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Refresh Rate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>
                Set thresholds for triggering alerts on various metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>CPU Utilization</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="cpuWarning" className="text-sm text-amber-500">Warning</Label>
                      <Input
                        id="cpuWarning"
                        type="number"
                        value={localThresholds.cpu.warning}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          cpu: { ...localThresholds.cpu, warning: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cpuCritical" className="text-sm text-red-500">Critical</Label>
                      <Input
                        id="cpuCritical"
                        type="number"
                        value={localThresholds.cpu.critical}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          cpu: { ...localThresholds.cpu, critical: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Memory Usage</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="memoryWarning" className="text-sm text-amber-500">Warning</Label>
                      <Input
                        id="memoryWarning"
                        type="number"
                        value={localThresholds.memory.warning}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          memory: { ...localThresholds.memory, warning: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="memoryCritical" className="text-sm text-red-500">Critical</Label>
                      <Input
                        id="memoryCritical"
                        type="number"
                        value={localThresholds.memory.critical}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          memory: { ...localThresholds.memory, critical: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Disk Usage</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="diskWarning" className="text-sm text-amber-500">Warning</Label>
                      <Input
                        id="diskWarning"
                        type="number"
                        value={localThresholds.disk.warning}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          disk: { ...localThresholds.disk, warning: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="diskCritical" className="text-sm text-red-500">Critical</Label>
                      <Input
                        id="diskCritical"
                        type="number"
                        value={localThresholds.disk.critical}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          disk: { ...localThresholds.disk, critical: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Network I/O (MB/s)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="networkWarning" className="text-sm text-amber-500">Warning</Label>
                      <Input
                        id="networkWarning"
                        type="number"
                        value={localThresholds.network.warning}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          network: { ...localThresholds.network, warning: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="networkCritical" className="text-sm text-red-500">Critical</Label>
                      <Input
                        id="networkCritical"
                        type="number"
                        value={localThresholds.network.critical}
                        min={0}
                        max={100}
                        onChange={(e) => setLocalThresholds({
                          ...localThresholds,
                          network: { ...localThresholds.network, critical: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveThresholds}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Thresholds
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export dashboard data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleExportMetrics} className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Metrics (JSON)
                </Button>
                
                <Button onClick={handleExportLogs} className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs (JSON)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>
                Customize the dashboard layout and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compactView">Compact View</Label>
                  <div className="text-sm text-muted-foreground">
                    Use a more compact layout for the dashboard
                  </div>
                </div>
                <Switch 
                  id="compactView" 
                  checked={compactView} 
                  onCheckedChange={setCompactView} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showEmpty">Show Empty States</Label>
                  <div className="text-sm text-muted-foreground">
                    Show placeholders when data is not available
                  </div>
                </div>
                <Switch 
                  id="showEmpty" 
                  checked={showEmpty} 
                  onCheckedChange={setShowEmpty} 
                />
              </div>
              
              <Button variant="outline" className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Layout
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
