
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  CheckCheck,
  Filter,
  X,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AlertsModule() {
  const { data, setData } = useDashboardContext();
  const [filter, setFilter] = useState<string | null>(null);
  const [newAlerts, setNewAlerts] = useState<string[]>([]);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);
  
  // Check for new alerts and animate them
  useEffect(() => {
    const unacknowledgedAlerts = data.alerts.filter(alert => !alert.acknowledged);
    const newAlertIds = unacknowledgedAlerts
      .filter(alert => !newAlerts.includes(alert.id))
      .map(alert => alert.id);
    
    if (newAlertIds.length > 0) {
      setNewAlerts(prev => [...prev, ...newAlertIds]);
      
      // Remove animation class after 5 seconds
      setTimeout(() => {
        setNewAlerts(prev => prev.filter(id => !newAlertIds.includes(id)));
      }, 5000);
    }
  }, [data.alerts]);
  
  const handleAcknowledge = (id: string) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    }));
    
    toast.success("Alert acknowledged", {
      description: "The alert has been marked as acknowledged"
    });
  };
  
  const handleDelete = (id: string) => {
    setAlertToDelete(id);
  };
  
  const confirmDelete = () => {
    if (alertToDelete) {
      setData(prev => ({
        ...prev,
        alerts: prev.alerts.filter(alert => alert.id !== alertToDelete)
      }));
      
      setAlertToDelete(null);
      
      toast.success("Alert deleted", {
        description: "The alert has been removed from the system"
      });
    }
  };
  
  const acknowledgeAll = () => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => ({ ...alert, acknowledged: true }))
    }));
    
    toast.success("All alerts acknowledged", {
      description: "All alerts have been marked as acknowledged"
    });
  };
  
  const deleteAll = () => {
    setData(prev => ({
      ...prev,
      alerts: []
    }));
    
    toast.success("All alerts deleted", {
      description: "All alerts have been removed from the system"
    });
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'info':
        return <Info size={16} className="text-blue-400" />;
      default:
        return null;
    }
  };
  
  const getAlertClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };
  
  const filteredAlerts = filter 
    ? data.alerts.filter(alert => 
        (filter === 'acknowledged' && alert.acknowledged) || 
        (filter === 'active' && !alert.acknowledged) ||
        filter === alert.type
      )
    : data.alerts;
    
  // Group alerts by day
  const groupedAlerts = filteredAlerts.reduce((groups, alert) => {
    const date = new Date(alert.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(alert);
    return groups;
  }, {} as Record<string, typeof data.alerts>);
  
  const dates = Object.keys(groupedAlerts).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Count active alerts
  const activeAlerts = data.alerts.filter(alert => !alert.acknowledged).length;
  
  // Calculate alert stats
  const errorCount = data.alerts.filter(alert => alert.type === 'error').length;
  const warningCount = data.alerts.filter(alert => alert.type === 'warning').length;
  const infoCount = data.alerts.filter(alert => alert.type === 'info').length;
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <span>Alerts & Notifications</span>
            {activeAlerts > 0 && (
              <Alert className={cn(
                "py-1 px-2 ml-2 border-none inline-flex items-center h-6",
                "bg-red-500/20 text-red-400"
              )}>
                <span className="text-xs font-medium">
                  {activeAlerts} active
                </span>
              </Alert>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Filter size={14} />
              <span>Filter:</span>
            </div>
            
            <button
              onClick={() => setFilter(null)}
              className={cn(
                "text-xs px-2 py-0.5 rounded-md border border-slate-700",
                filter === null ? "bg-blue-500/20 text-blue-400" : "hover:bg-slate-800"
              )}
            >
              All
            </button>
            
            <button
              onClick={() => setFilter('active')}
              className={cn(
                "text-xs px-2 py-0.5 rounded-md border border-slate-700",
                filter === 'active' ? "bg-blue-500/20 text-blue-400" : "hover:bg-slate-800"
              )}
            >
              Active
            </button>
            
            <button
              onClick={() => setFilter('acknowledged')}
              className={cn(
                "text-xs px-2 py-0.5 rounded-md border border-slate-700",
                filter === 'acknowledged' ? "bg-blue-500/20 text-blue-400" : "hover:bg-slate-800"
              )}
            >
              Acknowledged
            </button>
            
            <button
              onClick={() => setFilter('error')}
              className={cn(
                "text-xs px-2 py-0.5 rounded-md border border-slate-700 flex items-center gap-1",
                filter === 'error' ? "bg-red-500/10 text-red-500" : "hover:bg-slate-800"
              )}
            >
              <AlertCircle size={12} />
              <span>Errors</span>
            </button>
            
            <button
              onClick={() => setFilter('warning')}
              className={cn(
                "text-xs px-2 py-0.5 rounded-md border border-slate-700 flex items-center gap-1",
                filter === 'warning' ? "bg-yellow-500/10 text-yellow-400" : "hover:bg-slate-800"
              )}
            >
              <AlertTriangle size={12} />
              <span>Warnings</span>
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400">Total Alerts</div>
            <div className="text-2xl font-semibold">{data.alerts.length}</div>
            <div className="flex mt-2 gap-2 text-xs text-slate-400">
              <span>Active: {activeAlerts}</span>
              <span>Acknowledged: {data.alerts.length - activeAlerts}</span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400">By Severity</div>
            <div className="flex items-end gap-2 mt-2">
              <div className="flex flex-col items-center">
                <div className="h-10 w-8 bg-red-950 rounded-sm relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-red-500/70"
                    style={{ height: `${(errorCount / Math.max(data.alerts.length, 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-1 text-red-400">{errorCount}</div>
                <div className="text-xs text-slate-500">Errors</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="h-10 w-8 bg-amber-950 rounded-sm relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-amber-500/70"
                    style={{ height: `${(warningCount / Math.max(data.alerts.length, 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-1 text-amber-400">{warningCount}</div>
                <div className="text-xs text-slate-500">Warnings</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="h-10 w-8 bg-blue-950 rounded-sm relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-blue-500/70"
                    style={{ height: `${(infoCount / Math.max(data.alerts.length, 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-1 text-blue-400">{infoCount}</div>
                <div className="text-xs text-slate-500">Info</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400">Actions</div>
            <div className="flex flex-col gap-2 mt-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    className="text-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-md"
                    disabled={activeAlerts === 0}
                  >
                    <CheckCheck size={12} />
                    <span>Acknowledge All</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Acknowledge All Alerts</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to acknowledge all {activeAlerts} active alerts? 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={acknowledgeAll}>Acknowledge All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    className="text-xs flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-md"
                    disabled={data.alerts.length === 0}
                  >
                    <X size={12} />
                    <span>Delete All</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Alerts</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all {data.alerts.length} alerts? 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAll} className="bg-red-600 hover:bg-red-500">
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        
        {activeAlerts > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={acknowledgeAll}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
            >
              <CheckCheck size={12} />
              <span>Acknowledge All</span>
            </button>
          </div>
        )}
        
        <div className="space-y-4">
          {dates.map((date) => (
            <div key={date}>
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                <div className="h-px bg-slate-700 flex-1"></div>
                <div>{date}</div>
                <div className="h-px bg-slate-700 flex-1"></div>
              </div>
              
              <div className="space-y-2">
                {groupedAlerts[date].map((alert) => (
                  <div 
                    key={alert.id}
                    className={cn(
                      "border rounded-lg p-3 transition-all duration-500",
                      alert.acknowledged 
                        ? "border-slate-800 opacity-60" 
                        : `border-l-4 ${getAlertClass(alert.type).split(' ').pop()}`,
                      newAlerts.includes(alert.id) && !alert.acknowledged && "animate-pulse bg-slate-800"
                    )}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <span className={cn(
                          "font-medium",
                          !alert.acknowledged && getAlertClass(alert.type).split(' ')[1]
                        )}>
                          {alert.message}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-400">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                        
                        {!alert.acknowledged ? (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="p-1 rounded-md hover:bg-slate-800"
                            title="Acknowledge Alert"
                          >
                            <CheckCircle size={16} className="text-slate-400 hover:text-green-500" />
                          </button>
                        ) : (
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <CheckCheck size={14} />
                            <span>Acknowledged</span>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="p-1 rounded-md hover:bg-slate-800"
                          title="Delete Alert"
                        >
                          <X size={16} className="text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    {alert.type === 'error' && !alert.acknowledged && (
                      <div className="mt-2 pl-6">
                        <div className="text-xs bg-red-950/30 p-2 rounded border border-red-900/50 text-red-300">
                          <div className="font-medium mb-1">Recommended Action:</div>
                          <div>Investigate immediately and address the underlying issue.</div>
                        </div>
                      </div>
                    )}
                    
                    {alert.type === 'warning' && !alert.acknowledged && (
                      <div className="mt-2 pl-6">
                        <div className="text-xs bg-amber-950/30 p-2 rounded border border-amber-900/50 text-amber-300">
                          <div className="font-medium mb-1">Recommended Action:</div>
                          <div>Monitor the situation and take action if it persists.</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Alert</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this alert? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAlertToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-500">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {filteredAlerts.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No alerts found matching your filter criteria
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
