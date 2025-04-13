
import { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USER: User = {
  id: "user-1",
  name: "Demo User",
  email: "demo@example.com",
  role: "admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you'd validate credentials here
    if (email && password) {
      setUser(MOCK_USER);
      localStorage.setItem("user", JSON.stringify(MOCK_USER));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
