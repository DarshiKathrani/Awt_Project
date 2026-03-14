"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function AddMeetingAction(formData: FormData) {
  // 1. Do the database work inside the try/catch
  try {
    const MeetingDate = formData.get("MeetingDate") as string;
    const MeetingTypeID = Number(formData.get("MeetingTypeID"));
    const MeetingDescription = formData.get("MeetingDescription") as string | null;
    const DocumentPath = formData.get("DocumentPath") as string | null;

    await prisma.meetings.create({
      data: {
        MeetingDate: new Date(MeetingDate),
        MeetingTypeID,
        MeetingDescription,
        DocumentPath: DocumentPath,
        IsCancelled: false,
      },
    });

    revalidatePath("/attendance");
  } catch (error) {
    // This ONLY catches actual errors (database, syntax, etc)
    console.error("DATABASE ERROR:", error);
    throw new Error("Failed to create meeting");
  }

  // 2. Put the redirect OUTSIDE the try/catch
  // This way, the redirect isn't "caught" as an error!
  redirect("/attendance"); 
}