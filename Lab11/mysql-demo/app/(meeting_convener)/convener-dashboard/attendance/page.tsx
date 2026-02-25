import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, ChevronRight, Calendar } from "lucide-react";

export default async function AttendanceMainPage() {
  const meetings = await prisma.meetings.findMany({
    orderBy: { MeetingDate: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="border-b border-slate-100 pb-10">
        <h1 className="text-4xl font-light text-slate-800 tracking-tight">
          Session <span className="font-black italic text-indigo-600">Roster</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">
          Select a meeting to manage personnel attendance
        </p>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <Link 
            key={meeting.MeetingID} 
            href={`/convener-dashboard/attendance/${meeting.MeetingID}`}
            className="group flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/40 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-slate-800 uppercase italic tracking-tight text-lg">
                  {meeting.MeetingDescription}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <Calendar className="w-3 h-3 text-slate-300" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(meeting.MeetingDate).toDateString()}
                  </p>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}