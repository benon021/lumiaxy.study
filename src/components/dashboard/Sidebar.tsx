"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FileText, BarChart3, User, 
  Bell, UploadCloud, CheckCircle2, Star, Link2,
  FilePlus, ClipboardList
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
  { label: "Post Note", icon: FilePlus, href: "/dashboard/teacher/content?type=NOTE" },
  { label: "Assignment", icon: ClipboardList, href: "/dashboard/teacher/content?type=ASSIGNMENT" },
  { label: "My Library", icon: UploadCloud, href: "/dashboard/teacher/content" },
];

const teacherRightItems = [
  { label: "Grading", icon: CheckCircle2, href: "/dashboard/teacher/grading" },
  { label: "Reviews", icon: Star, href: "/dashboard/teacher/reviews" },
  { label: "Settings", icon: Bell, href: "/dashboard/settings" },
];

function NavIcon({ href, icon: Icon, label, isActive, isMobile }: any) {
  return (
    <Link href={href} className="relative group p-0.5 sm:p-1 block">
      <div
        className={`flex items-center justify-center rounded-xl sm:rounded-2xl border transition-all duration-300 relative overflow-hidden active:scale-95
          ${isMobile ? "w-[38px] h-[38px]" : "w-[46px] h-[46px] group-hover:-translate-y-2 group-hover:scale-[1.15] group-hover:shadow-2xl"}
          ${isActive 
            ? "bg-brand/20 border-brand/40 text-brand shadow-[0_0_20px_rgba(255,114,0,0.3)] bg-gradient-to-t from-brand/10 to-transparent" 
            : "bg-transparent border-transparent text-white/35 hover:text-white hover:border-white/20 backdrop-blur-md hover:bg-white/10"
          }`}
      >
        <Icon size={isMobile ? 18 : 22} className="relative z-10" />
        {isActive && (
          <motion.div layoutId="active-indicator" className="absolute bottom-1 w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_#ff7200]" />
        )}
        {!isMobile && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-950 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-white pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 shadow-2xl z-50">
            {label}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("STUDENT");
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // For mobile tap
  const [isMobile, setIsMobile] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const longPressTimerRef = useRef<any>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => { if (data?.user?.role) setRole(data.user.role); })
      .catch(console.error);
  }, []);

  // Close mobile nav when clicking outside
  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    const handleClick = (e: MouseEvent) => {
      const nav = document.getElementById("lumiaxy-dock");
      if (nav && !nav.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    // Delay adding listener so the tap that opens it doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isMobile, isExpanded]);

  const leftItems = role === "TEACHER" ? teacherLeftItems : studentLeftItems;
  const rightItems = role === "TEACHER" ? teacherRightItems : studentRightItems;

  // On mobile, use tap state. On desktop, use hover state.
  const showIcons = isMobile ? isExpanded : isHovered;

  const handleOrbTap = () => {
    if (isMobile) {
      if (isExpanded) {
        // If already expanded and tapping orb again, navigate to AI
        router.push("/dashboard/ai");
        setIsExpanded(false);
      } else {
        // First tap expands the navbar
        setIsExpanded(true);
      }
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full px-3 sm:px-6 pointer-events-none">
      <motion.nav
        id="lumiaxy-dock"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onHoverStart={() => { if (!isMobile) setIsHovered(true); }}
        onHoverEnd={() => { if (!isMobile) setIsHovered(false); }}
        className={`flex items-center bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-500 ease-out ${
          showIcons 
            ? "rounded-[24px] sm:rounded-[32px] gap-1 sm:gap-2 px-2 sm:px-3 p-1.5 sm:p-2" 
            : "rounded-full gap-0 px-1.5 sm:px-2 p-1.5 sm:p-2"
        } ${isMobile && showIcons ? "max-w-[95vw]" : ""}`}
      >
        {/* LEFT ICONS */}
        <AnimatePresence>
          {showIcons && (
            <motion.div
              initial={{ width: 0, opacity: 0, paddingRight: 0 }}
              animate={{ width: "auto", opacity: 1, paddingRight: isMobile ? 4 : 8 }}
              exit={{ width: 0, opacity: 0, paddingRight: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-0.5 sm:gap-1 overflow-hidden"
            >
              {leftItems.map((item) => <NavIcon key={item.href} {...item} isActive={pathname === item.href} isMobile={isMobile} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTER ORB (ALWAYS VISIBLE) */}
        <div 
          className="px-0.5 sm:px-1 relative group z-50 flex items-center justify-center"
          onClick={handleOrbTap}
        >
          <motion.div
            animate={{ scale: showIcons ? 1 : 1.15 }}
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
                if (isMobile) return; // Skip drag on mobile
                if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = setTimeout(() => setDragEnabled(true), 350);
              }}
              onPointerUp={async () => {
                if (isMobile) return; // Handled by onClick
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
                setDragEnabled(false);
                setDragOffset({ x: 0, y: 0 });
              }}
              animate={{
                x: dragOffset.x,
                y: dragEnabled ? dragOffset.y : [dragOffset.y, dragOffset.y - 3, dragOffset.y],
              }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 30,
              }}
              className="rounded-full"
            >
              <AIOrb
                size={isMobile ? (showIcons ? 36 : 48) : (showIcons ? 48 : 64)}
                state={pathname === "/dashboard/ai" ? "speaking" : "idle"}
                reactive={!showIcons}
                className="transition-all duration-500"
              />
            </motion.div>
            
            {/* Tooltip - desktop only */}
            {!isMobile && (
              <div className={`absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-950/70 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-[#ff7200] pointer-events-none whitespace-nowrap transition-all duration-300 shadow-2xl ${
                isHovered ? "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0" : "opacity-0"
              }`}>
                Lumiaxy.study
              </div>
            )}


            {/* Mobile hint label */}
            {isMobile && !isExpanded && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-950/80 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-bold text-brand pointer-events-none whitespace-nowrap animate-pulse">
                Tap to open
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT ICONS */}
        <AnimatePresence>
          {showIcons && (
            <motion.div
              initial={{ width: 0, opacity: 0, paddingLeft: 0 }}
              animate={{ width: "auto", opacity: 1, paddingLeft: isMobile ? 4 : 8 }}
              exit={{ width: 0, opacity: 0, paddingLeft: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-0.5 sm:gap-1 overflow-hidden"
            >
              {rightItems.map((item) => <NavIcon key={item.href} {...item} isActive={pathname === item.href} isMobile={isMobile} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
