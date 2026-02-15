import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AttendancePage() {
  const meetings = await prisma.meetings.findMany({
    orderBy: { MeetingDate: 'desc' },
    include: {
      meetingtype: true,
      meetingmember: true 
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </span>
              Attendance Tracking
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage assignments and record meeting presence.</p>
          </div>
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => {
            const totalAssigned = meeting.meetingmember.length; 
            const totalPresent = meeting.meetingmember.filter(m => m.IsPresent).length;
            const attendanceRate = totalAssigned > 0 ? (totalPresent / totalAssigned) * 100 : 0;

            return (
              <div 
                key={meeting.MeetingID} 
                className={`bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl transition-all flex flex-col justify-between ${meeting.IsCancelled ? 'opacity-60' : ''}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 tracking-wider">
                      {meeting.meetingtype.MeetingTypeName}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(meeting.MeetingDate).toLocaleDateString('en-GB')}
                    </span>
                    {meeting.IsCancelled && (
                       <span className="text-[10px] font-bold text-red-500 uppercase">Cancelled</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mt-4 h-14 line-clamp-2">
                    {meeting.MeetingDescription || "General Staff Meeting"}
                  </h3>

                  {/* Attendance Stats & Progress Bar */}
                  <div className="mt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {totalAssigned > 0 ? `${totalPresent} / ${totalAssigned} Assigned` : "No Members Assigned"}
                      </div>
                      {totalAssigned > 0 && (
                        <span className="text-[10px] font-black text-blue-600">{Math.round(attendanceRate)}%</span>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-500" 
                        style={{ width: `${attendanceRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Link 
                    href={`/attendance/assign/${meeting.MeetingID}`} 
                    className="w-full bg-white border-2 border-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm text-center hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    {totalAssigned > 0 ? "Edit Assignments" : "Assign Members"}
                  </Link>

                  {totalAssigned > 0 && !meeting.IsCancelled && (
                    <Link 
                      href={`/attendance/${meeting.MeetingID}`} 
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm text-center hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Mark Attendance
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}