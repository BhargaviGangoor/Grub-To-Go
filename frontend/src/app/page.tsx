"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Sparkles,
  GitBranch,
  Key,
  Terminal,
  BarChart2,
  Zap,
  Shield,
  Activity,
  Menu,
  X
} from "lucide-react";

import LandingView from "@/components/LandingView";
import GenerateView from "@/components/GenerateView";
import ArtifactView from "@/components/ArtifactView";
import DCTDetailsView from "@/components/DCTDetailsView";
import RedemptionView from "@/components/RedemptionView";
import ResearchDashboardView from "@/components/ResearchDashboardView";
import DriftSimulatorView from "@/components/DriftSimulatorView";
import { useAppState } from "@/context/StateContext";
import { PencilLeavesPerimeter } from "@/components/BackgroundDrawings";

export default function DashboardPage() {
  const { tokens } = useAppState();
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bgImages = [
    "/download.jpg", 
    "/download2.jpg", 
    "/download3.jpg", 
    "/download4.jpg", 
    "/la-cronin.jpg",
    "/baby.jpg",
    "/cute.jpg",
    "/verandah.jpg",
    "/monuments.jpg"
  ];
  const [currentBgIdx, setCurrentBgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIdx((prev) => (prev + 1) % bgImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: "landing", label: "Landing Page", icon: <Home className="w-4 h-4" /> },
    { id: "generate", label: "Generate Dish", icon: <Sparkles className="w-4 h-4" /> },
    { id: "artifact", label: "AI Artifact Viewer", icon: <GitBranch className="w-4 h-4" /> },
    { id: "token", label: "DCT Details", icon: <Key className="w-4 h-4" /> },
    { id: "redemption", label: "Token Redemption", icon: <Terminal className="w-4 h-4" /> },
    { id: "research", label: "Research Dashboard", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "drift", label: "Drift Simulator", icon: <Zap className="w-4 h-4" /> }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case "landing":
        return <LandingView onNavigate={setActiveTab} />;
      case "generate":
        return <GenerateView onNavigate={setActiveTab} />;
      case "artifact":
        return <ArtifactView />;
      case "token":
        return <DCTDetailsView />;
      case "redemption":
        return <RedemptionView />;
      case "research":
        return <ResearchDashboardView />;
      case "drift":
        return <DriftSimulatorView />;
      default:
        return <LandingView onNavigate={setActiveTab} />;
    }
  };

  const getPageTitle = () => {
    const item = menuItems.find(m => m.id === activeTab);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-[#f4f1ea] text-[#1d3a2b]">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#e9e5da] bg-[#1d3a2b] p-5 sticky top-0 h-screen justify-between z-30">
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-[#14281e] border border-[#e59b27]/30 flex items-center justify-center text-[#e59b27]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#f4f1ea] block">GrubToGo</span>
              <span className="text-[10px] font-mono text-[#e59b27] block font-bold">RESEARCH v1.0.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all font-semibold ${
                    isActive
                      ? "bg-[#14281e] border-l-2 border-[#e59b27] text-[#e59b27]"
                      : "text-[#f4f1ea]/80 hover:text-white hover:bg-[#14281e]/40"
                  }`}
                >
                  <span className={isActive ? "text-[#e59b27]" : "text-[#f4f1ea]/60"}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#14281e] pt-4 px-2 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#f4f1ea]/60">
            <Activity className="w-3.5 h-3.5 text-[#e59b27] animate-pulse-slow" />
            <span>Enforcement Engine: OK</span>
          </div>
          <div className="text-[10px] text-[#f4f1ea]/50 leading-relaxed font-mono">
            GB-DCT: Active
            <br />
            Tokens: {tokens.length} created
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-[#1d3a2b] p-5 border-r border-[#14281e] z-50 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#14281e] border border-[#e59b27]/30 flex items-center justify-center text-[#e59b27]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-sm text-[#f4f1ea]">GrubToGo</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-[#f4f1ea]/60 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all font-semibold ${
                          isActive
                            ? "bg-[#14281e] border-l-2 border-[#e59b27] text-[#e59b27]"
                            : "text-[#f4f1ea]/80 hover:text-white hover:bg-[#14281e]/40"
                        }`}
                      >
                        <span className={isActive ? "text-[#e59b27]" : "text-[#f4f1ea]/60"}>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-[#14281e] pt-4 px-2 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#f4f1ea]/50">
                  <Activity className="w-3.5 h-3.5 text-[#e59b27]" />
                  <span>Enforcement Engine: OK</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="border-b border-[#e9e5da] bg-[#f4f1ea]/80 backdrop-blur-xl h-14 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[#1d3a2b] hover:bg-[#e9e5da] rounded-lg"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1d3a2b]/80">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Connection status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[#1d3a2b]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e59b27] animate-pulse" />
              <span>Attestation Node Live</span>
            </div>

            {/* Token Badge */}
            <div className="bg-[#ffffff] border border-[#e9e5da] px-2.5 py-1 rounded-md text-[#1d3a2b] text-[10px] font-bold shadow-sm">
              Leases: {tokens.length}
            </div>
          </div>
        </header>

        {/* View Content with transitions */}
        <main className="flex-1 overflow-y-auto relative bg-[#f4f1ea]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="p-6 md:p-8 relative z-10"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>

          {/* Global Scattered Hand-Drawn Background Drawings (Overlay) */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBgIdx}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 0.26, scale: 1.03 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5 }}
                className="absolute inset-0 w-[80%] h-[80%] max-w-none max-h-[80vh] m-auto mix-blend-multiply"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={bgImages[currentBgIdx]} 
                  alt="" 
                  className="w-full h-full object-contain" 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pencil drawn leaves decorative border around the perimeters */}
          <PencilLeavesPerimeter />
        </main>
      </div>
    </div>
  );
}
