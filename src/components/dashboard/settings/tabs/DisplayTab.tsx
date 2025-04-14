
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Eye, Layout } from 'lucide-react';

export function DisplayTab() {
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(true);
  
  return (
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
  );
}
