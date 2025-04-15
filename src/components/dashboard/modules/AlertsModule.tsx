
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, CheckCircle, ChevronRight, AlertTriangle, XCircle } from "lucide-react";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      </CardContent>
    </Card>
  );
}
