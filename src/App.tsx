
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import Index from "./pages/Index";
import Engine from "./pages/Engine";
import Config from "./pages/Config";
import InsightsHistory from "./pages/InsightsHistory";
import ArchetypeTesting from "./pages/ArchetypeTesting";
import LearningAnalytics from "./pages/LearningAnalytics";
import MarketViabilityTesting from "./pages/MarketViabilityTesting";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/engine" element={<Engine />} />
            <Route path="/config" element={<Config />} />
            <Route path="/insights" element={<InsightsHistory />} />
            <Route path="/testing" element={<ArchetypeTesting />} />
            <Route path="/analytics" element={<LearningAnalytics />} />
            <Route path="/market-testing" element={<MarketViabilityTesting />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
