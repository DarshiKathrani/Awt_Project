import { prisma } from "@/lib/prisma";
import EditMeetingForm from "./EditMeetingForm";

export default async function EditMeetingPage({ params }: { params: { id: string } }) {
  const meetingId = Number(params.id);

  // Fetch the specific meeting AND all types for the dropdown
  const [meeting, meetingTypes] = await Promise.all([
    prisma.meetings.findUnique({ where: { MeetingID: meetingId } }),
    prisma.meetingtype.findMany(),
  ]);

  if (!meeting) return <div>Meeting not found</div>;

  return <EditMeetingForm meeting={meeting} meetingTypes={meetingTypes} />;
}