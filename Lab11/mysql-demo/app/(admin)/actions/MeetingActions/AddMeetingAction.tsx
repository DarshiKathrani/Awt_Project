"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function AddMeetingAction(formData: FormData) {
  try {
    const MeetingDate = formData.get("MeetingDate") as string;
    const MeetingTypeID = Number(formData.get("MeetingTypeID"));
    const MeetingDescription = formData.get("MeetingDescription") as string | null;
    
    // CHANGE 1: Get the string URL, not a File object
    const DocumentPath = formData.get("DocumentPath") as string | null;

    // CHANGE 2: Remove the "cloud_placeholder" logic entirely.
    // We trust that the DocumentPath contains the valid https://utfs.io/ URL
    // already sent by your form.

    await prisma.meetings.create({
      data: {
        MeetingDate: new Date(MeetingDate),
        MeetingTypeID,
        MeetingDescription,
        DocumentPath: DocumentPath, // This is now a real URL
        IsCancelled: false,
      },
    });

    revalidatePath("/attendance");
    revalidatePath("/meetings");
    redirect("/attendance");
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    throw new Error("Failed to create meeting");
  }
}