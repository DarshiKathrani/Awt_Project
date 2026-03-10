import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, ChevronRight, Calendar, ArrowLeft } from "lucide-react";

export default async function AttendanceMainPage() {
  const meetings = await prisma.meetings.findMany({
    orderBy: { MeetingDate: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          <Link href="/convener-dashboard" className="text-sm font-bold text-indigo-600 flex items-center gap-2 group mb-4">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">
            Session <span className="text-indigo-600">Roster</span>
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
            Select a meeting to manage personnel attendance
          </p>
        </div>

        {/* LIST CONTAINER - Consistent with Admin 'Meeting Hub' */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-gray-500 uppercase text-xs tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Organizational Sessions
            </h2>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              {meetings.length} Total Meetings
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {meetings.map((meeting) => (
              <Link 
                key={meeting.MeetingID} 
                href={`/convener-dashboard/attendance/${meeting.MeetingID}`}
                className="group flex items-center justify-between p-6 hover:bg-indigo-50/30 transition-all"
              >
                <div className="flex items-center gap-6">
                  {/* Calendar Box - Matching Admin Style Exactly */}
                  <div className="h-12 w-12 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                    <span className="text-[9px] font-bold uppercase leading-none">
                      {new Date(meeting.MeetingDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-sm font-black">
                      {new Date(meeting.MeetingDate).getDate()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight group-hover:text-indigo-900 transition-colors">
                      {meeting.MeetingDescription || "Untitled Strategy Sync"}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        ID: #MTG-00{meeting.MeetingID}
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        {new Date(meeting.MeetingDate).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <span className="hidden md:inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      Mark Attendance
                   </span>
                   <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          {meetings.length === 0 && (
            <div className="py-20 text-center">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                No sessions found in history
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}