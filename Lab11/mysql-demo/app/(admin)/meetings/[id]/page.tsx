import { prisma } from "@/lib/prisma";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  AlertCircle, 
  Tag, 
  ArrowLeft, 
  Download 
} from "lucide-react"; 

export default async function GetById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
    include: {
      meetingtype: true,
      meetingmember: {
        include: { staff: true }
      }
    }
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Meeting not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        
        <a href="/meetings" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
        </a>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          
          <div className="p-6 md:p-8 border-b border-gray-50 bg-gradient-to-r from-white to-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700">
                    {product.meetingtype.MeetingTypeName}
                  </span>
                  {product.IsCancelled ? (
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {product.MeetingDescription || "Untitled Meeting"}
                </h1>
              </div>

              {product.DocumentPath && (
                <a 
                  href={product.DocumentPath} 
                  target="_blank"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" /> View Document
                </a>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            
            <div className="md:col-span-2 space-y-8">
              
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Meeting Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Date</p>
                      <p className="text-gray-900 font-semibold">
                        {product.MeetingDate ? new Date(product.MeetingDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Time</p>
                      <p className="text-gray-900 font-semibold">
                        {product.MeetingDate ? new Date(product.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cancellation Box */}
              {product.IsCancelled && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Cancellation Details
                  </div>
                  <p className="text-red-600 text-sm italic">
                    "{product.CancellationReason || "No specific reason provided."}"
                  </p>
                  <p className="text-xs text-red-400 mt-2">
                    Date: {product.CancellationDateTime?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Members List */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2" /> Attendees
              </h3>
              <ul className="space-y-3">
                {product.meetingmember.length > 0 ? (
                  product.meetingmember.map((m) => (
                    <li key={m.MeetingMemberID} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {m.staff.StaffName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{m.staff.StaffName}</span>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${m.IsPresent ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}>
                        {m.IsPresent ? 'Present' : 'Absent'}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No members assigned</p>
                )}
              </ul>
            </div>

          </div>

          {/* Footer Metadata */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            <span>Meeting ID: {product.MeetingID}</span>
            <span>Created: {product.Created?.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}