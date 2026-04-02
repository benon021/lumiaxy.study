"use client";

import { motion } from "framer-motion";
import { 
  Filter, 
  Search, 
  Grid2X2, 
  List,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";
import CustomDropdown from "./CustomDropdown";

interface PaperFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filters: {
    subject: string;
    year: string;
    difficulty: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    subject: string;
    year: string;
    difficulty: string;
  }>>;
  viewLayout: "grid" | "list";
  setViewLayout: (val: "grid" | "list") => void;
}

export default function PaperFilters({ 
  searchQuery, 
  setSearchQuery, 
  filters, 
  setFilters, 
  viewLayout, 
  setViewLayout 
}: PaperFiltersProps) {
  
  const subjects = ["All Subjects", "Biology", "Math", "History", "Chemistry", "Economics", "English", "Geography", "Physics"];
  const years = ["All Years", "2024", "2023", "2022"];
  const levels = ["All Levels", "Easy", "Medium", "Hard"];

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 px-2">
      {/* Search Input */}
      <div className="flex-1 max-w-lg">
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={18} />
           <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject, year or topic..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
           />
        </div>
      </div>
      
      {/* Filters & View Actions */}
      <div className="flex flex-wrap items-center gap-3">
         <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand/10 border border-brand/20 text-brand text-xs font-bold whitespace-nowrap">
            <Filter size={14} />
            Filters
         </div>
         
         <div className="hidden sm:block h-4 w-[1px] bg-white/10 mx-1" />
         
         {/* Custom Dropdowns */}
         <CustomDropdown 
           label="Subject"
           options={subjects}
           selected={filters.subject}
           onSelect={(val) => setFilters(prev => ({ ...prev, subject: val }))}
           icon={<GraduationCap size={14} className="opacity-50" />}
         />

         <CustomDropdown 
           label="Year"
           options={years}
           selected={filters.year}
           onSelect={(val) => setFilters(prev => ({ ...prev, year: val }))}
           icon={<Calendar size={14} className="opacity-50" />}
         />

         <CustomDropdown 
           label="Level"
           options={levels}
           selected={filters.difficulty}
           onSelect={(val) => setFilters(prev => ({ ...prev, difficulty: val }))}
           icon={<Layers size={14} className="opacity-50" />}
         />
         
         <div className="h-4 w-[1px] bg-white/10 mx-1" />
         
         {/* View Layout Toggle */}
         <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
            <button 
              onClick={() => setViewLayout("grid")}
              className={`p-2 rounded-xl transition-all ${viewLayout === "grid" ? "bg-brand text-white shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              <Grid2X2 size={16} />
            </button>
            <button 
              onClick={() => setViewLayout("list")}
              className={`p-2 rounded-xl transition-all ${viewLayout === "list" ? "bg-brand text-white shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              <List size={16} />
            </button>
         </div>
      </div>
    </div>
  );
}
