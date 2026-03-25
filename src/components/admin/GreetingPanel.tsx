"use client";

import { motion } from "framer-motion";
import { Sun, Cloud, Send, Thermometer } from "lucide-react";
import { useState, useEffect } from "react";

export default function GreetingPanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Nice afternoon";
    return "Good evening";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl group p-10 bg-gradient-to-br from-brand/20 via-brand/5 to-transparent border border-white/[0.08] backdrop-blur-sm self-stretch">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-cyan/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <h2 className="text-4xl font-bold text-white mb-2">
              {getGreeting()}, <span className="gradient-text">Demo</span>
            </h2>
            <p className="text-white/40 text-sm flex items-center gap-2">
              Ready to make today productive! 🚀
            </p>
          </motion.div>

          <div className="flex items-center gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-6xl font-bold text-white tracking-tighter">
                {formatTime(time).split(" ")[0]}
                <span className="text-2xl text-white/30 ml-2 uppercase select-none">
                  {formatTime(time).split(" ")[1]}
                </span>
              </span>
            </div>
            <div className="w-[1px] h-12 bg-white/10 mx-2" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-white/60 mb-1">
                <Sun size={14} className="text-brand" />
                <span className="text-xs font-semibold uppercase tracking-wider">Current Forecast</span>
              </div>
              <p className="text-sm font-medium text-white/40">{formatDate(time)}</p>
            </div>
          </div>
        </div>

        {/* Weather card */}
        <div className="flex items-start gap-4 pr-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 group-hover:scale-110 transition-transform duration-500 rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                <Cloud size={20} className="text-white" />
              </div>
              <span className="text-5xl font-bold text-white">23°C</span>
            </div>
            <div className="mt-2 text-right">
              <p className="text-sm font-semibold text-white/80">Partly cloudy</p>
              <p className="text-xs text-white/40">Nairobi, KE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
