import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Calendar, Users, Activity, Layers, ChevronRight } from "lucide-react";

export default async function ConvenerDashboard() {
  const totalMeetings = await prisma.meetings.count();
  const staffCount = await prisma.staff.count();
  const recentMeetings = await prisma.meetings.findMany({
    take: 4,
    orderBy: { MeetingDate: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER SECTION - Aligned with Admin Hub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
              System <span className="text-indigo-600">Controller</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
              Governance & Oversight Panel
            </p>
          </div>
          
          <Link
            href="/convener-dashboard/schedule"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm shadow-indigo-200 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Session
          </Link>
        </div>

        {/* STATS GRID - Aligned with Admin StatCard Logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Sessions</p>
                <h2 className="text-4xl font-black text-gray-900 mt-1">{totalMeetings}</h2>
              </div>
            </div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter italic">Total Entries</div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:border-emerald-100 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Personnel</p>
                <h2 className="text-4xl font-black text-gray-900 mt-1">{staffCount}</h2>
              </div>
            </div>
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter italic">Members</div>
          </div>
        </div>

        {/* RECENT PIPELINE - Aligned with Admin Table Aesthetic */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> Recent Pipeline
            </h3>
            <Link href="/convener-dashboard/attendance" className="text-[10px] font-black text-indigo-600 uppercase hover:underline">View All</Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentMeetings.map((m) => (
              <div key={m.MeetingID} className="group flex items-center justify-between p-6 hover:bg-indigo-50/30 transition-all">
                <div className="flex items-center gap-6">
                  {/* Calendar Box - Matching Admin Table Style */}
                  <div className="h-12 w-12 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                    <span className="text-[9px] font-bold uppercase leading-none">
                      {new Date(m.MeetingDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-sm font-black">
                      {new Date(m.MeetingDate).getDate()}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight group-hover:text-indigo-900 transition-colors">
                      {m.MeetingDescription || "Scheduled Strategy Sync"}
                    </h4>
                    <p className="text-[10px] font-medium text-gray-400 mt-1">
                      ID: #MTG-00{m.MeetingID} • {new Date(m.MeetingDate).getFullYear()}
                    </p>
                  </div>
                </div>

                <Link 
                  href={`/convener-dashboard/attendance/${m.MeetingID}`}
                  className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center gap-2"
                >
                  Manage <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>

          {recentMeetings.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No active sessions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}