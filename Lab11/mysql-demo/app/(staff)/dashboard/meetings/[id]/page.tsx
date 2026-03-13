import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  AlertCircle, 
  ArrowLeft, 
  Download,
} from "lucide-react"; 
import Link from "next/link";
export const dynamic = "force-dynamic";
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
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Header - Matching Admin style */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-bold text-indigo-600 flex items-center gap-2 group mb-4">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">
                  {meeting.MeetingDescription || "Untitled Session"}
                </h1>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">
                  Category: {meeting.meetingtype.MeetingTypeName} • ID: #{meeting.MeetingID}
                </p>
             </div>
             
             {meeting.DocumentPath && (
                <a 
                  href={meeting.DocumentPath} 
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm shadow-indigo-200"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Minutes
                </a>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Logistics Cards - Matching Admin StatCard style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meeting Date</p>
                  <p className="text-lg font-black text-gray-900 italic">
                    {new Date(meeting.MeetingDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Time</p>
                  <p className="text-lg font-black text-gray-900 italic">
                    {new Date(meeting.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Table - Matching Admin Table style */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b font-bold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> Attendee List
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50/30">
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Staff Name</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {meeting.meetingmember.map((m) => (
                    <tr key={m.MeetingMemberID} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-tight">{m.staff.StaffName}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          m.IsPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {m.IsPresent ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Personal Status Card */}
            {myRecord && (
              <div className={`p-6 rounded-2xl border-2 border-dashed ${myRecord.IsPresent ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Your Status</h4>
                <p className={`text-lg font-black italic uppercase ${myRecord.IsPresent ? 'text-green-700' : 'text-red-700'}`}>
                  {myRecord.IsPresent ? 'Marked Present' : 'Marked Absent'}
                </p>
                {myRecord.Remarks && (
                  <p className="mt-2 text-xs text-gray-500 font-medium italic">"{myRecord.Remarks}"</p>
                )}
              </div>
            )}

            {/* Cancellation Notice - Matching Admin style */}
            {meeting.IsCancelled && (
              <div className="bg-red-900 p-6 rounded-2xl text-white shadow-xl shadow-red-100">
                <div className="flex items-center gap-2 font-black uppercase text-xs tracking-widest mb-4">
                  <AlertCircle className="w-5 h-5" />
                  Cancelled
                </div>
                <p className="text-red-100 text-sm font-medium leading-relaxed italic">
                  "{meeting.CancellationReason || "No reason provided."}"
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}