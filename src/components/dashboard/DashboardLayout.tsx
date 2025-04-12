
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Activity, 
  Server, 
  Box, 
  BarChart3, 
  FileText, 
  Bell, 
  Menu, 
  X,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
};

const mainNavItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { title: "Pipelines", icon: Activity, href: "#pipelines" },
  { title: "Containers", icon: Box, href: "#containers" },
  { title: "Infrastructure", icon: Server, href: "#infrastructure" },
  { title: "Metrics", icon: BarChart3, href: "#metrics" },
  { title: "Logs", icon: FileText, href: "#logs" },
  { title: "Alerts", icon: Bell, href: "#alerts", badge: 3 },
];

const bottomNavItems: NavItem[] = [
  { title: "Settings", icon: Settings, href: "#settings" },
  { title: "Log Out", icon: LogOut, href: "#logout" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('#dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 border-r border-slate-800 h-full z-30",
          collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
          isMobile && "fixed transition-transform duration-300",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-[var(--header-height)] items-center border-b border-slate-800 px-4">
          <div className="flex items-center space-x-2 w-full">
            <div className="bg-blue-500 h-6 w-6 rounded-md flex items-center justify-center">
              <Activity size={14} className="text-white" />
            </div>
            {!collapsed && <div className="text-lg font-semibold">DevVista</div>}
            <div className="ml-auto">
              <button 
                onClick={toggleSidebar}
                className="h-8 w-8 rounded-md hover:bg-slate-800 flex items-center justify-center"
              >
                {isMobile ? (
                  <X size={18} />
                ) : collapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronRight size={18} className="rotate-180" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-[calc(100vh-var(--header-height))] overflow-y-auto">
          <nav className="p-2 space-y-1">
            {mainNavItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.href);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
                  activeItem === item.href
                    ? "bg-blue-900/50 text-blue-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <item.icon size={collapsed ? 20 : 18} className={collapsed ? "mx-auto" : "mr-3"} />
                {!collapsed && (
                  <span className="flex-grow">{item.title}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>
          
          <nav className="p-2 space-y-1 mb-4">
            {bottomNavItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-center py-2 px-3 rounded-md text-sm transition-colors text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <item.icon size={collapsed ? 20 : 18} className={collapsed ? "mx-auto" : "mr-3"} />
                {!collapsed && (
                  <span>{item.title}</span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[var(--header-height)] border-b border-slate-800 flex items-center px-4 bg-slate-900">
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="mr-4 h-8 w-8 rounded-md hover:bg-slate-800 flex items-center justify-center"
            >
              <Menu size={18} />
            </button>
          )}
          <div className="font-semibold">DevOps Monitoring Dashboard</div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
