
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
  ChevronDown,
  User,
  Terminal,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function JenkinsPipelineModule() {
  const { data, setRefreshRate } = useDashboardContext();
  const [expandedPipeline, setExpandedPipeline] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState<string | null>(null);
  const [animatingLogs, setAnimatingLogs] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll logs when new content is added
  useEffect(() => {
    if (showLogs && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [showLogs, animatingLogs]);
  
  const toggleExpand = (id: string) => {
    if (expandedPipeline === id) {
      setExpandedPipeline(null);
      setShowLogs(null);
    } else {
      setExpandedPipeline(id);
    }
  };
  
  const toggleLogs = (id: string) => {
    if (showLogs === id) {
      setShowLogs(null);
    } else {
      setShowLogs(id);
      // Simulate log animation
      setAnimatingLogs(true);
      setTimeout(() => setAnimatingLogs(false), 3000);
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
  
  // Generate mock logs for a pipeline
  const generateLogs = (pipeline: any) => {
    const logLines = [];
    const stageNames = pipeline.stages.map((s: any) => s.name);
    
    for (let i = 0; i < stageNames.length; i++) {
      const stage = stageNames[i];
      const isCurrentStage = pipeline.status === 'building' && 
                            i === pipeline.stages.findIndex((s: any) => s.status === 'building');
      
      // Add stage header
      logLines.push(`[Pipeline] Stage '${stage}'`);
      logLines.push(`[Pipeline] { (${stage})`);
      
      // Add different logs based on stage
      if (stage === 'Checkout') {
        logLines.push(`> git checkout ${pipeline.branch}`);
        logLines.push(`> git pull origin ${pipeline.branch}`);
        logLines.push(`Already up to date.`);
      } else if (stage.includes('Dependencies')) {
        logLines.push(`> npm install`);
        logLines.push(`added 1221 packages in 12s`);
        logLines.push(`found 0 vulnerabilities`);
      } else if (stage.includes('Test')) {
        logLines.push(`> npm run test`);
        logLines.push(`PASS src/components/__tests__/App.test.js`);
        logLines.push(`PASS src/utils/__tests__/helpers.test.js`);
        logLines.push(`Test Suites: 8 passed, 8 total`);
        logLines.push(`Tests: 42 passed, 42 total`);
        logLines.push(`Time: 5.42s`);
      } else if (stage.includes('Build')) {
        logLines.push(`> npm run build`);
        logLines.push(`Creating an optimized production build...`);
        logLines.push(`Compiled successfully.`);
        logLines.push(`File sizes after gzip:`);
        logLines.push(`  112.5 kB  build/static/js/main.a1b2c3d4.js`);
        logLines.push(`  28.5 kB   build/static/css/main.a1b2c3d4.css`);
      } else if (stage.includes('Deploy')) {
        logLines.push(`> deploying to ${pipeline.name.includes('Production') ? 'production' : 'staging'}`);
        logLines.push(`Uploading build artifacts...`);
        logLines.push(`Updating service configuration...`);
        logLines.push(`Restarting application servers...`);
        logLines.push(`Deployment complete!`);
      } else {
        logLines.push(`> Running ${stage} steps...`);
        logLines.push(`Completed ${stage} successfully.`);
      }
      
      // Add stage completion
      logLines.push(`[Pipeline] }`);
      
      // If building and this is the current stage, add some "live" logs
      if (isCurrentStage) {
        logLines.push(`[Pipeline] Current operation in progress...`);
        if (animatingLogs) {
          logLines.push(`> Processing...`);
          logLines.push(`> Executing step ${Math.floor(Math.random() * 10) + 1}/10`);
        }
      }
    }
    
    return logLines;
  };
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Jenkins Pipelines</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => setRefreshRate(prev => prev === 5 ? 30 : 5)}
            >
              <RefreshCw size={14} />
              <span>Refresh {data.pipelines.find(p => p.status === 'building') ? 'Every 5s' : 'Every 30s'}</span>
            </Button>
          </div>
        </div>
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
                  <Badge className={cn(
                    "px-2 py-0.5 rounded-full text-xs border",
                    getStatusClass(pipeline.status)
                  )}>
                    {pipeline.status}
                  </Badge>
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
                <div className="border-t border-slate-800">
                  <div className="px-4 py-3">
                    <div className="flex justify-between mb-3 text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        <div>Duration: {pipeline.duration}</div>
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>John Doe</span>
                        </div>
                        <div>Commit: #{pipeline.id.substring(0, 7)}</div>
                      </div>
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
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "gap-1",
                          showLogs === pipeline.id ? "bg-slate-700" : ""
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLogs(pipeline.id);
                        }}
                      >
                        <Terminal size={14} />
                        <span>{showLogs === pipeline.id ? "Hide Logs" : "View Logs"}</span>
                      </Button>
                    </div>
                    
                    {showLogs === pipeline.id && (
                      <div 
                        ref={logRef}
                        className="mt-3 bg-black/50 border border-slate-800 rounded-md p-3 font-mono text-xs h-64 overflow-auto"
                      >
                        {generateLogs(pipeline).map((line, i) => (
                          <div key={i} className={cn(
                            "py-0.5", 
                            line.startsWith('>') ? "text-cyan-400" : 
                            line.startsWith('[Pipeline]') ? "text-yellow-400" : "",
                            line.includes('PASS') ? "text-green-400" : "",
                            line.includes('FAIL') ? "text-red-400" : "",
                            animatingLogs && i >= generateLogs(pipeline).length - 3 ? "animate-pulse" : ""
                          )}>
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
