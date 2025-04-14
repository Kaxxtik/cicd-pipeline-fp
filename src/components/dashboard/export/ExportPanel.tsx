
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { FileDown, Calendar, Clock, Database, File, Table, BarChart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

export function ExportPanel() {
  const { data } = useDashboardContext();
  const [fileFormat, setFileFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeLogs, setIncludeLogs] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  const handleExport = () => {
    // Simulate export process
    const exportData = {
      metrics: includeMetrics ? data.metrics : null,
      logs: includeLogs ? data.logs : null,
      alerts: includeAlerts ? data.alerts : null,
      timestamp: new Date().toISOString(),
      period: {
        from: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        to: endDate ? format(endDate, 'yyyy-MM-dd') : null
      }
    };
    
    // Convert to selected format (in real app, this would create a file)
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // For demo: just show a success message
    toast.success('Export completed successfully', {
      description: `Data exported in ${fileFormat.toUpperCase()} format`
    });
    
    // In a real app, you would create and download a file
    console.log('Exported data:', jsonData);
    
    // Simulate file download
    const element = document.createElement('a');
    const file = new Blob([jsonData], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `dashboard-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileDown className="mr-2" size={20} />
          Export Dashboard Data
        </CardTitle>
        <CardDescription>Download dashboard data for analysis or reporting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Data Selection</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart size={18} />
                <Label htmlFor="include-metrics">Metrics Data</Label>
              </div>
              <Switch 
                id="include-metrics" 
                checked={includeMetrics}
                onCheckedChange={setIncludeMetrics}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <File size={18} />
                <Label htmlFor="include-logs">System Logs</Label>
              </div>
              <Switch 
                id="include-logs" 
                checked={includeLogs}
                onCheckedChange={setIncludeLogs}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell size={18} />
                <Label htmlFor="include-alerts">Alerts History</Label>
              </div>
              <Switch 
                id="include-alerts" 
                checked={includeAlerts}
                onCheckedChange={setIncludeAlerts}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Date Range</h3>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Export Format</h3>
          <RadioGroup 
            value={fileFormat} 
            onValueChange={(value) => setFileFormat(value as 'csv' | 'json' | 'xlsx')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv">CSV</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json">JSON</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="xlsx" id="xlsx" />
              <Label htmlFor="xlsx">Excel</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button className="w-full" onClick={handleExport}>
          <FileDown className="mr-2" size={16} />
          Export Data
        </Button>
      </CardContent>
    </Card>
  );
}
