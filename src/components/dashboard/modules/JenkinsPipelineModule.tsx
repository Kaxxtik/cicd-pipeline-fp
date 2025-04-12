
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Clock, 
  GitBranch,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function JenkinsPipelineModule() {
  const { data } = useDashboardContext();
  const [expandedPipeline, setExpandedPipeline] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    if (expandedPipeline === id) {
      setExpandedPipeline(null);
    } else {
      setExpandedPipeline(id);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'building':
        return <Loader2 size={16} className="text-blue-400 animate-spin" />;
      case 'unstable':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'pending':
        return <Clock size={16} className="text-slate-400" />;
      case 'skipped':
        return <MoreHorizontal size={16} className="text-slate-400" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'building':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'unstable':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'pending':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'skipped':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>Jenkins Pipelines</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.pipelines.map((pipeline) => (
            <div 
              key={pipeline.id}
              className="border border-slate-800 rounded-lg overflow-hidden"
            >
              <div 
                className="bg-slate-800/50 px-4 py-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(pipeline.id)}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(pipeline.status)}
                  <div className="font-medium">{pipeline.name}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <GitBranch size={12} />
                    <span>{pipeline.branch}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-slate-400">
                    {new Date(pipeline.lastRun).toLocaleString()}
                  </div>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-xs border",
                    getStatusClass(pipeline.status)
                  )}>
                    {pipeline.status}
                  </div>
                  <ChevronDown 
                    size={16}
                    className={cn(
                      "transition-transform",
                      expandedPipeline === pipeline.id ? "rotate-180" : ""
                    )}
                  />
                </div>
              </div>
              
              {expandedPipeline === pipeline.id && (
                <div className="px-4 py-3 border-t border-slate-800">
                  <div className="flex justify-between mb-3 text-xs text-slate-400">
                    <div>Duration: {pipeline.duration}</div>
                    <div>Last run: {new Date(pipeline.lastRun).toLocaleString()}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {pipeline.stages.map((stage, idx) => (
                      <div 
                        key={`${pipeline.id}-stage-${idx}`}
                        className={cn(
                          "px-3 py-3 rounded-md border flex flex-col justify-between h-24",
                          getStatusClass(stage.status)
                        )}
                      >
                        <div className="flex justify-between">
                          <div className="font-medium text-sm">{stage.name}</div>
                          {getStatusIcon(stage.status)}
                        </div>
                        <div className="text-xs opacity-80">Duration: {stage.duration}</div>
                      </div>
                    ))}
                  </div>
                  
                  {pipeline.status === 'building' && (
                    <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/30 rounded-full w-3/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
