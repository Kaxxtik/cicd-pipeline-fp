
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  CheckCheck,
  Filter,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function AlertsModule() {
  const { data, setData } = useDashboardContext();
  const [filter, setFilter] = useState<string | null>(null);
  
  const handleAcknowledge = (id: string) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    }));
  };
  
  const acknowledgeAll = () => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => ({ ...alert, acknowledged: true }))
    }));
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'info':
        return <Bell size={16} className="text-blue-400" />;
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
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <span>Alerts & Notifications</span>
            {activeAlerts > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                {activeAlerts} active
              </span>
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
                      "border rounded-lg p-3",
                      alert.acknowledged 
                        ? "border-slate-800 opacity-60" 
                        : `border-l-4 ${getAlertClass(alert.type).split(' ').pop()}`
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
                          >
                            <CheckCircle size={16} className="text-slate-400 hover:text-green-500" />
                          </button>
                        ) : (
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <CheckCheck size={14} />
                            <span>Acknowledged</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
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
