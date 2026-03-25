"use client";

import { motion } from "framer-motion";
import { 
  Filter, 
  Search, 
  ChevronDown, 
  Grid2X2, 
  List,
  SortAsc
} from "lucide-react";

export default function PaperFilters() {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 px-2">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={18} />
           <input 
              type="text" 
              placeholder="Search by subject, year or topic..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
           />
        </div>
      </div>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
         <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand/10 border border-brand/20 text-brand text-xs font-bold whitespace-nowrap">
            <Filter size={14} />
            Filters
         </button>
         
         <div className="h-4 w-[1px] bg-white/10 mx-1" />
         
         {["All Subjects", "2024", "2023", "Higher Level"].map((label) => (
           <button 
             key={label}
             className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
           >
             {label}
             <ChevronDown size={14} className="opacity-50" />
           </button>
         ))}
         
         <div className="h-4 w-[1px] bg-white/10 mx-1" />
         
         <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
            <button className="p-2 rounded-xl bg-white/10 text-white shadow-lg"><Grid2X2 size={16} /></button>
            <button className="p-2 rounded-xl text-white/40 hover:text-white transition-all"><List size={16} /></button>
         </div>
      </div>
    </div>
  );
}
