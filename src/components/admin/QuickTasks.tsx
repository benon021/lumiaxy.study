"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Circle, 
  CheckCircle2, 
  MoreVertical,
  GripVertical
} from "lucide-react";
import { useState } from "react";

export default function QuickTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review new student accounts", completed: false },
    { id: 2, text: "Update platform terms of service", completed: true },
    { id: 3, text: "Optimize database queries", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-6 self-stretch min-h-[400px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Quick Tasks</h3>
          <p className="text-xs text-white/40">Manage your daily tasks</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-white">Active (2)</button>
          <button className="px-3 py-1 rounded-lg text-[10px] font-bold text-white/30 hover:text-white transition-colors">Completed</button>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {/* Add Input */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Add a quick task..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all pr-12"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 text-white/20 hover:text-white transition-all">
            <Plus size={16} />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2 mt-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                task.completed 
                ? "bg-emerald-500/5 border-emerald-500/10 opacity-50" 
                : "bg-white/[0.02] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04]"
              }`}
            >
              <GripVertical size={14} className="text-white/5 group-hover:text-white/20 cursor-grab" />
              <button 
                onClick={() => toggleTask(task.id)}
                className={`transition-colors ${task.completed ? "text-emerald-400" : "text-white/20 hover:text-white/40"}`}
              >
                {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </button>
              <span className={`text-xs flex-1 ${task.completed ? "text-white/30 line-through" : "text-white/80 font-medium"}`}>
                {task.text}
              </span>
              <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white">
                <MoreVertical size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
         <p className="text-[10px] text-center font-bold text-white/20 uppercase tracking-[0.2em]">Platform Sync v1.4</p>
      </div>
    </div>
  );
}
