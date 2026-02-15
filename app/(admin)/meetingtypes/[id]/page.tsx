import { prisma } from "@/lib/prisma";
import { meetings } from "@prisma/client";
import Link from "next/link";

export default async function GetById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const meetingType = await prisma.meetingtype.findFirst({
    where: {
      MeetingTypeID: Number(id),
    },
    include: {
      meetings: {
        orderBy: { MeetingDate: 'desc' } // Most recent meetings first
      }
    }
  });

  if (!meetingType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="p-8 bg-white rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-black text-red-600 mb-2">Meeting type not found</h2>
          <Link href="/meetingtypes" className="text-blue-600 font-bold hover:underline">Return to List</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Header */}
        <div className="mb-8">
          <Link 
            href="/meetingtypes" 
            className="text-sm font-bold text-blue-600 flex items-center gap-2 group mb-4"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Meeting Categories
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {meetingType.MeetingTypeName}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Info Card 1: Description/Remarks */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Description & Remarks</h3>
            <p className="text-slate-700 text-lg leading-relaxed">
              {meetingType.Remarks || "No additional remarks provided for this meeting type."}
            </p>
          </div>

          {/* Info Card 2: Stats */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Total Sessions</h3>
            <div className="text-5xl font-black mb-2">{meetingType.meetings.length}</div>
            <p className="text-slate-400 text-sm">Created: {meetingType.Created ? new Date(meetingType.Created).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {/* Meetings List Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-8 py-5 border-b border-slate-100">
            <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">History of Meetings</h2>
          </div>
          
          <div className="p-0">
            {meetingType.meetings.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {meetingType.meetings.map((m: meetings) => (
                  <div key={m.MeetingID} className="p-6 flex items-center justify-between hover:bg-blue-50/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{m.MeetingDescription || "Untitled Meeting"}</p>
                        <p className="text-slate-500 text-sm">{new Date(m.MeetingDate).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/meetings/${m.MeetingID}`}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-900 hover:text-white transition-all"
                    >
                      View Attendance
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center">
                <p className="text-slate-400 font-medium">No meetings have been scheduled for this type yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}