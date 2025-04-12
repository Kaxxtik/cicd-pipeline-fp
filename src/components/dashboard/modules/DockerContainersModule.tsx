
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CircleCheck,
  CircleX,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  AlertCircle,
  ContainerIcon,
  Search,
  Layers,
  Network,
  HardDrive,
  Usb,
  ArrowDownUp,
  Filter
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useInterval } from "@/hooks/useInterval";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function DockerContainersModule() {
  const { data, setData, containerUpdateRate } = useDashboardContext();
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [expandedView, setExpandedView] = useState(false);
  
  // Update container metrics every containerUpdateRate seconds
  useInterval(() => {
    setData(prev => {
      const updatedContainers = prev.containers.map(container => {
        if (container.status !== 'running') return container;
        
        // Random CPU and memory changes
        const newCpu = Math.max(0, Math.min(100, container.cpu + (Math.random() - 0.5) * 10));
        const newMemory = Math.max(0, Math.min(100, container.memory + (Math.random() - 0.5) * 6));
        
        // Occasional spikes (5% chance)
        const hasCpuSpike = Math.random() < 0.05;
        const hasMemorySpike = Math.random() < 0.05;
        
        return {
          ...container,
          cpu: hasCpuSpike ? Math.min(100, container.cpu + Math.random() * 30) : newCpu,
          memory: hasMemorySpike ? Math.min(100, container.memory + Math.random() * 20) : newMemory
        };
      });
      
      // Random status changes (2% chance)
      const containerToUpdate = Math.random() < 0.02 ? 
        Math.floor(Math.random() * updatedContainers.length) : -1;
      
      if (containerToUpdate >= 0) {
        const statuses = ['running', 'stopped', 'restarting', 'exited'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const healthStates = ['healthy', 'unhealthy', 'starting'];
        const newHealth = healthStates[Math.floor(Math.random() * healthStates.length)];
        
        updatedContainers[containerToUpdate] = {
          ...updatedContainers[containerToUpdate],
          status: newStatus as any,
          health: newStatus === 'running' ? newHealth as any : 'unhealthy',
          restarts: newStatus === 'restarting' 
            ? updatedContainers[containerToUpdate].restarts + 1 
            : updatedContainers[containerToUpdate].restarts
        };
      }
      
      return {
        ...prev,
        containers: updatedContainers
      };
    });
  }, containerUpdateRate * 1000);
  
  const toggleDetails = (containerId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [containerId]: !prev[containerId]
    }));
  };
  
  const getStatusIcon = (status: string, health: string) => {
    if (status !== 'running') {
      return status === 'stopped' ? 
        <Pause size={16} className="text-slate-400" /> : 
        (status === 'restarting' ? 
          <RefreshCw size={16} className="text-amber-400 animate-spin" /> : 
          <Trash2 size={16} className="text-red-400" />
        );
    }
    
    switch (health) {
      case 'healthy':
        return <CircleCheck size={16} className="text-green-500" />;
      case 'unhealthy':
        return <CircleX size={16} className="text-red-500" />;
      case 'starting':
        return <AlertCircle size={16} className="text-amber-400" />;
      default:
        return <Play size={16} className="text-blue-400" />;
    }
  };
  
  const getContainerStatusClass = (status: string, health: string) => {
    if (status !== 'running') {
      return status === 'stopped' ? 
        "bg-slate-500/10 text-slate-400 border-slate-500/20" : 
        (status === 'restarting' ? 
          "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
          "bg-red-500/10 text-red-400 border-red-500/20"
        );
    }
    
    switch (health) {
      case 'healthy':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'unhealthy':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'starting':
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };
  
  // Apply both filtering and searching
  const filteredContainers = data.containers
    .filter(container => filter === null || container.status === filter)
    .filter(container => 
      searchTerm === "" || 
      container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.image.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <ContainerIcon size={18} />
            <span>Docker Containers</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search containers..."
                className="pl-8 h-9 bg-slate-800/50 text-xs border-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Detailed</span>
              <Switch 
                checked={expandedView} 
                onCheckedChange={setExpandedView}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            
            <div className="flex items-center">
              <Filter size={14} className="mr-1 text-slate-400" />
              <button 
                onClick={() => setFilter(null)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  filter === null 
                    ? "bg-blue-500/20 text-blue-400"
                    : "hover:bg-slate-800 text-slate-400"
                )}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('running')}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  filter === 'running'
                    ? "bg-green-500/20 text-green-400"
                    : "hover:bg-slate-800 text-slate-400"
                )}
              >
                Running
              </button>
              <button 
                onClick={() => setFilter('stopped')}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  filter === 'stopped'
                    ? "bg-slate-500/20 text-slate-400"
                    : "hover:bg-slate-800 text-slate-400"
                )}
              >
                Stopped
              </button>
              <button 
                onClick={() => setFilter('restarting')}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  filter === 'restarting'
                    ? "bg-amber-500/20 text-amber-400"
                    : "hover:bg-slate-800 text-slate-400"
                )}
              >
                Restarting
              </button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-4",
          expandedView 
            ? "grid-cols-1 md:grid-cols-2" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
          {filteredContainers.map(container => (
            <div 
              key={container.id}
              className={cn(
                "border border-slate-800 rounded-lg overflow-hidden transition-all duration-300",
                showDetails[container.id] && "bg-slate-900/50"
              )}
            >
              <div 
                className="px-4 py-3 bg-slate-800/30 cursor-pointer"
                onClick={() => toggleDetails(container.id)}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(container.status, container.health)}
                  <div className="font-medium truncate">{container.name}</div>
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">{container.image}</div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">CPU</div>
                  <div className="text-xs font-medium">{container.cpu.toFixed(1)}%</div>
                </div>
                <Progress 
                  value={container.cpu} 
                  className="h-1.5 bg-slate-800" 
                  indicatorClassName={cn(
                    container.cpu > 80 ? "bg-red-500" : 
                    container.cpu > 60 ? "bg-amber-500" : 
                    "bg-emerald-500"
                  )}
                />
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">Memory</div>
                  <div className="text-xs font-medium">{container.memory.toFixed(1)}%</div>
                </div>
                <Progress 
                  value={container.memory} 
                  className="h-1.5 bg-slate-800"
                  indicatorClassName={cn(
                    container.memory > 80 ? "bg-red-500" : 
                    container.memory > 60 ? "bg-amber-500" : 
                    "bg-blue-500"
                  )}
                />
                
                <div className="flex justify-between text-xs pt-2">
                  <div className="flex flex-col">
                    <span className="text-slate-400">Uptime</span>
                    <span>{container.uptime}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-400">Restarts</span>
                    <span>{container.restarts}</span>
                  </div>
                </div>
                
                <div>
                  <div 
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border w-fit",
                      getContainerStatusClass(container.status, container.health)
                    )}
                  >
                    {container.status === 'running' ? container.health : container.status}
                  </div>
                </div>
                
                {/* Expanded container details */}
                {(showDetails[container.id] || expandedView) && (
                  <div className="pt-2 mt-2 border-t border-slate-800/50 space-y-3 animate-fade-in">
                    {/* Ports */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Usb size={12} className="text-blue-400" />
                        <span>Ports</span>
                      </div>
                      <div className="pl-4 space-y-1">
                        {container.ports ? (
                          container.ports.map((port, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <ArrowDownUp size={10} className="text-slate-500" />
                              <span className="text-slate-400">{port.host}:{port.container}</span>
                              <span className="text-xs text-slate-500">({port.protocol})</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">No ports mapped</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Volumes */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <HardDrive size={12} className="text-purple-400" />
                        <span>Volumes</span>
                      </div>
                      <div className="pl-4 space-y-1">
                        {container.volumes ? (
                          container.volumes.map((volume, idx) => (
                            <div key={idx} className="text-xs text-slate-400 truncate">
                              <span className="text-slate-500">{volume.host}</span>
                              <span className="text-slate-700 mx-1">→</span>
                              <span>{volume.container}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">No volumes mounted</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Networks */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Network size={12} className="text-emerald-400" />
                        <span>Networks</span>
                      </div>
                      <div className="pl-4 flex flex-wrap gap-2">
                        {container.networks ? (
                          container.networks.map((network, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400"
                            >
                              {network}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">Default network only</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Environment */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Layers size={12} className="text-amber-400" />
                        <span>Environment</span>
                      </div>
                      <div className="pl-4 text-xs text-slate-500">
                        {container.environment ? (
                          <span>{container.environment.length} variables defined</span>
                        ) : (
                          <span>No environment variables</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredContainers.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No containers match your search criteria
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
