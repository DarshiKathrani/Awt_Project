import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarPlus, CalendarDays, Clock, MapPin, Sparkles } from "lucide-react";

export default async function SchedulePage() {
  // Fetch existing meetings and types for the dropdown
  const [meetings, meetingTypes] = await Promise.all([
    prisma.meetings.findMany({
      take: 5,
      orderBy: { MeetingDate: 'desc' },
      include: { meetingtype: true }
    }),
    prisma.meetingtype.findMany()
  ]);

  // REUSING YOUR CRUD: The Create Action
  async function createMeeting(formData: FormData) {
    "use server";
    const description = formData.get("description") as string;
    const date = new Date(formData.get("date") as string);
    const typeId = Number(formData.get("typeId"));

    await prisma.meetings.create({
      data: {
        MeetingDescription: description,
        MeetingDate: date,
        MeetingTypeID: typeId,
      }
    });

    revalidatePath("/convener-dashboard/schedule");
    revalidatePath("/convener-dashboard/attendance");
    redirect("/convener-dashboard/attendance"); // Go straight to attendance to assign members
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-10">
        <h1 className="text-4xl font-light text-slate-800 tracking-tight">
          Session <span className="font-black italic text-emerald-500">Planner</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">
          Establish new meeting parameters and timelines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* LEFT: THE FORM (Planning Zone) */}
        <div className="lg:col-span-3 space-y-8">
          <form action={createMeeting} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <h2 className="font-black text-slate-800 uppercase italic tracking-tight">New Session Details</h2>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Meeting Description</label>
                <input 
                  name="description" 
                  required 
                  placeholder="E.G. QUARTERLY DEPARTMENT REVIEW"
                  className="w-full bg-slate-50 border-none py-5 px-8 rounded-3xl text-sm font-bold uppercase tracking-tight focus:ring-4 focus:ring-emerald-500/5 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Date</label>
                  <input 
                    name="date" 
                    type="date" 
                    required 
                    className="w-full bg-slate-50 border-none py-5 px-8 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Meeting Type</label>
                  <select 
                    name="typeId" 
                    className="w-full bg-slate-50 border-none py-5 px-8 rounded-3xl text-sm font-bold uppercase tracking-tight focus:ring-4 focus:ring-emerald-500/5 transition-all appearance-none"
                  >
                    {meetingTypes.map(t => (
                      <option key={t.MeetingTypeID} value={t.MeetingTypeID}>{t.Remarks}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-4">
              <Sparkles className="w-4 h-4 text-emerald-300" /> Create & Assign Staff
            </button>
          </form>
        </div>

        {/* RIGHT: RECENT SCHEDULES (Context Zone) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Recently Scheduled</h3>
          <div className="space-y-3">
            {meetings.map(m => (
              <div key={m.MeetingID} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] group hover:bg-white transition-all">
                <p className="font-black text-slate-700 uppercase italic text-sm mb-2">{m.MeetingDescription}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {new Date(m.MeetingDate).toLocaleDateString()}
                  </div>
                  <div className="px-3 py-1 bg-white rounded-full text-[8px] font-black text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                    {m.meetingtype.Remarks}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}