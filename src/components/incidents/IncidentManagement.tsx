
import React, { useState, useEffect } from 'react';
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  Loader2,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IncidentStatus, IncidentSeverity, Incident, IncidentEvent, IncidentEventType } from '@/lib/dataGeneration/types';
import { ExtendedAlertData } from '@/lib/dataGeneration/types';

export function IncidentManagement() {
  const { data } = useDashboardContext();
  const [activeIncidents, setActiveIncidents] = useState<Incident[]>([]);
  const [resolvedIncidents, setResolvedIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showNewIncidentDialog, setShowNewIncidentDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    severity: 'medium' as IncidentSeverity
  });
  const [newComment, setNewComment] = useState('');
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'all'>('all');
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  // Mock user data
  const users = [
    { id: "user1", name: "John Smith", avatar: "/placeholder.svg" },
    { id: "user2", name: "Maria Garcia", avatar: "/placeholder.svg" },
    { id: "user3", name: "David Chen", avatar: "/placeholder.svg" },
  ];

  useEffect(() => {
    // Initialize with some mock incidents
    const mockIncidents: Incident[] = [
      {
        id: "inc-1",
        title: "Database Connection Failure",
        description: "Production database connections are timing out intermittently",
        status: "investigating",
        severity: "high",
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(),
        assignedTo: "user1",
        events: [
          {
            id: "ev-1",
            incidentId: "inc-1",
            type: "creation" as IncidentEventType,
            content: "Incident created",
            timestamp: new Date(Date.now() - 3600000),
            user: "user3",
          },
          {
            id: "ev-2",
            incidentId: "inc-1",
            type: "status-change" as IncidentEventType,
            content: "Status changed from 'open' to 'investigating'",
            timestamp: new Date(Date.now() - 3000000),
            user: "user1",
          },
          {
            id: "ev-3",
            incidentId: "inc-1",
            type: "comment" as IncidentEventType,
            content: "Investigating database connection pool settings",
            timestamp: new Date(Date.now() - 1800000),
            user: "user1",
          }
        ]
      },
      {
        id: "inc-2",
        title: "API Gateway High Latency",
        description: "API Gateway response times have increased by 200% in the last hour",
        status: "open",
        severity: "medium",
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 5400000),
        events: [
          {
            id: "ev-4",
            incidentId: "inc-2",
            type: "creation" as IncidentEventType,
            content: "Incident created",
            timestamp: new Date(Date.now() - 7200000),
            user: "user2",
          }
        ]
      }
    ];

    const resolvedMockIncidents: Incident[] = [
      {
        id: "inc-3",
        title: "Frontend CDN Outage",
        description: "CDN provider reporting partial outage affecting asset delivery",
        status: "resolved",
        severity: "high",
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 43200000),
        resolvedAt: new Date(Date.now() - 43200000),
        assignedTo: "user2",
        events: [
          {
            id: "ev-5",
            incidentId: "inc-3",
            type: "creation" as IncidentEventType,
            content: "Incident created",
            timestamp: new Date(Date.now() - 86400000),
            user: "user3",
          },
          {
            id: "ev-6",
            incidentId: "inc-3",
            type: "status-change" as IncidentEventType,
            content: "Status changed from 'open' to 'investigating'",
            timestamp: new Date(Date.now() - 82800000),
            user: "user2",
          },
          {
            id: "ev-7",
            incidentId: "inc-3",
            type: "comment" as IncidentEventType,
            content: "CDN provider has confirmed the issue on their status page",
            timestamp: new Date(Date.now() - 75600000),
            user: "user2",
          },
          {
            id: "ev-8",
            incidentId: "inc-3",
            type: "resolution" as IncidentEventType,
            content: "CDN provider has resolved the outage. Services back to normal.",
            timestamp: new Date(Date.now() - 43200000),
            user: "user2",
          }
        ]
      }
    ];

    setActiveIncidents(mockIncidents);
    setResolvedIncidents(resolvedMockIncidents);
  }, []);

  useEffect(() => {
    // Check for new alerts that might become incidents
    const criticalAlerts = data.alerts.filter(
      alert => alert.type === 'error' && !alert.acknowledged
    ) as ExtendedAlertData[];

    criticalAlerts.forEach(alert => {
      const relatedIncident = [...activeIncidents, ...resolvedIncidents].find(
        inc => inc.title.includes(alert.message) || inc.description.includes(alert.message)
      );

      if (!relatedIncident && Math.random() > 0.7) {
        // Create new incident from alert
        const newAutoIncident: Incident = {
          id: `inc-auto-${Date.now()}`,
          title: `Incident: ${alert.message}`,
          description: `Automatically created from alert: ${alert.message}. Source: ${alert.source || 'Unknown'}`,
          status: 'open',
          severity: alert.type === 'error' ? 'high' : 'medium',
          createdAt: new Date(),
          updatedAt: new Date(),
          events: [
            {
              id: `ev-auto-${Date.now()}`,
              incidentId: `inc-auto-${Date.now()}`,
              type: 'creation',
              content: 'Automatically created from monitoring alert',
              timestamp: new Date(),
              user: 'system'
            }
          ]
        };

        setActiveIncidents(prev => [...prev, newAutoIncident]);
        
        toast.warning('New incident created', {
          description: `${alert.message}`,
          duration: 5000
        });
      }
    });
  }, [data.alerts, activeIncidents, resolvedIncidents]);

  const handleCreateIncident = () => {
    if (!newIncident.title || !newIncident.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const incident: Incident = {
      id: `inc-${Date.now()}`,
      title: newIncident.title,
      description: newIncident.description,
      status: 'open',
      severity: newIncident.severity,
      createdAt: new Date(),
      updatedAt: new Date(),
      events: [
        {
          id: `ev-${Date.now()}`,
          incidentId: `inc-${Date.now()}`,
          type: 'creation',
          content: 'Incident created',
          timestamp: new Date(),
          user: 'user1'
        }
      ]
    };

    setActiveIncidents(prev => [...prev, incident]);
    setShowNewIncidentDialog(false);
    setNewIncident({
      title: '',
      description: '',
      severity: 'medium'
    });

    toast.success('Incident created', {
      description: 'New incident has been created successfully',
      duration: 3000
    });
  };

  const handleUpdateStatus = (incident: Incident, newStatus: IncidentStatus) => {
    const updatedIncident = {
      ...incident,
      status: newStatus,
      updatedAt: new Date(),
      resolvedAt: newStatus === 'resolved' ? new Date() : incident.resolvedAt,
      events: [
        ...incident.events,
        {
          id: `ev-${Date.now()}`,
          incidentId: incident.id,
          type: 'status-change',
          content: `Status changed from '${incident.status}' to '${newStatus}'`,
          timestamp: new Date(),
          user: 'user1'
        }
      ]
    };

    if (newStatus === 'resolved' || newStatus === 'closed') {
      setActiveIncidents(prev => prev.filter(inc => inc.id !== incident.id));
      setResolvedIncidents(prev => [...prev, updatedIncident]);
    } else {
      setActiveIncidents(prev => 
        prev.map(inc => inc.id === incident.id ? updatedIncident : inc)
      );
    }

    if (selectedIncident?.id === incident.id) {
      setSelectedIncident(updatedIncident);
    }

    toast.success('Status updated', {
      description: `Incident status changed to ${newStatus}`,
      duration: 3000
    });
  };

  const handleAddComment = () => {
    if (!selectedIncident || !newComment.trim()) return;

    const updatedIncident = {
      ...selectedIncident,
      updatedAt: new Date(),
      events: [
        ...selectedIncident.events,
        {
          id: `ev-${Date.now()}`,
          incidentId: selectedIncident.id,
          type: 'comment',
          content: newComment,
          timestamp: new Date(),
          user: 'user1'
        }
      ]
    };

    if (selectedIncident.status === 'resolved' || selectedIncident.status === 'closed') {
      setResolvedIncidents(prev => 
        prev.map(inc => inc.id === selectedIncident.id ? updatedIncident : inc)
      );
    } else {
      setActiveIncidents(prev => 
        prev.map(inc => inc.id === selectedIncident.id ? updatedIncident : inc)
      );
    }

    setSelectedIncident(updatedIncident);
    setNewComment('');
    setShowCommentDialog(false);

    toast.success('Comment added', {
      description: 'Your comment has been added to the incident',
      duration: 3000
    });
  };

  const handleAssign = (incident: Incident, userId: string) => {
    const updatedIncident = {
      ...incident,
      assignedTo: userId,
      updatedAt: new Date(),
      events: [
        ...incident.events,
        {
          id: `ev-${Date.now()}`,
          incidentId: incident.id,
          type: 'update',
          content: `Incident assigned to ${users.find(u => u.id === userId)?.name || userId}`,
          timestamp: new Date(),
          user: 'user1'
        }
      ]
    };

    if (incident.status === 'resolved' || incident.status === 'closed') {
      setResolvedIncidents(prev => 
        prev.map(inc => inc.id === incident.id ? updatedIncident : inc)
      );
    } else {
      setActiveIncidents(prev => 
        prev.map(inc => inc.id === incident.id ? updatedIncident : inc)
      );
    }

    if (selectedIncident?.id === incident.id) {
      setSelectedIncident(updatedIncident);
    }

    toast.success('Incident assigned', {
      description: `Incident assigned to ${users.find(u => u.id === userId)?.name || userId}`,
      duration: 3000
    });
  };

  const toggleEventExpand = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const filteredActiveIncidents = activeIncidents.filter(incident => {
    if (filterStatus !== 'all' && incident.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && incident.severity !== filterSeverity) return false;
    return true;
  });

  const filteredResolvedIncidents = resolvedIncidents.filter(incident => {
    if (filterSeverity !== 'all' && incident.severity !== filterSeverity) return false;
    return true;
  });

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="bg-red-950 text-red-400 border-red-800">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-950 text-orange-400 border-orange-800">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-950 text-yellow-400 border-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-950 text-green-400 border-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-950 text-blue-400 border-blue-800">Open</Badge>;
      case 'investigating':
        return <Badge variant="outline" className="bg-purple-950 text-purple-400 border-purple-800">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-950 text-green-400 border-green-800">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-slate-950 text-slate-400 border-slate-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="card-glass">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle size={18} />
          <span>Incident Management</span>
        </CardTitle>
        <Button size="sm" onClick={() => setShowNewIncidentDialog(true)}>
          <Plus size={16} className="mr-2" />
          New Incident
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Status:</span>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as any)}
              >
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Severity:</span>
              <Select
                value={filterSeverity}
                onValueChange={(value) => setFilterSeverity(value as any)}
              >
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Filter severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            {activeIncidents.length} active, {resolvedIncidents.length} resolved
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Incidents</TabsTrigger>
                <TabsTrigger value="resolved">Resolved Incidents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-2">
                {filteredActiveIncidents.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No active incidents matching the current filters
                  </div>
                ) : (
                  filteredActiveIncidents.map(incident => (
                    <div 
                      key={incident.id}
                      className={`p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800/50 ${
                        selectedIncident?.id === incident.id ? 'ring-1 ring-blue-500 bg-slate-800/50' : ''
                      }`}
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{incident.title}</div>
                        {getSeverityBadge(incident.severity)}
                      </div>
                      <div className="text-sm text-slate-400 mt-1 truncate">{incident.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span className="text-xs text-slate-400">
                            {new Date(incident.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div>{getStatusBadge(incident.status)}</div>
                      </div>
                      {incident.assignedTo && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={users.find(u => u.id === incident.assignedTo)?.avatar} />
                            <AvatarFallback className="text-[10px]">
                              {users.find(u => u.id === incident.assignedTo)?.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-slate-400">
                            Assigned to {users.find(u => u.id === incident.assignedTo)?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="resolved" className="space-y-2">
                {filteredResolvedIncidents.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No resolved incidents matching the current filters
                  </div>
                ) : (
                  filteredResolvedIncidents.map(incident => (
                    <div 
                      key={incident.id}
                      className={`p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800/50 ${
                        selectedIncident?.id === incident.id ? 'ring-1 ring-blue-500 bg-slate-800/50' : ''
                      }`}
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{incident.title}</div>
                        {getSeverityBadge(incident.severity)}
                      </div>
                      <div className="text-sm text-slate-400 mt-1 truncate">{incident.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span className="text-xs text-slate-400">
                            {new Date(incident.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div>{getStatusBadge(incident.status)}</div>
                      </div>
                      {incident.resolvedAt && (
                        <div className="flex items-center gap-2 mt-2">
                          <Clock size={14} />
                          <span className="text-xs text-green-400">
                            Resolved at {new Date(incident.resolvedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="border border-slate-700 rounded-lg p-4">
            {selectedIncident ? (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{selectedIncident.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div>{getStatusBadge(selectedIncident.status)}</div>
                      <div>{getSeverityBadge(selectedIncident.severity)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedIncident.status !== 'resolved' && selectedIncident.status !== 'closed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleUpdateStatus(selectedIncident, 'resolved')}
                      >
                        Resolve
                      </Button>
                    )}
                    {selectedIncident.status === 'open' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleUpdateStatus(selectedIncident, 'investigating')}
                      >
                        Investigate
                      </Button>
                    )}
                    {selectedIncident.status === 'resolved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleUpdateStatus(selectedIncident, 'closed')}
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-slate-300">{selectedIncident.description}</div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>Created: {new Date(selectedIncident.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>Updated: {new Date(selectedIncident.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Assigned To</div>
                    <Select
                      value={selectedIncident.assignedTo || ''}
                      onValueChange={(value) => handleAssign(selectedIncident, value)}
                    >
                      <SelectTrigger className="h-8 w-48">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-[10px]">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              {user.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedIncident.assignedTo && (
                    <div className="flex items-center gap-2 mb-4 p-2 bg-slate-800 rounded-md">
                      <Avatar>
                        <AvatarImage src={users.find(u => u.id === selectedIncident.assignedTo)?.avatar} />
                        <AvatarFallback>
                          {users.find(u => u.id === selectedIncident.assignedTo)?.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {users.find(u => u.id === selectedIncident.assignedTo)?.name}
                        </div>
                        <div className="text-xs text-slate-400">Assigned responder</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Activity Timeline</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => setShowCommentDialog(true)}
                  >
                    <MessageSquare size={14} className="mr-1" />
                    Add Comment
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 pr-4" style={{ maxHeight: '300px' }}>
                  <div className="space-y-3">
                    {selectedIncident.events.map((event, index) => {
                      const user = users.find(u => u.id === event.user) || { name: event.user, avatar: "/placeholder.svg" };
                      const isExpanded = expandedEvents[event.id] || false;
                      
                      return (
                        <div key={event.id} className="relative pl-6 pb-4">
                          {index < selectedIncident.events.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-700"></div>
                          )}
                          
                          <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                            {event.type === 'creation' && <Plus size={12} />}
                            {event.type === 'status-change' && <AlertCircle size={12} />}
                            {event.type === 'comment' && <MessageSquare size={12} />}
                            {event.type === 'update' && <Loader2 size={12} />}
                            {event.type === 'resolution' && <CheckCheck size={12} />}
                          </div>
                          
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-[10px]">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-xs font-medium">{user.name}</div>
                                <div className="text-xs text-slate-400">
                                  {new Date(event.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            {event.type === 'comment' && event.content.length > 100 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleEventExpand(event.id)}
                              >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </Button>
                            )}
                          </div>
                          
                          <div className={`mt-2 text-sm ${event.type === 'comment' && !isExpanded && event.content.length > 100 ? 'line-clamp-2' : ''}`}>
                            {event.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                <AlertCircle size={48} className="mb-4 opacity-50" />
                <div className="text-lg font-medium">No Incident Selected</div>
                <div className="text-sm mt-2 text-center max-w-xs">
                  Select an incident from the list to view details, add comments and manage resolution.
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={showNewIncidentDialog} onOpenChange={setShowNewIncidentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={newIncident.title}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief incident title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={newIncident.description}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the incident"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select
                  value={newIncident.severity}
                  onValueChange={(value: IncidentSeverity) => setNewIncident(prev => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewIncidentDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateIncident}>Create Incident</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment</label>
                <Textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment or update"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCommentDialog(false)}>Cancel</Button>
              <Button onClick={handleAddComment}>Add Comment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
