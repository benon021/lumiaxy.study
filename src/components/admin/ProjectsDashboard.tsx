"use client";

import { motion } from "framer-motion";
import { 
  Code2, 
  Smartphone, 
  Database, 
  Cloud,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  Clock,
  Timer
} from "lucide-react";

const projects = [
  {
    name: "E-Commerce Platform",
    desc: "Complete online store with payment integration",
    status: "Ready",
    lastUpdated: "3/6/2026",
    icon: Code2,
    color: "#6272f1"
  },
  {
    name: "Mobile App (iOS & Android)",
    desc: "Cross-platform mobile application with push...",
    status: "Ready",
    lastUpdated: "3/6/2026",
    icon: Smartphone,
    color: "#10b981"
  },
  {
    name: "Dashboard Analytics",
    desc: "Real-time business intelligence dashboard...",
    status: "In Progress",
    lastUpdated: "3/6/2026",
    icon: Database,
    color: "#f59e0b"
  },
  {
    name: "API Gateway Service",
    desc: "Microservices architecture with GraphQL an...",
    status: "Ready",
    lastUpdated: "3/6/2026",
    icon: Cloud,
    color: "#00e5ff"
  }
];

export default function ProjectsDashboard() {
  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/[0.08] self-stretch">
      <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Active Projects</h3>
          <p className="text-xs text-white/40">Overview of active development projects</p>
        </div>
        <button className="text-xs font-semibold text-brand hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/[0.06]">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {projects.map((project, i) => (
              <motion.tr 
                key={project.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110" 
                         style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}25` }}>
                      <project.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-brand transition-colors">{project.name}</p>
                      <p className="text-xs text-white/40 max-w-[200px] truncate">{project.desc}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                    project.status === "Ready" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {project.status === "Ready" ? <CheckCircle2 size={12} /> : <Timer size={12} />}
                    {project.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-white/40">{project.lastUpdated}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white">
                      <ExternalLink size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
