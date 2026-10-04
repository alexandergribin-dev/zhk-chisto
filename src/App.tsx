import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LeadProvider } from "@/components/LeadDialog";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import ZhkPage from "./pages/ZhkPage";
import { DeveloperPage, DevelopersList } from "./pages/Developers";
import { BotPage, HowWeCheckPage, OfertaPage, PrivacyPage } from "./pages/InfoPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LeadProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/novostroyki" element={<Catalog />} />
            <Route path="/zhk/:slug" element={<ZhkPage />} />
            <Route path="/zastroyshchiki" element={<DevelopersList />} />
            <Route path="/zastroyshchiki/:slug" element={<DeveloperPage />} />
            <Route path="/kak-my-proveryaem" element={<HowWeCheckPage />} />
            <Route path="/bot" element={<BotPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/oferta" element={<OfertaPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LeadProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
