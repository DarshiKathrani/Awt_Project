import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Calendar, Users, Activity, Layers } from "lucide-react";

export default async function ConvenerDashboard() {
  const totalMeetings = await prisma.meetings.count();
  const staffCount = await prisma.staff.count();
  const recentMeetings = await prisma.meetings.findMany({
    take: 4,
    orderBy: { MeetingDate: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      
      {/* GREETING SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light text-slate-800 tracking-tight">
            System <span className="font-black italic text-indigo-600">Controller</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Governance & Oversight Panel</p>
        </div>
        
        <Link href="/convener-dashboard/schedule" className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> New Session
        </Link>
      </div>

      {/* TINTED STATS CARDS */}
      <div className="grid grid-cols-2 gap-8">
        {/* Meetings Card */}
        <div className="p-10 rounded-[2.5rem] bg-blue-50/50 border border-blue-100/50 group hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Sessions</p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-7xl font-black italic text-slate-900 tracking-tighter">{totalMeetings}</span>
            <span className="text-sm font-bold text-blue-600 uppercase italic">Entries</span>
          </div>
        </div>

        {/* Staff Card */}
        <div className="p-10 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100/50 group hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Personnel</p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-7xl font-black italic text-slate-900 tracking-tighter">{staffCount}</span>
            <span className="text-sm font-bold text-emerald-600 uppercase italic">Members</span>
          </div>
        </div>
      </div>

      {/* RECENT WORKFLOW SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Recent Pipeline</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recentMeetings.map((m) => (
            <div key={m.MeetingID} className="group flex items-center justify-between p-7 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <span className="text-[9px] font-black uppercase tracking-tighter">{new Date(m.MeetingDate).toLocaleString('en-US', { month: 'short' })}</span>
                  <span className="text-lg font-black leading-none">{new Date(m.MeetingDate).getDate()}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{m.MeetingDescription || "Scheduled Strategy Sync"}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Meeting ID: #00{m.MeetingID}</p>
                </div>
              </div>
              
              <Link href={`/convener-dashboard/attendance/${m.MeetingID}`} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}