
import { IncidentEvent } from "./IncidentManagement";
import { Circle, MessageSquare, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface IncidentTimelineProps {
  events: IncidentEvent[];
}

export function IncidentTimeline({ events }: IncidentTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Helper to get icon for event type
  const getEventIcon = (type: IncidentEvent["type"], className = "h-5 w-5") => {
    switch (type) {
      case "creation":
        return <AlertTriangle className={`${className} text-blue-500`} />;
      case "update":
        return <Clock className={`${className} text-amber-500`} />;
      case "comment":
        return <MessageSquare className={`${className} text-purple-500`} />;
      case "status-change":
        return <ArrowRight className={`${className} text-green-500`} />;
      case "resolution":
        return <CheckCircle className={`${className} text-emerald-500`} />;
      default:
        return <Circle className={`${className} text-gray-500`} />;
    }
  };
  
  return (
    <div className="space-y-4">
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-8 flex items-center">
              {getEventIcon(event.type)}
            </div>
            {index < sortedEvents.length - 1 && (
              <div className="w-px h-full bg-border" />
            )}
          </div>
          
          <div className="space-y-1 pb-4">
            <div className="flex items-baseline gap-2">
              <span className="font-medium">
                {event.user || "System"}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm">{event.content}</p>
          </div>
        </div>
      ))}
      
      {events.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No events to display
        </div>
      )}
    </div>
  );
}
