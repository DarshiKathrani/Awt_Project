import { prisma } from "@/lib/prisma";
import { AssignMemberAction } from "@/app/actions/AssignMemberAction";
import Link from "next/link";

export default async function AssignMembers({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meetingId = Number(id);

  const [meeting, allStaff, currentMembers] = await Promise.all([
    prisma.meetings.findUnique({ where: { MeetingID: meetingId }, include: { meetingtype: true } }),
    prisma.staff.findMany({ orderBy: { StaffName: 'asc' } }),
    prisma.meetingmember.findMany({ where: { MeetingID: meetingId }, select: { StaffID: true } })
  ]);

  if (!meeting) return <div className="p-10 text-center">Meeting not found</div>;

  const assignedIds = currentMembers.map(m => m.StaffID);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/attendance" className="text-blue-600 font-bold flex items-center gap-2 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Cancel Assignment
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Assign Staff to Meeting</h1>
          <p className="text-slate-500 font-medium">Selecting members for: {meeting.MeetingDescription}</p>
        </div>

        <form action={AssignMemberAction} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <input type="hidden" name="MeetingID" value={meetingId} />
          
          <div className="p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allStaff.map((staff) => (
                <label key={staff.StaffID} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                  <input 
                    type="checkbox" 
                    name="staffIds" 
                    value={staff.StaffID} 
                    defaultChecked={assignedIds.includes(staff.StaffID)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{staff.StaffName}</p>
                    <p className="text-xs text-slate-500">{staff.Remarks || "Staff Member"}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-6 border-t">
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-lg shadow-blue-200">
                Confirm Assignments & Go to Roll Call
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}