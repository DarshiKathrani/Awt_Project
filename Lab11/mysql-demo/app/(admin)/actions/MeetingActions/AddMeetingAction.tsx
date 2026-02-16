"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function AddMeetingAction(formData: FormData) {
  let success = false; 

  try {
    const MeetingDate = formData.get("MeetingDate") as string;
    const MeetingTypeID = Number(formData.get("MeetingTypeID"));
    const MeetingDescription = formData.get("MeetingDescription") as string | null;
    const file = formData.get("DocumentPath") as File | null;

    let DocumentPath: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads/meeting_docs");

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      
      fs.writeFileSync(filePath, buffer);
      DocumentPath = `/uploads/meeting_docs/${uniqueFileName}`;
    }

    await prisma.meetings.create({
      data: {
        MeetingDate: new Date(MeetingDate),
        MeetingTypeID,
        MeetingDescription,
        DocumentPath: DocumentPath,
        IsCancelled: false,
      },
    });

    success = true; // Mark as successful
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    // Return a plain object so the UI can show the error, or re-throw
    throw new Error("Failed to create meeting");
  }

  // Redirect and Revalidate must happen OUTSIDE the try/catch block
  if (success) {
    revalidatePath("/meetings");
    redirect("/meetings");
  }
}