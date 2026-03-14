"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function UpdateMeetingAction(id: number, formData: FormData) {
  try {
    const MeetingDate = formData.get("MeetingDate") as string;
    const MeetingTypeID = Number(formData.get("MeetingTypeID"));
    const MeetingDescription = formData.get("MeetingDescription") as string | null;
    const DocumentPath = formData.get("DocumentPath") as string | null;

    await prisma.meetings.update({
      where: {MeetingID: id },
      data: {
        MeetingDate: new Date(MeetingDate),
        MeetingTypeID,
        MeetingDescription,
        DocumentPath,
      },
    });

    revalidatePath("/attendance");
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    throw new Error("Failed to update meeting");
  }

  // Redirect is OUTSIDE the try/catch
  redirect("/attendance");
}