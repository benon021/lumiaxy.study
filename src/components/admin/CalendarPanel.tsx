"use client";

import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Circle
} from "lucide-react";
import { useState } from "react";

export default function CalendarPanel() {
  const [currentDate] = useState(new Date("2026-03-25"));
  const daysInMonth = 31;
  const firstDayOfMonth = 1; // Wednesday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  const calendarDays = [...padding, ...days];

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-6 self-stretch min-h-[400px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Calendar</h3>
          <p className="text-xs text-white/40">Wednesday, March 25, 2026</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-center mb-6">
          <span className="text-sm font-bold text-white tracking-wide">March 2026</span>
        </div>

        <div className="grid grid-cols-7 gap-y-4 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <span key={day} className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{day}</span>
          ))}

          {calendarDays.map((day, i) => (
            <div key={i} className="relative aspect-square flex items-center justify-center">
               {day && (
                 <button 
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all relative z-10 ${
                    day === 25 
                    ? "bg-brand text-white shadow-[0_0_20px_rgba(98,114,241,0.5)] scale-110" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                 >
                   {day}
                 </button>
               )}
               {day === 12 && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan shadow-[0_0_5px_#00e5ff]" />}
               {day === 28 && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-400 shadow-[0_0_5px_#a78bfa]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00e5ff]" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white group-hover:text-cyan transition-colors">Team Sync</p>
            <p className="text-[10px] text-white/30">Tomorrow, 10:00 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors">Platform Audit</p>
            <p className="text-[10px] text-white/30">Friday, 02:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
