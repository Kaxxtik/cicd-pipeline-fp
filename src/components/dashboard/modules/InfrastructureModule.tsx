
import { useEffect, useState } from "react";
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
  Wifi,
  Globe,
  Clock,
  BadgeInfo,
  ArrowDownUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useInterval } from "@/hooks/useInterval";

export function InfrastructureModule() {
  const { data, containerUpdateRate } = useDashboardContext();
  const [uptimeCounters, setUptimeCounters] = useState<Record<string, string>>({});
  const [networkTraffic, setNetworkTraffic] = useState<Record<string, {in: number, out: number}>>({});
  
  // Track uptime in real-time for online servers
  useEffect(() => {
    // Initialize uptime counters and network traffic
    const initialUptimes: Record<string, string> = {};
    const initialTraffic: Record<string, {in: number, out: number}> = {};
    
    data.servers.forEach(server => {
      initialUptimes[server.id] = server.uptime;
      initialTraffic[server.id] = {
        in: Math.random() * 10,
        out: Math.random() * 8
      };
    });
    
    setUptimeCounters(initialUptimes);
    setNetworkTraffic(initialTraffic);
  }, [data.servers]);
  
  // Update uptime counter every second for online servers
  useInterval(() => {
    setUptimeCounters(prev => {
      const updated = { ...prev };
      
      data.servers.forEach(server => {
        if (server.status === 'offline') return;
        
        // Parse the current uptime
        const uptimeParts = prev[server.id]?.split(' ') || [];
        if (uptimeParts.length < 6) return;
        
        let days = parseInt(uptimeParts[0]) || 0;
        let hours = parseInt(uptimeParts[2]) || 0;
        let mins = parseInt(uptimeParts[4]) || 0;
        
        // Increment by one minute
        mins += 1;
        if (mins >= 60) {
          mins = 0;
          hours += 1;
          if (hours >= 24) {
            hours = 0;
            days += 1;
          }
        }
        
        updated[server.id] = `${days}d ${hours}h ${mins}m`;
      });
      
      return updated;
    });
  }, 60000); // Update every minute
  
  // Update network traffic every few seconds
  useInterval(() => {
    setNetworkTraffic(prev => {
      const updated = { ...prev };
      
      data.servers.forEach(server => {
        if (server.status === 'offline') {
          updated[server.id] = { in: 0, out: 0 };
          return;
        }
        
        const currentIn = prev[server.id]?.in || 0;
        const currentOut = prev[server.id]?.out || 0;
        
        // Generate realistic network traffic with occasional spikes
        const inChange = (Math.random() - 0.5) * 2; // -1 to 1
        const outChange = (Math.random() - 0.5) * 1.5; // -0.75 to 0.75
        
        // Random spike chance (5%)
        const hasSpike = Math.random() < 0.05;
        
        updated[server.id] = {
          in: Math.max(0, currentIn + inChange + (hasSpike ? Math.random() * 20 : 0)),
          out: Math.max(0, currentOut + outChange + (hasSpike ? Math.random() * 15 : 0))
        };
      });
      
      return updated;
    });
  }, containerUpdateRate * 1000);
  
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
  
  const getOsInfo = (serverId: string) => {
    // Simulate different OS versions based on server ID
    const osMap: Record<string, string> = {
      's1': 'Ubuntu 22.04 LTS',
      's2': 'Ubuntu 22.04 LTS',
      's3': 'CentOS 8.5',
      's4': 'Debian 11',
      's5': 'Ubuntu 20.04 LTS',
      's6': 'CentOS 8.5'
    };
    return osMap[serverId] || 'Linux';
  };
  
  const getRegion = (serverId: string) => {
    // Simulate different regions based on server ID
    const regionMap: Record<string, string> = {
      's1': 'us-east-1',
      's2': 'us-east-1',
      's3': 'us-west-2',
      's4': 'eu-west-1',
      's5': 'us-east-2',
      's6': 'ap-southeast-1'
    };
    return regionMap[serverId] || 'us-central';
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {/* Server Metadata */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-slate-400" />
                    <span className="text-slate-400">IP:</span>
                    <span>{server.ip}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-slate-400">Uptime:</span>
                    <span>{uptimeCounters[server.id] || server.uptime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BadgeInfo size={12} className="text-slate-400" />
                    <span className="text-slate-400">OS:</span>
                    <span>{getOsInfo(server.id)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Server size={12} className="text-slate-400" />
                    <span className="text-slate-400">Region:</span>
                    <span>{getRegion(server.id)}</span>
                  </div>
                </div>
                
                {/* Resource Gauges */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Cpu size={12} />
                      <span>CPU</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex justify-between text-xs">
                        <span>{server.status !== 'offline' ? `${server.cpu}%` : 'N/A'}</span>
                        <span className="text-slate-400">
                          {server.status !== 'offline' && server.cpu > 80 && "High Load"}
                        </span>
                      </div>
                      <Progress 
                        value={server.status !== 'offline' ? server.cpu : 0} 
                        className="h-1.5 bg-slate-800" 
                        indicatorClassName={getProgressColor(server.cpu)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MemoryStick size={12} />
                      <span>Memory</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex justify-between text-xs">
                        <span>{server.status !== 'offline' ? `${server.memory}%` : 'N/A'}</span>
                        <span className="text-slate-400">
                          {server.status !== 'offline' && server.memory > 80 && "Low Memory"}
                        </span>
                      </div>
                      <Progress 
                        value={server.status !== 'offline' ? server.memory : 0} 
                        className="h-1.5 bg-slate-800" 
                        indicatorClassName={getProgressColor(server.memory)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <HardDrive size={12} />
                      <span>Disk</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex justify-between text-xs">
                        <span>{server.status !== 'offline' ? `${server.disk}%` : 'N/A'}</span>
                        <span className="text-slate-400">
                          {server.status !== 'offline' && server.disk > 80 && "Low Space"}
                        </span>
                      </div>
                      <Progress 
                        value={server.status !== 'offline' ? server.disk : 0} 
                        className="h-1.5 bg-slate-800" 
                        indicatorClassName={getProgressColor(server.disk)}
                      />
                    </div>
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
                
                {/* Network Traffic */}
                {server.status !== 'offline' && (
                  <div className="space-y-2 border-t border-slate-800/50 pt-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                      <ArrowDownUp size={12} />
                      <span>Network Traffic (Mbps)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Inbound</span>
                          <span>{networkTraffic[server.id]?.in.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500/80"
                            style={{ width: `${Math.min((networkTraffic[server.id]?.in || 0) / 30 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Outbound</span>
                          <span>{networkTraffic[server.id]?.out.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500/80"
                            style={{ width: `${Math.min((networkTraffic[server.id]?.out || 0) / 30 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
