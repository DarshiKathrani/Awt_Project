"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { writeFile, mkdir } from "fs/promises"; // Remove these
// import path from "path"; // Remove this

async function EditMeetingAction(formData: FormData) {
  const id = Number(formData.get("MeetingID"));
  const uploadedFile = formData.get("DocumentPath"); 
  const existingPath = formData.get("ExistingDocumentPath") as string;

  let documentPath = existingPath; 

  if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
    // TEMPORARY FIX: Avoid fs.writeFile to prevent Vercel crash
    documentPath = `cloud_placeholder_${Date.now()}_${uploadedFile.name.replace(/\s+/g, "_")}`;
    console.log("Edit: File detected, skipping local save for Vercel compatibility.");
  }

  await prisma.meetings.update({
    where: { MeetingID: id },
    data: {
      MeetingDate: new Date(formData.get("MeetingDate") as string),
      MeetingTypeID: Number(formData.get("MeetingTypeID")),
      MeetingDescription: (formData.get("MeetingDescription") as string) || null,
      DocumentPath: documentPath || null, 
      IsCancelled: formData.get("IsCancelled") === "on",
      CancellationDateTime: formData.get("CancellationDateTime")
        ? new Date(formData.get("CancellationDateTime") as string)
        : null,
      CancellationReason: (formData.get("CancellationReason") as string) || null,
    },
  });

  // Revalidate the list and the specific attendance pages
  revalidatePath("/meetings");
  revalidatePath("/attendance");
  revalidatePath(`/attendance/${id}`); 
  
  redirect("/meetings");
}

export default EditMeetingAction;