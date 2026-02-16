import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function StaffDashboard() {
  // IMPORTANT: Replace this with your logic to get the logged-in user's ID from the JWT
  const currentStaffId = 1; 

  const staff = await prisma.staff.findUnique({
    where: { StaffID: currentStaffId },
    include: {
      meetingmember: {
        include: { meetings: true },
        orderBy: { meetings: { MeetingDate: 'desc' } }
      }
    }
  });

  if (!staff) return <div className="p-20 text-center font-black">Staff Record Not Found</div>;

  // Calculate Personal Stats
  const totalMeetings = staff.meetingmember.length;
  const attendedCount = staff.meetingmember.filter(m => m.IsPresent).length;
  const attendanceRate = totalMeetings > 0 ? (attendedCount / totalMeetings) * 100 : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Hi, {staff.StaffName}!</h1>
            <p className="text-indigo-100 font-medium opacity-90 text-lg">You've attended {attendedCount} out of your last {totalMeetings} assigned meetings.</p>
          </div>
          {/* Decorative Background Shape */}
          <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Circular Progress/Score Card */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Overall Score</p>
          <div className="relative flex items-center justify-center">
            {/* Simple progress ring representation */}
            <div className="text-5xl font-black text-slate-900">{Math.round(attendanceRate)}%</div>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Performance Status: <span className="text-indigo-600 uppercase">{attendanceRate > 75 ? 'Excellent' : 'Needs Improvement'}</span></p>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-900 text-xl tracking-tight">Recent Attendance Activity</h3>
          <button className="text-xs font-black text-indigo-600 uppercase tracking-wider hover:underline">Download Report</button>
        </div>
        
        <div className="divide-y divide-slate-50">
          {staff.meetingmember.slice(0, 5).map((record) => (
            <div key={record.MeetingID} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${record.IsPresent ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                   {record.IsPresent ? '✓' : '✕'}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{record.meetings.MeetingDescription || "Meeting Instance"}</p>
                  <p className="text-xs text-slate-400 font-semibold uppercase">{new Date(record.meetings.MeetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${record.IsPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {record.IsPresent ? 'PRESENT' : 'ABSENT'}
              </div>
            </div>
          ))}
        </div>

        {totalMeetings === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold">No attendance records found yet.</div>
        )}
      </div>
    </div>
  );
}