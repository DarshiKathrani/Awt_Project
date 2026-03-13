import { prisma } from "@/lib/prisma";
import EditMeetingMemberAction from "@/app/(admin)/actions/MeetingMemberActions/EditMeetingMemberAction";
export const dynamic = "force-dynamic";
async function EditUser({ params }: { params: { id: string } }) {
  const {id} = await params;
  const data = await prisma.meetingmember.findFirst({
    where: { MeetingMemberID: Number(id) },
  });

  const meetings = await prisma.meetings.findMany();
  const staff = await prisma.staff.findMany();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <form action={EditMeetingMemberAction} className="space-y-4">
          <input type="hidden" name="MeetingMemberID" value={data?.MeetingMemberID} />


          {/* Staff */}
          <select
            name="StaffID"
            defaultValue={data?.StaffID}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Meeting Type</option>
            {staff.map((type) => (
              <option key={type.StaffID} value={type.StaffID}>
                {type.StaffName}
              </option>
            ))}
          </select>

          <select
            name="MeetingID"
            defaultValue={data?.MeetingID}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Meeting</option>
            {meetings.map((type) => (
              <option key={type.MeetingID} value={type.MeetingID}>
                {type.MeetingDescription}
              </option>
            ))}
          </select>

          {/* Is Cancelled */}
          <div className="flex items-center gap-2">
            <label>Is Present</label>
            <input
              type="checkbox"
              name="IsPresent"
              defaultChecked={data?.IsPresent ?? false}
              id="isPresent"
            />
          </div>

         <div className="flex items-center gap-2">
            <label>Remarks</label>
            <input
              type="text"
              name="Remarks"
              defaultValue={data?.Remarks?? "No Remarks"}
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Update Meeting
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;