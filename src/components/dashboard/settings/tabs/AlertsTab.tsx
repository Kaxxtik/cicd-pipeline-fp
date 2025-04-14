
import { useState } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export function AlertsTab() {
  const { thresholds, setThresholds } = useDashboardContext();
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  
  const handleSaveThresholds = () => {
    setThresholds(localThresholds);
    toast.success('Alert thresholds updated', {
      description: 'New threshold values have been applied'
    });
  };
  
  return (
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
  );
}
