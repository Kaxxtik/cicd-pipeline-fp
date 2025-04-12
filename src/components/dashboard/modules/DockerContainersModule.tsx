
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
  ContainerIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function DockerContainersModule() {
  const { data } = useDashboardContext();
  const [filter, setFilter] = useState<string | null>(null);
  
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
  
  const filteredContainers = filter 
    ? data.containers.filter(container => container.status === filter)
    : data.containers;
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <ContainerIcon size={18} />
            <span>Docker Containers</span>
          </div>
          <div className="flex items-center space-x-2">
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredContainers.map(container => (
            <div 
              key={container.id}
              className="border border-slate-800 rounded-lg overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-800/30">
                <div className="flex items-center gap-2">
                  {getStatusIcon(container.status, container.health)}
                  <div className="font-medium truncate">{container.name}</div>
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">{container.image}</div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">CPU</div>
                  <div className="text-xs font-medium">{container.cpu}%</div>
                </div>
                <Progress value={container.cpu} className="h-1.5 bg-slate-800" />
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">Memory</div>
                  <div className="text-xs font-medium">{container.memory}%</div>
                </div>
                <Progress value={container.memory} className="h-1.5 bg-slate-800" />
                
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
