
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { IncidentTimeline } from "./IncidentTimeline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: "open" | "investigating" | "resolved" | "closed";
  severity: "low" | "medium" | "high" | "critical";
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  events: IncidentEvent[];
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  type: "creation" | "update" | "comment" | "status-change" | "resolution";
  content: string;
  timestamp: Date;
  user?: string;
}

export function IncidentManagement() {
  const { data } = useDashboardContext();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newIncidentOpen, setNewIncidentOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium" as const
  });
  const [newComment, setNewComment] = useState("");
  
  // Generate mock incidents on mount
  useEffect(() => {
    // Create sample incidents based on alerts
    const mockIncidents: Incident[] = [
      {
        id: "inc-1",
        title: "High CPU Usage in Production",
        description: "CPU usage has spiked to over 90% on multiple production servers.",
        status: "investigating",
        severity: "high",
        createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1800000), // 30 minutes ago
        assignedTo: "John Doe",
        events: [
          {
            id: "ev-1",
            incidentId: "inc-1",
            type: "creation",
            content: "Incident created due to CPU alert",
            timestamp: new Date(Date.now() - 3600000 * 2),
            user: "System"
          },
          {
            id: "ev-2",
            incidentId: "inc-1",
            type: "status-change",
            content: "Status changed to Investigating",
            timestamp: new Date(Date.now() - 3000000),
            user: "John Doe"
          },
          {
            id: "ev-3",
            incidentId: "inc-1",
            type: "comment",
            content: "Initial investigation shows a runaway process on web servers",
            timestamp: new Date(Date.now() - 1800000),
            user: "John Doe"
          }
        ]
      },
      {
        id: "inc-2",
        title: "Database Connection Failures",
        description: "Applications are reporting intermittent database connection failures.",
        status: "resolved",
        severity: "critical",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 43200000), // 12 hours ago
        assignedTo: "Jane Smith",
        events: [
          {
            id: "ev-4",
            incidentId: "inc-2",
            type: "creation",
            content: "Incident created due to DB connection alerts",
            timestamp: new Date(Date.now() - 86400000),
            user: "System"
          },
          {
            id: "ev-5",
            incidentId: "inc-2",
            type: "status-change",
            content: "Status changed to Investigating",
            timestamp: new Date(Date.now() - 82800000),
            user: "Jane Smith"
          },
          {
            id: "ev-6",
            incidentId: "inc-2",
            type: "comment",
            content: "Database connection pool configuration issue identified",
            timestamp: new Date(Date.now() - 64800000),
            user: "Jane Smith"
          },
          {
            id: "ev-7",
            incidentId: "inc-2",
            type: "resolution",
            content: "Connection pool size increased and monitoring configured",
            timestamp: new Date(Date.now() - 43200000),
            user: "Jane Smith"
          }
        ]
      }
    ];
    
    // Add incidents for unacknowledged alerts
    const alertIncidents = data.alerts
      .filter(alert => !alert.acknowledged && alert.type === "error")
      .slice(0, 2) // Limit to first 2 unacknowledged error alerts
      .map((alert, index) => {
        const now = Date.now();
        const createdAt = new Date(now - Math.random() * 3600000 * 6); // 0-6 hours ago
        return {
          id: `inc-auto-${index + 3}`,
          title: `Alert: ${alert.message}`,
          description: `Automatically created incident from alert: ${alert.message}. Source: ${alert.source}`,
          status: "open" as const,
          severity: "medium" as const,
          createdAt,
          updatedAt: createdAt,
          events: [
            {
              id: `ev-auto-${index + 8}`,
              incidentId: `inc-auto-${index + 3}`,
              type: "creation" as const,
              content: `Incident automatically created from alert: ${alert.message}`,
              timestamp: createdAt,
              user: "System"
            }
          ]
        };
      });
    
    setIncidents([...mockIncidents, ...alertIncidents]);
    setSelectedIncident(mockIncidents[0]);
  }, [data.alerts]);
  
  const handleCreateIncident = () => {
    const now = new Date();
    const newId = `inc-${Date.now()}`;
    const newIncidentObj: Incident = {
      id: newId,
      title: newIncident.title,
      description: newIncident.description,
      status: "open",
      severity: newIncident.severity,
      createdAt: now,
      updatedAt: now,
      events: [
        {
          id: `ev-${Date.now()}`,
          incidentId: newId,
          type: "creation",
          content: "Incident created manually",
          timestamp: now,
          user: "Current User"
        }
      ]
    };
    
    setIncidents([newIncidentObj, ...incidents]);
    setSelectedIncident(newIncidentObj);
    setNewIncidentOpen(false);
    setNewIncident({
      title: "",
      description: "",
      severity: "medium"
    });
    
    toast.success("Incident created successfully");
  };
  
  const handleStatusChange = (incidentId: string, newStatus: Incident["status"]) => {
    setIncidents(incidents.map(inc => {
      if (inc.id === incidentId) {
        const now = new Date();
        const updatedIncident = {
          ...inc,
          status: newStatus,
          updatedAt: now,
          events: [
            ...inc.events,
            {
              id: `ev-${Date.now()}`,
              incidentId,
              type: "status-change",
              content: `Status changed to ${newStatus}`,
              timestamp: now,
              user: "Current User"
            }
          ]
        };
        
        if (selectedIncident?.id === incidentId) {
          setSelectedIncident(updatedIncident);
        }
        
        return updatedIncident;
      }
      return inc;
    }));
    
    toast.success(`Incident status updated to ${newStatus}`);
  };
  
  const handleAddComment = (incidentId: string) => {
    if (!newComment.trim()) return;
    
    setIncidents(incidents.map(inc => {
      if (inc.id === incidentId) {
        const now = new Date();
        const updatedIncident = {
          ...inc,
          updatedAt: now,
          events: [
            ...inc.events,
            {
              id: `ev-${Date.now()}`,
              incidentId,
              type: "comment",
              content: newComment,
              timestamp: now,
              user: "Current User"
            }
          ]
        };
        
        if (selectedIncident?.id === incidentId) {
          setSelectedIncident(updatedIncident);
        }
        
        return updatedIncident;
      }
      return inc;
    }));
    
    setNewComment("");
    toast.success("Comment added successfully");
  };
  
  const handleExportIncident = (incident: Incident) => {
    const data = JSON.stringify(incident, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-${incident.id}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Incident data exported successfully");
  };
  
  const getSeverityColor = (severity: Incident["severity"]) => {
    switch (severity) {
      case "low": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "high": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "critical": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    }
  };
  
  const getStatusColor = (status: Incident["status"]) => {
    switch (status) {
      case "open": return "bg-blue-500/10 text-blue-500";
      case "investigating": return "bg-purple-500/10 text-purple-500";
      case "resolved": return "bg-green-500/10 text-green-500";
      case "closed": return "bg-gray-500/10 text-gray-500";
    }
  };
  
  return (
    <div className="container py-16 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incident Management</h1>
        
        <Dialog open={newIncidentOpen} onOpenChange={setNewIncidentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Incident
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Incident</DialogTitle>
              <DialogDescription>
                Fill out the details to create a new incident.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newIncident.title} 
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})} 
                  placeholder="Brief incident title" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newIncident.description} 
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})} 
                  placeholder="Detailed description of the incident" 
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={newIncident.severity} 
                  onValueChange={(value) => setNewIncident({
                    ...newIncident, 
                    severity: value as "low" | "medium" | "high" | "critical"
                  })}
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
              <Button 
                variant="outline" 
                onClick={() => setNewIncidentOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateIncident}
                disabled={!newIncident.title || !newIncident.description}
              >
                Create Incident
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Incidents</CardTitle>
            <CardDescription>
              {incidents.length} incidents total, {incidents.filter(i => i.status !== "closed" && i.status !== "resolved").length} active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="resolved" className="flex-1">Resolved</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-2">
                {incidents
                  .filter(i => i.status !== "closed" && i.status !== "resolved")
                  .map(incident => (
                    <div 
                      key={incident.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedIncident?.id === incident.id ? 'bg-accent' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant="outline" className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-muted-foreground">
                          {new Date(incident.createdAt).toLocaleString()}
                        </div>
                        <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                {incidents.filter(i => i.status !== "closed" && i.status !== "resolved").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active incidents
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="space-y-2">
                {incidents.map(incident => (
                  <div 
                    key={incident.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedIncident?.id === incident.id ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{incident.title}</h3>
                      <Badge variant="outline" className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-muted-foreground">
                        {new Date(incident.createdAt).toLocaleString()}
                      </div>
                      <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="resolved" className="space-y-2">
                {incidents
                  .filter(i => i.status === "closed" || i.status === "resolved")
                  .map(incident => (
                    <div 
                      key={incident.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedIncident?.id === incident.id ? 'bg-accent' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant="outline" className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-muted-foreground">
                          {new Date(incident.createdAt).toLocaleString()}
                        </div>
                        <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                {incidents.filter(i => i.status === "closed" || i.status === "resolved").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No resolved incidents
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          {selectedIncident ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{selectedIncident.title}</CardTitle>
                    <CardDescription>
                      Created {new Date(selectedIncident.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportIncident(selectedIncident)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    
                    {selectedIncident.status === "open" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(selectedIncident.id, "investigating")}
                      >
                        Start Investigation
                      </Button>
                    )}
                    
                    {selectedIncident.status === "investigating" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(selectedIncident.id, "resolved")}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    
                    {selectedIncident.status === "resolved" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(selectedIncident.id, "closed")}
                      >
                        Close Incident
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className={getStatusColor(selectedIncident.status)}>
                    {selectedIncident.status}
                  </Badge>
                  <Badge variant="outline" className={getSeverityColor(selectedIncident.severity)}>
                    {selectedIncident.severity}
                  </Badge>
                  {selectedIncident.assignedTo && (
                    <Badge variant="outline">
                      Assigned: {selectedIncident.assignedTo}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">Timeline</h3>
                  <IncidentTimeline events={selectedIncident.events} />
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Add Comment</h3>
                  <div className="flex gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or update..."
                      className="flex-1"
                    />
                    <Button 
                      className="self-end"
                      onClick={() => handleAddComment(selectedIncident.id)}
                      disabled={!newComment.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                Select an incident to view details
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
