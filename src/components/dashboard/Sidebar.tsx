"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FileText, BarChart3, User, 
  Bell, UploadCloud, CheckCircle2, Star, Link2
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AIOrb from "../ai-orb/AIOrb";

const studentLeftItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Teachers", icon: User, href: "/dashboard/teachers" },
  { label: "Materials", icon: FileText, href: "/dashboard/materials" },
  { label: "Assignments", icon: Link2, href: "/dashboard/assignments" },
];

const studentRightItems = [
  { label: "Progress", icon: BarChart3, href: "/dashboard/progress" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
];

const teacherLeftItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Uploads", icon: UploadCloud, href: "/dashboard/teacher/content" },
];

const teacherRightItems = [
  { label: "Grading", icon: CheckCircle2, href: "/dashboard/teacher/grading" },
  { label: "Reviews", icon: Star, href: "/dashboard/teacher/reviews" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
];

function NavIcon({ href, icon: Icon, label, isActive }: any) {
  return (
    <Link href={href} className="relative group p-1 block">
      <div
        className={`flex w-[46px] h-[46px] items-center justify-center rounded-2xl border transition-all duration-300 relative overflow-hidden active:scale-95 group-hover:-translate-y-2 group-hover:scale-[1.15] group-hover:shadow-2xl ${
          isActive 
            ? "bg-brand/20 border-brand/40 text-brand shadow-[0_0_20px_rgba(255,114,0,0.3)] bg-gradient-to-t from-brand/10 to-transparent" 
            : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20 backdrop-blur-md hover:bg-white/10"
        }`}
      >
        <Icon size={22} className="relative z-10" />
        {isActive && (
          <motion.div layoutId="active-indicator" className="absolute bottom-1 w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_#ff7200]" />
        )}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-950 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-white pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 shadow-2xl z-50">
          {label}
        </div>
      </div>
    </Link>
  );
}

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("STUDENT");
  const [isHovered, setIsHovered] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const longPressTimerRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => { if (data?.user?.role) setRole(data.user.role); })
      .catch(console.error);
  }, []);

  const leftItems = role === "TEACHER" ? teacherLeftItems : studentLeftItems;
  const rightItems = role === "TEACHER" ? teacherRightItems : studentRightItems;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full px-6 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`flex items-center p-2 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-500 ease-out ${
          isHovered ? "rounded-[32px] gap-2 px-3" : "rounded-full gap-0 px-2"
        }`}
      >
        {/* LEFT ICONS */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ width: 0, opacity: 0, paddingRight: 0 }}
              animate={{ width: "auto", opacity: 1, paddingRight: 8 }}
              exit={{ width: 0, opacity: 0, paddingRight: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-1 overflow-hidden"
            >
              {leftItems.map((item) => <NavIcon key={item.href} {...item} isActive={pathname === item.href} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTER ORB (ALWAYS VISIBLE) */}
        <div className="px-1 relative group z-50 flex items-center justify-center">
          <motion.div
            animate={{ scale: isHovered ? 1 : 1.15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center rounded-full"
          >
            <motion.div
              drag={dragEnabled}
              dragMomentum={false}
                onDrag={(_, info) => {
                  setDragOffset({ x: info.offset.x, y: info.offset.y });
                }}
              onPointerDown={() => {
                if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = setTimeout(() => setDragEnabled(true), 350);
              }}
              onPointerUp={async () => {
                if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                if (!dragEnabled) {
                  router.push("/dashboard/ai");
                  return;
                }
                setDragEnabled(false);
                  setDragOffset({ x: 0, y: 0 });
              }}
              onPointerCancel={() => {
                if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                setDragEnabled(false);
                  setDragOffset({ x: 0, y: 0 });
              }}
              onDragEnd={(_, info) => {
                // snap back to original position after drag
                setDragEnabled(false);
                  setDragOffset({ x: 0, y: 0 });
              }}
                animate={{ x: dragOffset.x, y: dragOffset.y }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="rounded-full"
            >
              <AIOrb
                size={isHovered ? 48 : 64}
                state={pathname === "/dashboard/ai" ? "speaking" : "idle"}
                reactive={!isHovered}
                className="transition-all duration-500"
              />
            </motion.div>
            
            {/* Tooltip */}
            <div className={`absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-950 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400 pointer-events-none whitespace-nowrap transition-all duration-300 shadow-2xl ${
              isHovered ? "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0" : "opacity-0"
            }`}>
              Fusion AI Core
            </div>
          </motion.div>
        </div>

        {/* RIGHT ICONS */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ width: 0, opacity: 0, paddingLeft: 0 }}
              animate={{ width: "auto", opacity: 1, paddingLeft: 8 }}
              exit={{ width: 0, opacity: 0, paddingLeft: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-1 overflow-hidden"
            >
              {rightItems.map((item) => <NavIcon key={item.href} {...item} isActive={pathname === item.href} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
