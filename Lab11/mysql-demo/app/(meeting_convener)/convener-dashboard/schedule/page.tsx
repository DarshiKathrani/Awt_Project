import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarPlus, Clock, Sparkles, ArrowLeft, Layers, Calendar } from "lucide-react";

export default async function SchedulePage() {
  const [meetings, meetingTypes] = await Promise.all([
    prisma.meetings.findMany({
      take: 5,
      orderBy: { MeetingDate: 'desc' },
      include: { meetingtype: true }
    }),
    prisma.meetingtype.findMany()
  ]);

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
    redirect("/convener-dashboard/attendance");
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation Header */}
        <div className="border-b border-gray-200 pb-8">
          <Link href="/convener-dashboard" className="text-sm font-bold text-indigo-600 flex items-center gap-2 group mb-4">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">
            Session <span className="text-indigo-600">Planner</span>
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
            Establish new meeting parameters and timelines
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* LEFT: THE FORM (Standardized Card) */}
          <div className="lg:col-span-3">
            <form action={createMeeting} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <h2 className="font-black text-gray-700 uppercase text-xs tracking-widest">New Session Parameters</h2>
              </div>

              <div className="p-8 space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meeting Description</label>
                  <input 
                    name="description" 
                    required 
                    placeholder="E.G. QUARTERLY DEPARTMENT REVIEW"
                    className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Date</label>
                    <input 
                      name="date" 
                      type="date" 
                      required 
                      className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</label>
                    <select 
                      name="typeId" 
                      className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all appearance-none outline-none"
                    >
                      {meetingTypes.map(t => (
                        <option key={t.MeetingTypeID} value={t.MeetingTypeID}>{t.MeetingTypeName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-3">
                  <Sparkles className="w-4 h-4 text-indigo-300" /> Confirm & Continue
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: RECENT LOGS (Matching the Hub History style) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-2 px-2">
               <Layers className="w-4 h-4 text-indigo-500" /> Recent Schedules
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {meetings.map(m => (
                  <div key={m.MeetingID} className="p-5 flex items-center gap-4 group hover:bg-indigo-50/30 transition-all">
                    {/* Tiny Calendar Icon logic to match Hub */}
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                      <span className="text-[8px] font-black uppercase leading-none">
                        {new Date(m.MeetingDate).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-xs font-black">
                        {new Date(m.MeetingDate).getDate()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 uppercase italic text-xs truncate">
                        {m.MeetingDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                          {m.meetingtype.MeetingTypeName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}