
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Server,
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function InfrastructureModule() {
  const { data } = useDashboardContext();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'offline':
        return <XCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };
  
  const getProgressColor = (value: number) => {
    if (value > 90) return "bg-red-500";
    if (value > 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getLoadText = (load: number[]) => {
    return `${load[0].toFixed(2)}, ${load[1].toFixed(2)}, ${load[2].toFixed(2)}`;
  };
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Server size={18} />
          <span>Server Infrastructure</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.servers.map(server => (
            <div 
              key={server.id}
              className={cn(
                "border rounded-lg overflow-hidden transition-all",
                server.status === 'offline' ? "border-red-500/20" : "border-slate-800",
                server.status === 'offline' ? "opacity-60" : "opacity-100"
              )}
            >
              <div className="px-4 py-3 bg-slate-800/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getStatusIcon(server.status)}
                  <div className="font-medium">{server.name}</div>
                </div>
                <div 
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border",
                    getStatusClass(server.status)
                  )}
                >
                  {server.status}
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between text-xs">
                  <div>{server.ip}</div>
                  <div>Uptime: {server.uptime}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Cpu size={12} />
                      <span>CPU</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{server.status !== 'offline' ? `${server.cpu}%` : 'N/A'}</span>
                    </div>
                    <Progress 
                      value={server.status !== 'offline' ? server.cpu : 0} 
                      className={cn(
                        "h-1.5 bg-slate-800",
                        server.status !== 'offline' ? getProgressColor(server.cpu) : "bg-slate-600"
                      )} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MemoryStick size={12} />
                      <span>Memory</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{server.status !== 'offline' ? `${server.memory}%` : 'N/A'}</span>
                    </div>
                    <Progress 
                      value={server.status !== 'offline' ? server.memory : 0} 
                      className={cn(
                        "h-1.5 bg-slate-800",
                        server.status !== 'offline' ? getProgressColor(server.memory) : "bg-slate-600"
                      )} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <HardDrive size={12} />
                      <span>Disk</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{server.status !== 'offline' ? `${server.disk}%` : 'N/A'}</span>
                    </div>
                    <Progress 
                      value={server.status !== 'offline' ? server.disk : 0} 
                      className={cn(
                        "h-1.5 bg-slate-800",
                        server.status !== 'offline' ? getProgressColor(server.disk) : "bg-slate-600"
                      )} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Wifi size={12} />
                      <span>Load Avg</span>
                    </div>
                    <div className="text-xs">
                      <span>{server.status !== 'offline' ? getLoadText(server.load) : 'N/A'}</span>
                    </div>
                    <div className={cn(
                      "h-1.5 flex gap-px",
                      server.status === 'offline' && "opacity-50"
                    )}>
                      {server.status !== 'offline' && server.load.map((load, idx) => (
                        <div 
                          key={`${server.id}-load-${idx}`}
                          className="h-full flex-1 rounded-sm overflow-hidden bg-slate-800"
                        >
                          <div 
                            className={cn(
                              "h-full",
                              load > 2 ? "bg-red-500" : load > 1 ? "bg-yellow-500" : "bg-green-500"
                            )}
                            style={{ width: `${Math.min(load / 3 * 100, 100)}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
