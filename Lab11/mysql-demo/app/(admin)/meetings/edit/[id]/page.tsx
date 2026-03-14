import { prisma } from "@/lib/prisma";
import EditMeetingForm from "./EditMeetingForm";

export default async function EditMeetingPage({ params }: { params: { id: string } }) {
  // 1. Convert the ID from string (from URL) to Number
  const meetingId = Number(params.id);

  // 2. Query exactly using the column name defined in your schema
  const meeting = await prisma.meetings.findUnique({
    where: {
      MeetingID: meetingId,
    },
  });

  // 3. Fetch types
  const meetingTypes = await prisma.meetingtype.findMany();

  if (!meeting) {
    return <div>Meeting not found! (ID provided: {params.id})</div>;
  }

  return <EditMeetingForm meeting={meeting} meetingTypes={meetingTypes} />;
}