"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
// import fs from "fs"; // Remove or comment out
// import path from "path"; // Remove or comment out

export async function AddMeetingAction(formData: FormData) {
  let success = false; 

  try {
    const MeetingDate = formData.get("MeetingDate") as string;
    const MeetingTypeID = Number(formData.get("MeetingTypeID"));
    const MeetingDescription = formData.get("MeetingDescription") as string | null;
    const file = formData.get("DocumentPath") as File | null;

    let DocumentPath: string | null = null;

    // --- TEMPORARY FIX FOR VERCEL ---
    if (file && file.size > 0) {
      // Since fs.writeFileSync crashes Vercel, we'll store a placeholder
      // until you set up a cloud storage like UploadThing or Cloudinary.
      DocumentPath = `cloud_placeholder_${file.name}`; 
      console.log("File detected, but skipping local save to prevent Vercel crash.");
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

    success = true; 
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    throw new Error("Failed to create meeting");
  }

  if (success) {
    // Revalidate BOTH paths to ensure the UI updates everywhere
    revalidatePath("/meetings");
    revalidatePath("/attendance"); 
    
    // Redirecting to the main attendance page as per your requirement
    redirect("/attendance");
  }
}