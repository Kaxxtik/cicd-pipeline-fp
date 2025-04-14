
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  User, 
  CheckCircle,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { format } from 'date-fns';
import { TimelineVisualization, Incident, IncidentEvent } from '@/components/incidents/TimelineVisualization';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Sample incident data for the demo
const sampleIncidents: Incident[] = [
  {
    id: '1',
    title: 'Database Connection Failure',
    description: 'Database servers are experiencing connection timeouts',
    status: 'resolved',
    severity: 'high',
    createdAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
    resolvedAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
    events: [
      {
        id: '1-1',
        incidentId: '1',
        type: 'creation',
        content: 'Incident created',
        timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        user: 'System Monitor'
      },
      {
        id: '1-2',
        incidentId: '1',
        type: 'status-change',
        content: 'Status changed to investigating',
        timestamp: new Date(new Date().getTime() - 23 * 60 * 60 * 1000),
        user: 'Admin User'
      },
      {
        id: '1-3',
        incidentId: '1',
        type: 'comment',
        content: 'Identified network issue between app servers and database cluster',
        timestamp: new Date(new Date().getTime() - 20 * 60 * 60 * 1000),
        user: 'Network Engineer'
      },
      {
        id: '1-4',
        incidentId: '1',
        type: 'resolution',
        content: 'Network routes reconfigured, all connections restored',
        timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
        user: 'Admin User'
      }
    ],
    assignedTo: 'Database Team'
  },
  {
    id: '2',
    title: 'API Gateway Latency',
    description: 'API Gateway is experiencing high latency affecting multiple services',
    status: 'investigating',
    severity: 'medium',
    createdAt: new Date(new Date().getTime() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
    events: [
      {
        id: '2-1',
        incidentId: '2',
        type: 'creation',
        content: 'Incident created',
        timestamp: new Date(new Date().getTime() - 3 * 60 * 60 * 1000),
        user: 'System Monitor'
      },
      {
        id: '2-2',
        incidentId: '2',
        type: 'status-change',
        content: 'Status changed to investigating',
        timestamp: new Date(new Date().getTime() - 2.5 * 60 * 60 * 1000),
        user: 'Admin User'
      },
      {
        id: '2-3',
        incidentId: '2',
        type: 'comment',
        content: 'Increased resources for API gateway instances',
        timestamp: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
        user: 'Platform Engineer'
      }
    ],
    assignedTo: 'API Team'
  },
  {
    id: '3',
    title: 'High Memory Usage on Web Servers',
    description: 'Web server cluster showing consistently high memory usage',
    status: 'open',
    severity: 'low',
    createdAt: new Date(new Date().getTime() - 30 * 60 * 1000),
    updatedAt: new Date(new Date().getTime() - 15 * 60 * 1000),
    events: [
      {
        id: '3-1',
        incidentId: '3',
        type: 'creation',
        content: 'Incident created',
        timestamp: new Date(new Date().getTime() - 30 * 60 * 1000),
        user: 'System Monitor'
      },
      {
        id: '3-2',
        incidentId: '3',
        type: 'comment',
        content: 'Investigating memory leak in web application',
        timestamp: new Date(new Date().getTime() - 15 * 60 * 1000),
        user: 'Web Developer'
      }
    ]
  }
];

function IncidentMgmt() {
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data } = useDashboardContext();
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500">{severity}</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">{severity}</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">{severity}</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">{severity}</Badge>;
      default:
        return <Badge>{severity}</Badge>;
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
  
  const filteredIncidents = incidents.filter(incident => 
    incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (incident.assignedTo && incident.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
          <p className="text-muted-foreground">Manage and track system incidents</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search incidents..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Incident</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input
                      id="title"
                      placeholder="Enter incident title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Input
                      id="description"
                      placeholder="Enter incident description"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="severity" className="text-sm font-medium">Severity</label>
                    <select id="severity" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="assignee" className="text-sm font-medium">Assigned To</label>
                    <Input
                      id="assignee"
                      placeholder="Assign to team or individual"
                    />
                  </div>
                  
                  <Button className="w-full">Create Incident</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Incidents</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All Incidents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>Currently open and investigating incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents
                    .filter(incident => incident.status === 'open' || incident.status === 'investigating')
                    .map(incident => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground">{incident.description.substring(0, 50)}...</div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(incident.createdAt), 'MMM d, h:mm a')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{incident.assignedTo || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  
                  {filteredIncidents.filter(incident => incident.status === 'open' || incident.status === 'investigating').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <CheckCircle className="h-10 w-10 mb-2 text-green-500" />
                          <p>No active incidents</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Resolved Incidents</CardTitle>
              <CardDescription>Recently resolved incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Resolution Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents
                    .filter(incident => incident.status === 'resolved' || incident.status === 'closed')
                    .map(incident => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground">{incident.description.substring(0, 50)}...</div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                        <TableCell>
                          {incident.resolvedAt ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(incident.resolvedAt), 'MMM d, h:mm a')}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {incident.resolvedAt ? (
                            <>
                              {Math.round((new Date(incident.resolvedAt).getTime() - new Date(incident.createdAt).getTime()) / (1000 * 60 * 60))} hours
                            </>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  
                  {filteredIncidents.filter(incident => incident.status === 'resolved' || incident.status === 'closed').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertCircle className="h-10 w-10 mb-2 text-slate-500" />
                          <p>No resolved incidents</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Incidents</CardTitle>
              <CardDescription>Complete history of system incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-8 font-semibold">
                        Incident
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-8 font-semibold">
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.length > 0 ? (
                    filteredIncidents.map(incident => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground">{incident.description.substring(0, 50)}...</div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(incident.createdAt), 'MMM d, h:mm a')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {incident.assignedTo ? (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{incident.assignedTo}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertTriangle className="h-10 w-10 mb-2 text-yellow-500" />
                          <p>No incidents match your search criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedIncident && (
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Incident Details: {selectedIncident.title}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Status</h3>
                    <div>{getStatusBadge(selectedIncident.status)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Severity</h3>
                    <div>{getSeverityBadge(selectedIncident.severity)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Created</h3>
                    <div className="text-sm">
                      {format(new Date(selectedIncident.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                    <div className="text-sm">
                      {format(new Date(selectedIncident.updatedAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm">{selectedIncident.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Assigned To</h3>
                  <p className="text-sm">{selectedIncident.assignedTo || 'Unassigned'}</p>
                </div>
                
                <TimelineVisualization incident={selectedIncident} />
                
                <div className="flex justify-end space-x-2">
                  {(selectedIncident.status === 'open' || selectedIncident.status === 'investigating') && (
                    <Button variant="outline">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedIncident(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default IncidentMgmt;
