import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { UserCheck, BookOpen, Clock, Activity, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function TeacherProfilePage({ params }: { params: { id: string } }) {
  const teacher = await fetchTeacher(params.id);

  if (!teacher || teacher.role !== "TEACHER") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white p-4 lg:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header Profile */}
        <div className="glass rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand/20 to-purple-600/10 pointer-events-none opacity-50" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-[28px] border-4 border-dark-950 bg-brand/10 shadow-[0_20px_40px_rgba(98,114,241,0.3)] overflow-hidden shrink-0">
                {teacher.avatarUrl ? (
                  <img src={teacher.avatarUrl} alt={teacher.name || "Teacher"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-4xl text-brand">{teacher.name?.[0] || "T"}</div>
                )}
             </div>

             <div className="flex-1 text-center md:text-left pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-[10px] font-bold tracking-widest uppercase text-brand mb-3">
                   <UserCheck size={12} /> Verified Educator
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">{teacher.name}</h1>
                <p className="text-lg text-white/50">{teacher.email}</p>
                
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                  <button className="px-6 py-3 rounded-2xl bg-brand text-white text-sm font-bold shadow-xl hover:scale-105 transition-transform">
                    Follow Instructor
                  </button>
                  <button className="px-6 py-3 rounded-2xl glass border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors flex items-center gap-2">
                    <MessageSquare size={16} /> Contact
                  </button>
                </div>
             </div>
          </div>
        </div>

        {/* Verification Info & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
             {/* Credentials / About */}
             <div className="glass rounded-3xl p-8 border border-white/10">
                <h3 className="text-xl font-bold flex items-center gap-3 mb-4">
                  <BookOpen size={20} className="text-emerald-400" />
                  Credentials & Expertise
                </h3>
                <div className="p-5 rounded-2xl bg-white/5 text-sm leading-relaxed text-white/80 font-medium whitespace-pre-wrap min-h-[100px]">
                   {teacher.teacherProfile?.credentials || "This instructor has not provided their public credentials yet."}
                </div>
             </div>
             
             {/* Public Materials */}
             <div className="glass rounded-3xl p-8 border border-white/10">
                <h3 className="text-xl font-bold flex items-center gap-3 mb-4">
                  <Activity size={20} className="text-brand" />
                  Public Modules & Materials
                </h3>
                <div className="py-10 text-center">
                  <p className="text-white/30 text-sm">No public materials available.</p>
                </div>
             </div>
          </div>

          <div className="md:col-span-1 space-y-8">
             {/* Office Hours */}
             <div className="glass rounded-3xl p-6 border border-white/10">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                  <Clock size={18} className="text-cyan-400" />
                  Availability
                </h3>
                <div className="p-4 rounded-2xl bg-white/5 space-y-1">
                   {teacher.teacherProfile?.officeHours ? (
                     <div className="text-sm font-bold text-emerald-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/> Visible</div>
                   ) : (
                     <div className="text-sm font-bold text-white/40 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/40"/> Offline</div>
                   )}
                   <p className="text-[11px] text-white/50 pt-2 border-t border-white/10 mt-2">
                     {teacher.teacherProfile?.officeHours === "VISIBLE" ? "Currently accepting meetings or messages." : "Busy or Offline."}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fetch helper directly leveraging Prisma since this is a Server Component app router page
async function fetchTeacher(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { teacherProfile: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}
