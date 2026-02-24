import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    return JSON.parse(payloadJson) as { user_id: number; email: string; role: string };
  } catch {
    return null;
  }
}

export default async function StaffDashboard() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const staff = await prisma.staff.findUnique({
    where: { user_id: user.user_id },
    include: {
      meetingmember: {
        include: { 
          meetings: {
            include: { meetingtype: true } 
          } 
        },
        orderBy: { meetings: { MeetingDate: 'desc' } }
      }
    }
  });

  if (!staff) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Profile Not Linked</div>;

  const now = new Date();
  const totalMeetings = staff.meetingmember.length;
  const attendedCount = staff.meetingmember.filter(m => m.IsPresent).length;
  const attendanceRate = totalMeetings > 0 ? (attendedCount / totalMeetings) * 100 : 0;

  const upcomingMeetings = staff.meetingmember.filter(m => 
    new Date(m.meetings.MeetingDate) >= now && !m.meetings.IsCancelled
  );
  
  const pastMeetings = staff.meetingmember.filter(m => 
    new Date(m.meetings.MeetingDate) < now
  );

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* STATS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight italic uppercase">
                {staff.StaffName.split(' ')[0]}
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                Staff ID: {staff.StaffID} • {user.email}
              </p>
            </div>
            
            <div className="relative z-10 flex gap-4 mt-8 md:mt-0">
               <div className="bg-slate-900 text-white p-7 rounded-[2.2rem] text-center w-36 shadow-2xl">
                  <p className="text-3xl font-black italic">{totalMeetings}</p>
                  <p className="text-[10px] uppercase font-black opacity-40">Records</p>
               </div>
               <div className="bg-white border-2 border-slate-100 text-slate-900 p-7 rounded-[2.2rem] text-center w-36">
                  <p className="text-3xl font-black italic text-indigo-600">{attendedCount}</p>
                  <p className="text-[10px] uppercase font-black opacity-40">Attended</p>
               </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center text-center shadow-xl">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Compliance</div>
            <div className="text-6xl font-black italic">{Math.round(attendanceRate)}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            
            {/* UPCOMING */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase italic px-6 tracking-tight">Upcoming Meetings</h3>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? upcomingMeetings.map((item) => (
                  <Link 
                    key={item.MeetingMemberID} 
                    href={`/dashboard/meetings/${item.meetings.MeetingID}`}
                    className="bg-white border-2 border-dashed border-indigo-100 p-6 rounded-[2rem] flex items-center justify-between hover:border-solid hover:border-indigo-400 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-indigo-600 font-black text-xl italic group-hover:scale-110 transition-transform">
                        {new Date(item.meetings.MeetingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600">
                          {item.meetings.MeetingDescription || item.meetings.meetingtype.MeetingTypeName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Starts: {new Date(item.meetings.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        →
                    </div>
                  </Link>
                )) : (
                  <div className="p-10 bg-slate-50 rounded-[2rem] text-center text-slate-400 font-bold italic text-sm">No future meetings scheduled.</div>
                )}
              </div>
            </section>

            {/* HISTORY */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase italic px-6 tracking-tight">Meeting History</h3>
              <div className="space-y-3">
                {pastMeetings.map((record) => (
                  <Link 
                    key={record.MeetingMemberID} 
                    href={`/dashboard/meetings/${record.meetings.MeetingID}`}
                    className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group transition-all hover:border-indigo-100 hover:shadow-md cursor-pointer ${record.meetings.IsCancelled ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${record.meetings.IsCancelled ? 'bg-slate-200 text-slate-500' : record.IsPresent ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {record.meetings.IsCancelled ? 'CXL' : record.IsPresent ? 'PR' : 'AB'}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight group-hover:text-indigo-600">
                          {record.meetings.MeetingDescription || record.meetings.meetingtype.MeetingTypeName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {new Date(record.meetings.MeetingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 uppercase italic px-6 tracking-tight">Status</h3>
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${attendanceRate >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Account: {attendanceRate >= 75 ? 'Good Standing' : 'Needs Review'}
                  </p>
                </div>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">
                  Linked to <strong>{staff.StaffName}</strong>. For data corrections, contact your system administrator.
                </p>
              </div>
              <a 
                href={`mailto:admin@system.com?subject=Inquiry: ${staff.StaffName}`}
                className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg flex justify-center"
              >
                Contact Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}   