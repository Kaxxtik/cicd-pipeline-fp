
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, CheckCircle, ChevronRight, AlertTriangle, XCircle } from "lucide-react";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function AlertsModule() {
  const { data } = useDashboardContext();

  function getAlertIcon(type: string) {
    switch (type.toLowerCase()) {
      case 'error':
        return <XCircle className="text-red-500" size={18} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={18} />;
      case 'info':
        return <Bell className="text-blue-500" size={18} />;
      case 'resolved':
        return <CheckCircle className="text-green-500" size={18} />;
      default:
        return <Bell className="text-slate-500" size={18} />;
    }
  }

  function getAlertClass(type: string) {
    switch (type.toLowerCase()) {
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'resolved':
        return 'bg-green-500/10 border-green-500/20';
      default:
        return 'bg-slate-500/10 border-slate-500/20';
    }
  }

  return (
    <Card className="card-glass h-[400px] flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <span>Active Alerts</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {data.alerts.filter(a => a.type.toLowerCase() !== 'resolved').length} unresolved alerts
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <Tabs defaultValue="alerts" className="w-full h-full">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="h-[calc(100%-40px)]">
            {data.alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <BellOff size={48} className="text-slate-500 mb-4" />
                <h3 className="text-lg font-medium">No alerts</h3>
                <p className="text-sm text-muted-foreground">
                  All systems are running smoothly
                </p>
              </div>
            ) : (
              <div className="h-full">
                <ScrollArea className="h-[330px]">
                  <div className="space-y-3 p-4">
                    {data.alerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`p-3 rounded-lg border ${getAlertClass(alert.type)} animate-fade-in`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Alert</h4>
                              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <span className="text-xs text-slate-500">{alert.type}</span>
                              </div>
                              <button className="text-xs text-slate-400 flex items-center hover:text-slate-300">
                                Details
                                <ChevronRight size={12} className="ml-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="architecture" className="h-[calc(100%-40px)]">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="w-full h-full bg-slate-900/50 rounded-lg p-5 border border-slate-700">
                  {/* Architecture Diagram */}
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-bold text-white">DevOps Monitoring Dashboard Architecture</h3>
                    <p className="text-xs text-slate-400">Final Year Engineering Project Simulation</p>
                  </div>
                  
                  {/* Diagram Container */}
                  <div className="relative w-full h-[240px] overflow-visible">
                    {/* Frontend Section */}
                    <div className="absolute top-0 left-0 w-[45%] h-[70%] border border-blue-500/30 rounded-lg bg-blue-950/30 p-2">
                      <div className="text-xs text-blue-400 font-semibold mb-1 border-b border-blue-500/30 pb-1">
                        Frontend (React + TypeScript + Tailwind)
                      </div>
                      
                      {/* Display Modules */}
                      <div className="absolute top-8 left-3 w-[45%] h-20 border border-blue-500/20 rounded bg-blue-900/20 p-1">
                        <div className="text-[10px] text-blue-300 font-medium">Display Modules</div>
                        <div className="text-[8px] text-slate-300 mt-1">
                          • Metrics Cards
                          <br />• System Overview
                          <br />• Event Triggers
                        </div>
                      </div>
                      
                      {/* Monitoring Modules */}
                      <div className="absolute top-8 right-3 w-[45%] h-20 border border-blue-500/20 rounded bg-blue-900/20 p-1">
                        <div className="text-[10px] text-blue-300 font-medium">Monitoring Modules</div>
                        <div className="text-[8px] text-slate-300 mt-1">
                          • Jenkins CI/CD
                          <br />• Docker Containers
                          <br />• Infrastructure
                          <br />• Logs & Alerts
                        </div>
                      </div>
                      
                      {/* UI Library */}
                      <div className="absolute bottom-2 w-[90%] mx-[5%] h-5 text-center">
                        <div className="text-[8px] text-blue-300 bg-blue-900/30 rounded border border-blue-500/20 py-0.5">
                          shadcn/ui Components
                        </div>
                      </div>
                    </div>
                    
                    {/* Backend Section */}
                    <div className="absolute top-0 right-0 w-[45%] h-[70%] border border-green-500/30 rounded-lg bg-green-950/30 p-2">
                      <div className="text-xs text-green-400 font-semibold mb-1 border-b border-green-500/30 pb-1 flex justify-between items-center">
                        <span>Simulated Backend</span>
                        <span className="text-[8px] bg-yellow-950 text-yellow-400 px-1 rounded">No Real Infrastructure</span>
                      </div>
                      
                      {/* Data Generation */}
                      <div className="absolute top-8 left-3 w-[45%] h-20 border border-green-500/20 rounded bg-green-900/20 p-1">
                        <div className="text-[10px] text-green-300 font-medium">Data Generation</div>
                        <div className="text-[8px] text-slate-300 mt-1">
                          • Mock Metrics
                          <br />• Mock Logs
                          <br />• Mock Alerts
                        </div>
                      </div>
                      
                      {/* Simulation Logic */}
                      <div className="absolute top-8 right-3 w-[45%] h-20 border border-green-500/20 rounded bg-green-900/20 p-1">
                        <div className="text-[10px] text-green-300 font-medium">Simulation Logic</div>
                        <div className="text-[8px] text-slate-300 mt-1">
                          • Event Triggers
                          <br />• Real-time Updates
                          <br />• Data Correlation
                        </div>
                      </div>
                      
                      {/* Local Storage */}
                      <div className="absolute bottom-2 w-[90%] mx-[5%] h-5 text-center">
                        <div className="text-[8px] text-green-300 bg-green-900/30 rounded border border-green-500/20 py-0.5">
                          Browser Context & Local Storage
                        </div>
                      </div>
                    </div>
                    
                    {/* Authentication & Settings */}
                    <div className="absolute bottom-0 left-0 w-[45%] h-[25%] border border-purple-500/30 rounded-lg bg-purple-950/30 p-2">
                      <div className="text-xs text-purple-400 font-semibold mb-1">
                        Auth & Settings
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="text-[8px] text-slate-300">
                          • Authentication
                          <br />• User Preferences
                        </div>
                        <div className="text-[8px] text-slate-300">
                          • Alert Thresholds
                          <br />• Dark/Light Mode
                        </div>
                      </div>
                    </div>
                    
                    {/* Tech Stack */}
                    <div className="absolute bottom-0 right-0 w-[45%] h-[25%] border border-amber-500/30 rounded-lg bg-amber-950/30 p-2">
                      <div className="text-xs text-amber-400 font-semibold mb-1">
                        Tech Stack (Simulated)
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        <div className="text-[7px] text-center">
                          <div className="w-5 h-5 bg-blue-600 rounded-full mx-auto mb-0.5 flex items-center justify-center text-white font-bold">J</div>
                          Jenkins
                        </div>
                        <div className="text-[7px] text-center">
                          <div className="w-5 h-5 bg-blue-400 rounded-full mx-auto mb-0.5 flex items-center justify-center text-white font-bold">D</div>
                          Docker
                        </div>
                        <div className="text-[7px] text-center">
                          <div className="w-5 h-5 bg-orange-500 rounded-full mx-auto mb-0.5 flex items-center justify-center text-white font-bold">A</div>
                          AWS
                        </div>
                        <div className="text-[7px] text-center">
                          <div className="w-5 h-5 bg-slate-800 rounded-full mx-auto mb-0.5 flex items-center justify-center text-white font-bold">G</div>
                          GitHub
                        </div>
                      </div>
                    </div>
                    
                    {/* Data Flow Arrows */}
                    <div className="absolute top-[35%] left-[45%] w-[10%] h-4 flex items-center justify-center">
                      <div className="h-0.5 bg-cyan-500 w-full relative">
                        <div className="absolute right-0 top-[-3px] border-t-[4px] border-r-[4px] border-b-[4px] border-t-transparent border-r-cyan-500 border-b-transparent"></div>
                        <div className="absolute left-0 top-[-3px] border-t-[4px] border-l-[4px] border-b-[4px] border-t-transparent border-l-cyan-500 border-b-transparent"></div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute bottom-[-20px] left-[30%] right-[30%] flex justify-center space-x-3 text-[8px]">
                      <span className="text-blue-400">— Frontend</span>
                      <span className="text-green-400">— Backend (Simulated)</span>
                      <span className="text-purple-400">— Settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
