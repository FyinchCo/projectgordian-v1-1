
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Config from "./pages/Config";
import LearningAnalytics from "./pages/LearningAnalytics";
import InsightsHistory from "./pages/InsightsHistory";
import ArchetypeTesting from "./pages/ArchetypeTesting";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/config" element={<Config />} />
          <Route path="/learning-analytics" element={<LearningAnalytics />} />
          <Route path="/insights-history" element={<InsightsHistory />} />
          <Route path="/testing" element={<ArchetypeTesting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
