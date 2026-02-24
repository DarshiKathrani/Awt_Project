import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    return JSON.parse(payloadJson) as { user_id: number };
  } catch { return null; }
}

export default async function MeetingsArchive() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const staff = await prisma.staff.findUnique({
    where: { user_id: user.user_id },
    include: {
      meetingmember: {
        include: { 
          meetings: { include: { meetingtype: true } } 
        },
        orderBy: { meetings: { MeetingDate: 'desc' } }
      }
    }
  });

  if (!staff) return <div className="p-20 text-center font-black text-slate-400">ACCESS DENIED</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 italic uppercase tracking-tighter">
              Meetings <span className="text-indigo-600">Archive</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
              Centralized Repository of all Minutes & Sessions
            </p>
          </div>
          
          {/* SEARCH BOX (Visual Only for now) */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH BY KEYWORD..." 
              className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-600 transition-all w-full md:w-80 shadow-sm"
            />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Meeting Description</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">My Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.meetingmember.map((item) => (
                  <tr key={item.MeetingMemberID} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-4 h-4 text-indigo-500" />
                        <div>
                          <p className="text-xs font-black text-slate-900 tracking-tight">
                            {new Date(item.meetings.MeetingDate).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {new Date(item.meetings.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-slate-800 uppercase italic max-w-xs truncate">
                        {item.meetings.MeetingDescription || "General Session"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {item.meetings.meetingtype.MeetingTypeName}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.IsPresent ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.IsPresent ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {item.IsPresent ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link 
                        href={`/dashboard/meetings/${item.meetings.MeetingID}`}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
                      >
                        Details <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {staff.meetingmember.length === 0 && (
            <div className="p-20 text-center space-y-2">
              <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">No meeting records found in the vault.</p>
            </div>
          )}
        </div>

        {/* FOOTER STAT */}
        <div className="flex justify-center">
          <div className="px-6 py-2 bg-slate-900 rounded-full">
            <p className="text-[9px] font-black text-white uppercase tracking-[0.4em]">
              Total Records Logged: {staff.meetingmember.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}