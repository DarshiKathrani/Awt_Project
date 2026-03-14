"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function UpdateMeetingAction(id: number, formData: FormData) {
  try {
    const MeetingDate = formData.get("MeetingDate") as string;
    const MeetingTypeID = Number(formData.get("MeetingTypeID"));
    const MeetingDescription = formData.get("MeetingDescription") as string | null;
    const DocumentPath = formData.get("DocumentPath") as string | null;

    // Use the primary key defined in your schema
    await prisma.meetings.update({
      where: { MeetingID: id }, 
      data: {
        MeetingDate: new Date(MeetingDate),
        MeetingTypeID,
        MeetingDescription,
        DocumentPath,
      },
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    throw new Error("Failed to update meeting");
  }

  redirect("/attendance");
}