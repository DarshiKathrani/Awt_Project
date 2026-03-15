import { prisma } from "@/lib/prisma";
import EditMeetingForm from "./EditMeetingForm";

export default async function EditMeetingPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  // 1. Convert the ID from string (from URL) to Number
  const meetingId = Number(id);

  // 2. Query exactly using the column name defined in your schema
  const [meeting, meetingTypes] = await Promise.all([
    prisma.meetings.findFirst({ 
      where: { 
        MeetingID: meetingId 
      } 
    }),
    prisma.meetingtype.findMany(),
  ]);
  if (!meeting) {
    return <div>Meeting not found! (ID provided: {params.id})</div>;
  }

  return <EditMeetingForm meeting={meeting} meetingTypes={meetingTypes} />;
}