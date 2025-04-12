
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Download, 
  Search, 
  X,
  Info,
  AlertTriangle,
  AlertCircle,
  Terminal,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function LogsModule() {
  const { data } = useDashboardContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [serviceFilters, setServiceFilters] = useState<string[]>([]);
  
  // Extract all unique services
  const services = Array.from(new Set(data.logs.map((log) => log.service)));
  
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info size={14} className="text-blue-400" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-yellow-400" />;
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />;
      case 'debug':
        return <Terminal size={14} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  const getLevelClass = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-400 border-blue-400/20';
      case 'warning':
        return 'text-yellow-400 border-yellow-400/20';
      case 'error':
        return 'text-red-500 border-red-500/20';
      case 'debug':
        return 'text-green-500 border-green-500/20';
      default:
        return 'text-slate-400 border-slate-400/20';
    }
  };
  
  const toggleLevelFilter = (level: string) => {
    if (levelFilters.includes(level)) {
      setLevelFilters(levelFilters.filter(l => l !== level));
    } else {
      setLevelFilters([...levelFilters, level]);
    }
  };
  
  const toggleServiceFilter = (service: string) => {
    if (serviceFilters.includes(service)) {
      setServiceFilters(serviceFilters.filter(s => s !== service));
    } else {
      setServiceFilters([...serviceFilters, service]);
    }
  };
  
  const filteredLogs = data.logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLevel = levelFilters.length === 0 || levelFilters.includes(log.level);
    const matchesService = serviceFilters.length === 0 || serviceFilters.includes(log.service);
    
    return matchesSearch && matchesLevel && matchesService;
  });
  
  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <span>System Logs</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-md hover:bg-slate-800">
              <Download size={16} className="text-slate-400 hover:text-slate-200" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Filter size={14} />
              <span>Level:</span>
            </div>
            {['info', 'warning', 'error', 'debug'].map((level) => (
              <button
                key={level}
                onClick={() => toggleLevelFilter(level)}
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border",
                  levelFilters.includes(level) 
                    ? getLevelClass(level) 
                    : "border-slate-600 text-slate-400 hover:bg-slate-800"
                )}
              >
                {getLevelIcon(level)}
                <span>{level}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Filter size={14} />
              <span>Service:</span>
            </div>
            <select
              value=""
              onChange={(e) => toggleServiceFilter(e.target.value)}
              className="bg-slate-800 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>Select Service</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            
            <div className="flex gap-1 flex-wrap">
              {serviceFilters.map(service => (
                <div 
                  key={service} 
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-blue-900/40 text-blue-300"
                >
                  <span>{service}</span>
                  <button 
                    onClick={() => toggleServiceFilter(service)}
                    className="hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border border-slate-800 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 text-left text-xs">
              <tr>
                <th className="px-4 py-2 w-[150px]">Timestamp</th>
                <th className="px-4 py-2 w-[80px]">Level</th>
                <th className="px-4 py-2 w-[120px]">Service</th>
                <th className="px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t border-slate-800 hover:bg-slate-800/20">
                  <td className="px-4 py-2 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      {getLevelIcon(log.level)}
                      <span className={getLevelClass(log.level).split(' ')[0]}>
                        {log.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                      {log.service}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No logs found matching your search criteria
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
