
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Moon, RefreshCw, Save, Sun } from 'lucide-react';
import { toast } from 'sonner';

export function GeneralTab() {
  const { theme, toggleTheme } = useTheme();
  const { refreshRate, setRefreshRate } = useDashboardContext();
  
  const [localRefreshRate, setLocalRefreshRate] = useState(refreshRate);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  
  const handleSaveRefreshRate = () => {
    setRefreshRate(localRefreshRate);
    toast.success('Refresh rate updated', {
      description: `Dashboard will refresh every ${localRefreshRate} seconds`
    });
  };
  
  return (
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
  );
}
