
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Dashboard /> : <LoginForm />;
};

export default Index;
