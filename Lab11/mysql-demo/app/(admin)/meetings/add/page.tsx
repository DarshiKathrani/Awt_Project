import AddMeetingForm from "./AddMeetingForm"; // Points to the file you just renamed
import { prisma } from "@/lib/prisma";

export default async function AddMeetingPage() {
  // 1. Fetch the data from the database
  const types = await prisma.meetingtype.findMany();

  // 2. Pass the data to the form
  return <AddMeetingForm meetingTypes={types} />;
}