
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, MessageSquare, RefreshCw, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IncidentEvent {
  id: string;
  incidentId: string;
  type: 'creation' | 'update' | 'comment' | 'status-change' | 'resolution';
  content: string;
  timestamp: Date;
  user: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  events: IncidentEvent[];
  assignedTo?: string;
}

interface TimelineVisualizationProps {
  incident: Incident;
}

export function TimelineVisualization({ incident }: TimelineVisualizationProps) {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...incident.events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'creation':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'status-change':
        return <RefreshCw className="h-5 w-5 text-amber-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'resolution':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'update':
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-slate-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Open</Badge>;
      case 'investigating':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative pl-6">
              {/* Timeline connector */}
              {index < sortedEvents.length - 1 && (
                <div className="absolute left-[10px] top-[24px] bottom-[-32px] w-[1px] bg-slate-700" />
              )}
              
              <div className="flex items-start">
                {/* Event icon */}
                <div className="absolute left-0 top-0 rounded-full bg-slate-900 p-[2px]">
                  {getEventIcon(event.type)}
                </div>
                
                {/* Event content */}
                <div className="ml-2 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium">{event.content}</p>
                    <div className="flex items-center text-xs text-slate-400 sm:ml-4">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(new Date(event.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {event.user}
                    </div>
                    
                    {event.type === 'status-change' && (
                      <div className="flex items-center">
                        {getStatusBadge(event.content.split('to ')[1])}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {sortedEvents.length === 0 && (
            <p className="text-center text-sm text-slate-400">No events recorded yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
