
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, LogOut, Settings, Bell, Home, BarChart2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setLoginOpen(false);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
  };

  return (
    <header className="border-b fixed top-0 left-0 right-0 z-10 h-14 px-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-xl">DevOps Dashboard</Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button 
              variant={location.pathname === "/" ? "default" : "ghost"} 
              size="sm" 
              className="gap-1"
            >
              <Home size={16} />
              <span>Dashboard</span>
            </Button>
          </Link>
          
          <Link to="/incidents">
            <Button 
              variant={location.pathname === "/incidents" ? "default" : "ghost"} 
              size="sm" 
              className="gap-1"
            >
              <BarChart2 size={16} />
              <span>Incidents</span>
            </Button>
          </Link>
          
          <Link to="/settings">
            <Button 
              variant={location.pathname === "/settings" ? "default" : "ghost"} 
              size="sm" 
              className="gap-1"
            >
              <Settings size={16} />
              <span>Settings</span>
            </Button>
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme} 
          className="rounded-full h-9 w-9"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full h-9 p-0 aspect-square overflow-hidden">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex items-center gap-2">
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive flex items-center gap-2">
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="default" size="sm" onClick={() => setLoginOpen(true)}>
            Login
          </Button>
        )}
      </div>
      
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to Dashboard</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your@email.com" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLoginOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </DialogFooter>
          </form>
          <div className="text-xs text-center mt-4 text-muted-foreground">
            For demo, you can login with any email and password
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
