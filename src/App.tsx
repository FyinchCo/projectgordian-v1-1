
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Config from "./pages/Config";
import NotFound from "./pages/NotFound";
import EntryPoint from "./pages/EntryPoint";
import QuestionType from "./pages/QuestionType";
import QuestionInput from "./pages/QuestionInput";
import AdvancedSettings from "./pages/AdvancedSettings";
import ProcessingPage from "./pages/ProcessingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EntryPoint />} />
          <Route path="/question-type" element={<QuestionType />} />
          <Route path="/question-input" element={<QuestionInput />} />
          <Route path="/advanced-settings" element={<AdvancedSettings />} />
          <Route path="/process" element={<ProcessingPage />} />
          <Route path="/original" element={<Index />} />
          <Route path="/config" element={<Config />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
