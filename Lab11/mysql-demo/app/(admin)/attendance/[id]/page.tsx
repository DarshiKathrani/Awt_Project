import { prisma } from "@/lib/prisma";
import { SaveAttendanceAction } from "../../actions/AttendanceActions/SaveAttendanceAction";
import Link from "next/link";
import AttendanceToggle from "@/app/components/AttendanceToggle"; 

export default async function MarkingSheet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meetingId = Number(id);

  const meeting = await prisma.meetings.findUnique({
    where: { MeetingID: meetingId },
    include: {
      meetingmember: { 
        include: { staff: true },
        orderBy: { staff: { StaffName: 'asc' } }
      }
    }
  });

  if (!meeting) return <div className="p-10 text-center">Meeting not found</div>;

  
  const displayList = meeting.meetingmember.map(m => ({
    staffId: m.staff.StaffID,
    name: m.staff.StaffName,
    isPresent: !!m.IsPresent 
  }));

  if (displayList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="font-bold text-slate-600 mb-4">No staff assigned to this meeting.</p>
        <Link href={`/attendance/assign/${meetingId}`} className="bg-blue-600 text-white px-6 py-2 rounded-xl">
          Assign Members
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <AttendanceToggle /> 
      
      <div className="max-w-3xl mx-auto">
        <Link href="/attendance" className="text-sm font-bold text-blue-600 mb-6 inline-block">← Back</Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <h1 className="text-2xl font-bold">{meeting.MeetingDescription}</h1>
            <p className="text-slate-400 text-sm">Marking {displayList.length} Staff</p>
          </div>

          <form action={SaveAttendanceAction} className="p-8">
            <input type="hidden" name="MeetingID" value={meetingId} />
            
            <div className="mb-6 flex justify-between items-center bg-blue-50 p-4 rounded-2xl">
              <h2 className="text-blue-900 font-extrabold text-lg">Attendee List</h2>
              <button 
                type="button" 
                id="selectAllBtn" 
                className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-xl text-xs font-black"
              >
                Toggle All Present
              </button>
            </div>

            <div className="space-y-3">
              {displayList.map((person) => (
                <label key={person.staffId} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {person.name.charAt(0)}
                    </div>
                    <p className="font-bold text-slate-700">{person.name}</p>
                  </div>
                  
                  <div className="relative inline-flex items-center">
                    <input 
                      type="checkbox" 
                      name={`staff_${person.staffId}`} 
                      defaultChecked={person.isPresent}
                      className="attendance-checkbox sr-only peer" 
                    />
                    <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                  </div>
                </label>
              ))}
            </div>

            <button type="submit" className="w-full mt-10 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition-all">
              Save Attendance Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}