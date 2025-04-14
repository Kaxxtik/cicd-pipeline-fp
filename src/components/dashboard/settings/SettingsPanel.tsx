
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, RefreshCw, Moon, Sun, Layout, Bell, Eye } from 'lucide-react';

export function SettingsPanel() {
  const { theme, toggleTheme } = useTheme();
  const { refreshRate, setRefreshRate, thresholds, setThresholds } = useDashboardContext();
  
  const [localRefreshRate, setLocalRefreshRate] = useState(refreshRate);
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(true);
  
  const handleSaveRefreshRate = () => {
    setRefreshRate(localRefreshRate);
    toast.success('Refresh rate updated', {
      description: `Dashboard will refresh every ${localRefreshRate} seconds`
    });
  };
  
  const handleSaveThresholds = () => {
    setThresholds(localThresholds);
    toast.success('Alert thresholds updated', {
      description: 'New threshold values have been applied'
    });
  };
  
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="display">Display</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Customize the dashboard appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <Label htmlFor="theme-mode">Theme Mode</Label>
              </div>
              <Switch 
                id="theme-mode" 
                checked={theme === 'light'}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RefreshCw size={18} />
                <Label htmlFor="refresh-rate">Refresh Rate (seconds)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Slider 
                  id="refresh-rate"
                  min={2} 
                  max={60} 
                  step={1}
                  value={[localRefreshRate]}
                  onValueChange={(value) => setLocalRefreshRate(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{localRefreshRate}s</span>
              </div>
              <Button onClick={handleSaveRefreshRate} className="mt-2" size="sm">
                <Save size={14} className="mr-2" />
                Save
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw size={18} />
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
              </div>
              <Switch 
                id="auto-refresh" 
                checked={isAutoRefresh}
                onCheckedChange={setIsAutoRefresh}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="alerts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Alert Thresholds</CardTitle>
            <CardDescription>Configure when alerts are triggered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">CPU Usage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu-warning">Warning Threshold (%)</Label>
                  <Input 
                    id="cpu-warning"
                    type="number" 
                    min="1" 
                    max="100" 
                    value={localThresholds.cpu.warning}
                    onChange={(e) => setLocalThresholds({
                      ...localThresholds,
                      cpu: {
                        ...localThresholds.cpu,
                        warning: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpu-critical">Critical Threshold (%)</Label>
                  <Input 
                    id="cpu-critical"
                    type="number" 
                    min="1" 
                    max="100" 
                    value={localThresholds.cpu.critical}
                    onChange={(e) => setLocalThresholds({
                      ...localThresholds,
                      cpu: {
                        ...localThresholds.cpu,
                        critical: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Memory Usage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memory-warning">Warning Threshold (%)</Label>
                  <Input 
                    id="memory-warning"
                    type="number" 
                    min="1" 
                    max="100" 
                    value={localThresholds.memory.warning}
                    onChange={(e) => setLocalThresholds({
                      ...localThresholds,
                      memory: {
                        ...localThresholds.memory,
                        warning: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memory-critical">Critical Threshold (%)</Label>
                  <Input 
                    id="memory-critical"
                    type="number" 
                    min="1" 
                    max="100" 
                    value={localThresholds.memory.critical}
                    onChange={(e) => setLocalThresholds({
                      ...localThresholds,
                      memory: {
                        ...localThresholds.memory,
                        critical: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>
            
            <Button onClick={handleSaveThresholds}>
              <Save size={16} className="mr-2" />
              Save Thresholds
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="display" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Configure dashboard layout and visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layout size={18} />
                <Label htmlFor="compact-view">Compact View</Label>
              </div>
              <Switch 
                id="compact-view" 
                checked={false}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell size={18} />
                <Label htmlFor="show-alerts">Show Alerts Panel</Label>
              </div>
              <Switch 
                id="show-alerts" 
                checked={true}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye size={18} />
                <Label htmlFor="detailed-metrics">Show Detailed Metrics</Label>
              </div>
              <Switch 
                id="detailed-metrics" 
                checked={showDetailedMetrics}
                onCheckedChange={setShowDetailedMetrics}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Configure advanced dashboard features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell size={18} />
                <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              </div>
              <Switch 
                id="desktop-notifications" 
                checked={false}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye size={18} />
                <Label htmlFor="persistent-logs">Persistent Logs</Label>
              </div>
              <Switch 
                id="persistent-logs" 
                checked={false}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
