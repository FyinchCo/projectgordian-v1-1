
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KnotIcon } from "./KnotIcon";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export const PasswordGate = ({ onAuthenticated }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // You'll need to set this to your desired password
  const CORRECT_PASSWORD = "gordian2024"; // Change this to your preferred password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple delay to prevent brute force attempts
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        localStorage.setItem("project-gordian-authenticated", "true");
        onAuthenticated();
        toast({
          title: "Access Granted",
          description: "Welcome to Project Gordian!",
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
    <div className="min-h-screen bg-gradient-to-br from-gordian-cream via-gordian-beige to-gordian-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <KnotIcon 
              className="text-gordian-dark-brown" 
              size={80} 
              animate 
            />
          </div>
          <h1 className="text-5xl font-playfair font-bold text-gordian-dark-brown mb-3">
            Project Gordian
          </h1>
          <p className="text-lg font-playfair font-medium text-gordian-brown mb-2">
            AI's Recursive Distillation of a Knot
          </p>
          <p className="text-gordian-brown font-inter">
            Untangling complex problems with AI intelligence. Please enter the access password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="font-inter text-gordian-dark-brown">
              Access Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-2 border-gordian-brown/30 focus:border-gordian-brown bg-white/80 font-inter"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gordian-dark-brown hover:bg-gordian-brown text-gordian-cream font-inter font-medium"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? "Verifying..." : "Enter"}
          </Button>
        </form>

        <div className="text-center text-sm text-gordian-brown font-inter">
          <p>Contact the project owner for access credentials.</p>
        </div>
      </div>
    </div>
  );
};
