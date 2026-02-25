import { prisma } from "@/lib/prisma";
import { SaveAttendanceAction } from "@/app/actions/attendance";
import Link from "next/link";
import { ArrowLeft, UserCheck, CheckSquare, Users, UserMinus, UserCheck2 } from "lucide-react";

export default async function MarkingSheet({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await params to prevent Next.js 15 'NaN' errors
  const resolvedParams = await params;
  const meetingId = Number(resolvedParams.id);

  // 2. Safety check for the ID
  if (isNaN(meetingId)) {
    return (
      <div className="p-20 text-center">
        <p className="font-black text-rose-500 uppercase tracking-widest text-sm">Error: Invalid Meeting ID</p>
        <Link href="/convener-dashboard/attendance" className="text-xs text-slate-400 underline mt-4 block">Return to Roster</Link>
      </div>
    );
  }

  // 3. Fetch data using your existing schema
  const meeting = await prisma.meetings.findUnique({
    where: { MeetingID: meetingId },
    include: {
      meetingmember: { 
        include: { staff: true },
        orderBy: { staff: { StaffName: 'asc' } }
      }
    }
  });

  if (!meeting) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-sm text-[10px]">Meeting Record Not Found</div>;

  const displayList = meeting.meetingmember.map(m => ({
    staffId: m.staff.StaffID,
    name: m.staff.StaffName,
    isPresent: !!m.IsPresent 
  }));

  // 4. Calculate stats for the 'Live Count'
  const presentCount = displayList.filter(p => p.isPresent).length;
  const absentCount = displayList.length - presentCount;

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div className="space-y-2">
          <Link href="/convener-dashboard/attendance" className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:translate-x-[-2px] transition-transform mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Roster
          </Link>
          <h1 className="text-4xl font-light text-slate-800 tracking-tight">
            Roll <span className="font-black italic text-indigo-600">Call</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">
            {meeting.MeetingDescription}
          </p>
        </div>
        <Link 
          href={`/convener-dashboard/attendance/assign/${meetingId}`} 
          className="text-[9px] font-black text-slate-400 hover:text-indigo-600 border-b border-transparent hover:border-indigo-600 pb-1 uppercase tracking-widest transition-all"
        >
          Edit Assignment
        </Link>
      </div>

      {/* LIVE STATS COUNTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-emerald-50 transition-colors">
          <div>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Confirmed</p>
            <p className="text-3xl font-light text-emerald-700 tracking-tighter italic"><span className="font-black italic">P</span>resent</p>
          </div>
          <div className="text-4xl font-black text-emerald-500/30 group-hover:text-emerald-500 transition-colors">{presentCount}</div>
        </div>
        
        <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-white transition-colors">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected</p>
            <p className="text-3xl font-light text-slate-500 tracking-tighter italic"><span className="font-black italic text-slate-400">A</span>bsent</p>
          </div>
          <div className="text-4xl font-black text-slate-200 group-hover:text-slate-400 transition-colors">{absentCount}</div>
        </div>
      </div>

      {/* ATTENDANCE FORM */}
      <form action={SaveAttendanceAction} className="space-y-8">
        <input type="hidden" name="MeetingID" value={meetingId} />
        
        <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
              {displayList.length} Personnel Listed
            </span>
          </div>
          
          <button 
            type="button" 
            id="toggle-all-btn"
            className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
          >
            <CheckSquare className="w-3 h-3" /> Toggle All
          </button>
        </div>

        {/* LIST OF STAFF */}
        <div className="grid grid-cols-1 gap-3">
          {displayList.map((person) => (
            <label key={person.staffId} className="group flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer shadow-sm hover:shadow-indigo-50/50">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-black italic text-lg uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-800 uppercase italic tracking-tight">{person.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Staff #{person.staffId}</p>
                </div>
              </div>
              
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  name={`staff_${person.staffId}`} 
                  defaultChecked={person.isPresent}
                  className="attendance-checkbox sr-only peer" 
                />
                <div className="w-14 h-8 bg-slate-100 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6 shadow-inner"></div>
              </div>
            </label>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4">
          <UserCheck className="w-5 h-5" /> Save Official Record
        </button>
      </form>

      {/* VANILLA JAVASCRIPT FOR TOGGLE */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const btn = document.getElementById('toggle-all-btn');
          if (btn) {
            btn.addEventListener('click', function() {
              const checkboxes = document.querySelectorAll('.attendance-checkbox');
              const allChecked = Array.from(checkboxes).every(cb => cb.checked);
              checkboxes.forEach(cb => cb.checked = !allChecked);
            });
          }
        `
      }} />
    </div>
  );
}