import { prisma } from "@/lib/prisma";
import { AssignMemberAction } from "@/app/actions/attendance";
import Link from "next/link";
import { ArrowLeft, Users, Search, CheckCircle2 } from "lucide-react";

export default async function AssignMembers({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meetingId = Number(id);

  const [meeting, allStaff, currentMembers] = await Promise.all([
    prisma.meetings.findUnique({ where: { MeetingID: meetingId } }),
    prisma.staff.findMany({ orderBy: { StaffName: 'asc' } }),
    prisma.meetingmember.findMany({ where: { MeetingID: meetingId }, select: { StaffID: true } })
  ]);

  if (!meeting) return <div className="p-10 text-center font-bold text-slate-400">Meeting not found</div>;
  const assignedIds = currentMembers.map(m => m.StaffID);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div className="space-y-2">
          <Link href={`/convener-dashboard/attendance/${meetingId}`} className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:translate-x-[-4px] transition-transform mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Roll Call
          </Link>
          <h1 className="text-4xl font-light text-slate-800 tracking-tight">
            Assign <span className="font-black italic text-indigo-600">Personnel</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">{meeting.MeetingDescription}</p>
        </div>
      </div>

      {/* SEARCH BAR (Vanilla JS Powered) */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          id="staff-search"
          placeholder="SEARCH STAFF BY NAME..." 
          className="w-full bg-white border border-slate-100 py-5 pl-14 pr-6 rounded-3xl text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all shadow-sm"
        />
      </div>

      <form action={AssignMemberAction} className="space-y-8">
        <input type="hidden" name="MeetingID" value={meetingId} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="staff-grid">
          {allStaff.map((staff) => (
            <label 
              key={staff.StaffID} 
              className="staff-card flex items-center gap-4 p-5 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer group has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/30"
            >
              <input 
                type="checkbox" 
                name="staffIds" 
                value={staff.StaffID} 
                defaultChecked={assignedIds.includes(staff.StaffID)}
                className="w-5 h-5 rounded-full border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all"
              />
              <div className="flex-1">
                <p className="font-black text-slate-800 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">{staff.StaffName}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{staff.Remarks || "Member"}</p>
              </div>
            </label>
          ))}
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4">
          <CheckCircle2 className="w-5 h-5" /> Confirm & Start Roll Call
        </button>
      </form>

      {/* SEARCH SCRIPT */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('staff-search').addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.staff-card').forEach(card => {
              const name = card.innerText.toLowerCase();
              card.style.display = name.includes(term) ? 'flex' : 'none';
            });
          });
        `
      }} />
    </div>
  );
}