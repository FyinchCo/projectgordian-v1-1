
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminGateProps {
  children: React.ReactNode;
}

export const AdminGate = ({ children }: AdminGateProps) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if already authenticated on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem("genius-machine-admin-authenticated");
    if (adminAuth === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsLoading(true);
    
    // Simple admin password check - in production, this would be more secure
    const correctPassword = "admin2024"; // You can change this
    
    if (adminPassword === correctPassword) {
      localStorage.setItem("genius-machine-admin-authenticated", "true");
      setIsAdminAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "You now have access to testing and analytics features.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin password. Contact system administrator.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  if (isAdminAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="flex items-center justify-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Admin Access Required</span>
          </CardTitle>
          <CardDescription>
            This section contains testing and analytics features restricted to administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin password"
            />
          </div>
          <Button 
            onClick={handleAdminLogin} 
            disabled={isLoading || !adminPassword}
            className="w-full"
          >
            {isLoading ? "Authenticating..." : "Access Admin Features"}
          </Button>
          <div className="text-center text-sm text-gray-500">
            <p>Admin features include:</p>
            <ul className="mt-2 text-xs space-y-1">
              <li>• Archetype Testing Framework</li>
              <li>• Learning Analytics Dashboard</li>
              <li>• Market Viability Testing</li>
              <li>• System Performance Metrics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
