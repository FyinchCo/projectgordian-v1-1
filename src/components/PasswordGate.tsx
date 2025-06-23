
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export const PasswordGate = ({ onAuthenticated }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // You'll need to set this to your desired password
  const CORRECT_PASSWORD = "genius2024"; // Change this to your preferred password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple delay to prevent brute force attempts
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        localStorage.setItem("genius-machine-authenticated", "true");
        onAuthenticated();
        toast({
          title: "Access Granted",
          description: "Welcome to the Genius Machine!",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setPassword("");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Genius Machine
          </h1>
          <p className="text-gray-600">
            This is a private preview. Please enter the access password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password">Access Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? "Verifying..." : "Enter"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Contact the project owner for access credentials.</p>
        </div>
      </div>
    </div>
  );
};
