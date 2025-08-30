import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Collection from "./pages/Collection";
import { GameProvider, useGame } from "@/context/GameContext";

const queryClient = new QueryClient();

function Header() {
  const { coins, muted, setMuted } = useGame();
  const loc = useLocation();
  const onHome = loc.pathname === "/";
  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b border-white/10 bg-black/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-black tracking-widest text-sm text-white/80">CRICKET <span className="text-white">PACKS</span></Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className={`px-3 py-1 rounded-full ${onHome ? "bg-white/15" : "hover:bg-white/10"}`}>Open Packs</Link>
          <Link to="/collection" className={`px-3 py-1 rounded-full ${!onHome ? "bg-white/15" : "hover:bg-white/10"}`}>My Collection</Link>
          <div className="ml-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">{coins} coins</div>
          <button onClick={() => setMuted(!muted)} className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20 ml-2">{muted ? "Unmute" : "Mute"}</button>
        </nav>
      </div>
    </header>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collection" element={<Collection />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
