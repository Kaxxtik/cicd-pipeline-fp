
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DownloadCloud, Filter, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LogsModule() {
  const { data } = useDashboardContext();
  
  return (
    <Card className="card-glass">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText size={18} />
          <span>System Logs</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Filter size={16} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RefreshCw size={16} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <DownloadCloud size={16} />
          </Button>
          <div className="relative w-[180px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search logs..." 
              className="pl-8 h-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <div className="space-y-3">
            {data.logs.map((log) => (
              <div 
                key={log.id} 
                className={cn(
                  "p-2 rounded-md text-xs font-mono border-l-2",
                  log.level === 'error' ? "bg-red-950/20 border-red-700 text-red-400" : 
                  log.level === 'warning' ? "bg-amber-950/20 border-amber-700 text-amber-400" :
                  log.level === 'info' ? "bg-blue-950/20 border-blue-700 text-blue-400" :
                  "bg-slate-800/20 border-slate-700 text-slate-400"
                )}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">[{log.timestamp}]</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] uppercase",
                    log.level === 'error' ? "bg-red-900/50 text-red-300" :
                    log.level === 'warning' ? "bg-amber-900/50 text-amber-300" :
                    log.level === 'info' ? "bg-blue-900/50 text-blue-300" :
                    "bg-slate-800 text-slate-300"
                  )}>
                    {log.level}
                  </span>
                </div>
                <div className="mt-1">{log.message}</div>
                {log.service && (
                  <div className="mt-1 text-[10px] opacity-70">Source: {log.service}</div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
