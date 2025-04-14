
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Eye } from 'lucide-react';

export function AdvancedTab() {
  return (
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
  );
}
