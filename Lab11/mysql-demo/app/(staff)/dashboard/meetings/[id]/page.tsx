import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"; // Added to get current user
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  AlertCircle, 
  ArrowLeft, 
  Download,
  CheckCircle2,
  XCircle
} from "lucide-react"; 


async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  return payload as { user_id: number };
}

export default async function GetById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuth();

  const meeting = await prisma.meetings.findUnique({
    where: { MeetingID: Number(id) },
    include: {
      meetingtype: true,
      meetingmember: {
        include: { staff: true }
      }
    }
  });

  if (!meeting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Meeting not found</h2>
      </div>
    );
  }

 
  const myRecord = meeting.meetingmember.find(m => m.staff.user_id === user?.user_id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Corrected Back Link */}
        <a href="/dashboard" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-8 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </a>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          
          {/* HEADER SECTION */}
          <div className="p-8 md:p-12 border-b border-slate-50 bg-gradient-to-br from-white to-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-indigo-50 text-indigo-600">
                    {meeting.meetingtype.MeetingTypeName}
                  </span>
                  {meeting.IsCancelled && (
                    <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-rose-50 text-rose-600">
                      Cancelled
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-black text-slate-900 leading-tight italic uppercase">
                  {meeting.MeetingDescription || "Untitled Session"}
                </h1>
              </div>

              {meeting.DocumentPath && (
                <a 
                  href={meeting.DocumentPath} 
                  target="_blank"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Minutes
                </a>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-10">
              
             
              {myRecord && (
                <div className={`p-6 rounded-3xl border ${myRecord.IsPresent ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Your Attendance Record</h4>
                  <div className="flex items-center gap-3">
                    {myRecord.IsPresent ? <CheckCircle2 className="text-emerald-500 w-5 h-5" /> : <XCircle className="text-rose-500 w-5 h-5" />}
                    <p className={`font-bold text-sm ${myRecord.IsPresent ? 'text-emerald-700' : 'text-rose-700'}`}>
                      You were marked {myRecord.IsPresent ? 'Present' : 'Absent'} for this meeting.
                    </p>
                  </div>
                  {myRecord.Remarks && (
                    <p className="mt-3 text-xs text-slate-500 italic font-medium">Note: {myRecord.Remarks}</p>
                  )}
                </div>
              )}

              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Logistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white border border-slate-100 rounded-2xl text-indigo-600 shadow-sm">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Date</p>
                      <p className="text-slate-900 font-black italic">
                        {new Date(meeting.MeetingDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white border border-slate-100 rounded-2xl text-indigo-600 shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Start Time</p>
                      <p className="text-slate-900 font-black italic">
                        {new Date(meeting.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              
              {meeting.IsCancelled && (
                <div className="bg-rose-50 border-2 border-dashed border-rose-100 rounded-3xl p-8">
                  <div className="flex items-center gap-2 text-rose-700 font-black uppercase text-xs tracking-widest mb-4">
                    <AlertCircle className="w-5 h-5" />
                    Cancellation Notice
                  </div>
                  <p className="text-rose-600 text-sm font-bold leading-relaxed italic">
                    "{meeting.CancellationReason || "Meeting was cancelled by the administrator."}"
                  </p>
                </div>
              )}
            </div>

            
            <div className="space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center">
                <Users className="w-4 h-4 mr-2" /> Other Attendees
              </h3>
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 space-y-4">
                {meeting.meetingmember.map((m) => (
                  <div key={m.MeetingMemberID} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {m.staff.StaffName.charAt(0)}
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{m.staff.StaffName}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${m.IsPresent ? 'bg-emerald-500' : 'bg-rose-500'}`} title={m.IsPresent ? 'Present' : 'Absent'} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="px-12 py-6 bg-slate-900 flex justify-between items-center text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">
            <span>System Log ID: {meeting.MeetingID}</span>
            <span className="hidden md:block">Ref: {meeting.meetingtype.MeetingTypeName.slice(0,3)}-{meeting.MeetingID}</span>
          </div>
        </div>
      </div>
    </div>
  );
}