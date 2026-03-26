"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import GreetingPanel from "@/components/admin/GreetingPanel";
import UserMetrics from "@/components/admin/UserMetrics";
import PerformanceAnalytics from "@/components/admin/PerformanceAnalytics";
import RevenueAnalytics from "@/components/admin/RevenueAnalytics";
import ProjectsDashboard from "@/components/admin/ProjectsDashboard";
import UserManagement from "@/components/admin/UserManagement";
import AIAssistant from "@/components/admin/AIAssistant";
import CalendarPanel from "@/components/admin/CalendarPanel";
import QuickTasks from "@/components/admin/QuickTasks";
import Footer from "@/components/admin/Footer";
import SystemStatus from "@/components/admin/SystemStatus";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("Overview");

  const renderView = () => {
    switch (activeView) {
      case "Overview":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GreetingPanel />
                <SystemStatus />
              </div>
              <div className="lg:col-span-1">
                <PerformanceAnalytics />
              </div>
            </div>
            <UserMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProjectsDashboard />
              <RevenueAnalytics />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1">
                  <CalendarPanel />
               </div>
               <div className="lg:col-span-1">
                  <QuickTasks />
               </div>
               <div className="lg:col-span-1">
                  <AIAssistant />
               </div>
            </div>
          </motion.div>
        );
      case "Users":
      case "All":
      case "Deleted":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <UserManagement />
          </motion.div>
        );
      case "Projects":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectsDashboard />
          </motion.div>
        );
      case "AI Assistant":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
          >
            <AIAssistant />
          </motion.div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-20 text-center">
             <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <div className="w-10 h-10 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">{activeView} Panel</h2>
             <p className="text-white/40">This module is currently being optimized by Fusion AI...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-white font-sans selection:bg-brand/30 selection:text-white">
      {/* Sidebar - Fixed */}
      <Sidebar activeItem={activeView} setActiveItem={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen pb-32">
        <Topbar />

        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>

        <Footer />
      </main>
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
