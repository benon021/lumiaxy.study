"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import type { ActivityEvent } from "@/app/api/student/home/route";
import StatsCards from "./StatsCards";
import ActivityFeed from "./ActivityFeed";
import QuickActions from "./QuickActions";
import WelcomePanel from "./WelcomePanel";

type UserLike = { id: string; name: string | null; email: string; role: string };

type AiLocalMessage = {
  id: string;
  createdAt: string; // ISO
  userText: string;
  assistantText: string;
};

const AI_HISTORY_KEY = "lumiaxy_ai_history_v1";

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function dayKey(date: Date) {
  // local time day
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatRelativeTime(iso: string) {
  const dt = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - dt;
  const s = Math.floor(diffMs / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  const w = Math.floor(d / 7);
  return `${w}w ago`;
}

function computeCurrentStreak(daysSet: Set<string>) {
  if (daysSet.size === 0) return 0;
  const sorted = Array.from(daysSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  // start from latest day that has activity
  const startDay = sorted[0];
  const start = new Date(startDay + "T00:00:00");

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() - i);
    const key = dayKey(d);
    if (daysSet.has(key)) streak++;
    else break;
  }
  return streak;
}

function computeWindowActivityDays(daysSet: Set<string>, windowDays: number) {
  if (daysSet.size === 0) return 0;
  const now = new Date();
  let count = 0;
  for (let i = 0; i < windowDays; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    if (daysSet.has(dayKey(d))) count++;
  }
  return count;
}

export default function StudentHome({ user }: { user: UserLike }) {
  const [apiEvents, setApiEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiHistory, setAiHistory] = useState<AiLocalMessage[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/student/home");
        if (!res.ok) return;
        const data = (await res.json()) as { events: ActivityEvent[] };
        if (!cancelled) setApiEvents(Array.isArray(data.events) ? data.events : []);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stored = safeParseJSON<AiLocalMessage[]>(localStorage.getItem(AI_HISTORY_KEY));
    setAiHistory(Array.isArray(stored) ? stored : []);
  }, []);

  const aiEvents: ActivityEvent[] = useMemo(() => {
    const last = [...aiHistory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
    return last.map((m) => ({
      id: m.id,
      type: "notification" as any, // mapped in ActivityFeed display
      occurredAt: m.createdAt,
      label: "Asked AI",
      detail: m.userText ? `“${m.userText.slice(0, 60)}${m.userText.length > 60 ? "…" : ""}”` : "AI explanation",
    }));
  }, [aiHistory]);

  const mergedEvents = useMemo(() => {
    const all = [...apiEvents, ...aiEvents];
    all.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
    return all;
  }, [apiEvents, aiEvents]);

  const { weeklyProgressPct, learningStreakDays, studyHoursEst, coursesCompleted, currentWeekCount, previousWeekCount } = useMemo(() => {
    const days = new Set<string>();
    for (const e of mergedEvents) days.add(dayKey(new Date(e.occurredAt)));

    const currentWeekDays = computeWindowActivityDays(days, 7);
    const prevWeekDays = (() => {
      if (days.size === 0) return 0;
      const now = new Date();
      let count = 0;
      for (let i = 7; i < 14; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        if (days.has(dayKey(d))) count++;
      }
      return count;
    })();

    const weeklyPct = Math.round((currentWeekDays / 7) * 100);
    const hours = Math.round((currentWeekDays * 1.2 + Math.min(8, mergedEvents.length) * 0.15) * 10) / 10;

    const completedCount = mergedEvents.filter((e) => e.type === "grade" || e.type === "quiz").length;

    const streak = computeCurrentStreak(days);
    return {
      weeklyProgressPct: weeklyPct,
      learningStreakDays: streak,
      studyHoursEst: hours,
      coursesCompleted: completedCount,
      currentWeekCount: currentWeekDays,
      previousWeekCount: prevWeekDays,
    };
  }, [mergedEvents]);

  const aiExplanationsCount = aiHistory.length;
  const trendDelta = currentWeekCount - previousWeekCount;

  const cardStats = useMemo(() => {
    const toTrend = (label: string, current: number, prev: number) => {
      if (current === 0 && prev === 0) return `Start this week`;
      if (current > prev) return `+${current - prev} vs last week`;
      if (current < prev) return `-${prev - current} vs last week`;
      return `On track`;
    };

    return {
      coursesCompleted,
      studyHours: studyHoursEst,
      learningStreakDays,
      aiExplanations: aiExplanationsCount,
      trends: {
        courses: toTrend("courses", currentWeekCount, previousWeekCount),
        hours: toTrend("hours", Math.round(studyHoursEst), Math.max(0, Math.round(studyHoursEst - trendDelta * 0.8))),
        streak: learningStreakDays > 0 ? `Current streak: ${learningStreakDays} days` : "Build your streak",
        ai: aiExplanationsCount > 0 ? `Local sessions: ${aiExplanationsCount}` : "Ask your first question",
      },
    };
  }, [
    aiExplanationsCount,
    coursesCompleted,
    currentWeekCount,
    learningStreakDays,
    previousWeekCount,
    studyHoursEst,
    trendDelta,
  ]);

  const recentActivityForFeed = useMemo(() => mergedEvents.slice(0, 8), [mergedEvents]);

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-6xl mx-auto pb-32">
      <div className="space-y-6">
        <WelcomePanel userName={user.name || "Student"} weeklyProgressPct={weeklyProgressPct} />
        <StatsCards stats={cardStats} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed items={recentActivityForFeed} loading={loading} formatRelativeTime={formatRelativeTime} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[32px] p-8 border border-white/10 bg-gradient-to-r from-brand/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ready for your next challenge?</p>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Explore study content and test yourself
          </h3>
          <p className="text-sm text-white/40">
            Keep momentum with curated materials and quick practice.
          </p>
        </div>
        <a
          href="/dashboard/student/materials"
          className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-brand text-white text-sm font-bold hover:scale-[1.02] transition-all shadow-xl"
        >
          Explore Study Library
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </div>
  );
}

