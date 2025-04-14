
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralTab } from './tabs/GeneralTab';
import { AlertsTab } from './tabs/AlertsTab';
import { DisplayTab } from './tabs/DisplayTab';
import { AdvancedTab } from './tabs/AdvancedTab';

export function SettingsPanel() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="display">Display</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <GeneralTab />
      </TabsContent>
      
      <TabsContent value="alerts" className="space-y-4">
        <AlertsTab />
      </TabsContent>
      
      <TabsContent value="display" className="space-y-4">
        <DisplayTab />
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4">
        <AdvancedTab />
      </TabsContent>
    </Tabs>
  );
}
