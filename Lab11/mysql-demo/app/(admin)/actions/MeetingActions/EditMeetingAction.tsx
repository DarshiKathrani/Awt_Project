"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function EditMeetingAction(formData: FormData) {
  const id = Number(formData.get("MeetingID"));
  const uploadedFile = formData.get("DocumentPath"); 
  const existingPath = formData.get("ExistingDocumentPath") as string;

  let documentPath = existingPath; 

  if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
    try {
      const bytes = await uploadedFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 1. Set the physical directory (where the file is actually stored)
      const uploadDir = path.join(process.cwd(), "public", "uploads", "meeting_docs");
      await mkdir(uploadDir, { recursive: true });

      // 2. Create the filename
      const fileName = `${Date.now()}_${uploadedFile.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);

      // 3. Write the file to disk
      await writeFile(filePath, buffer);

      // 4. SAVE THE FULL PATH STRING FOR THE DATABASE
      // This is what will be stored in the DB: /uploads/meeting_docs/123_file.pdf
      documentPath = `/uploads/meeting_docs/${fileName}`;
      
      console.log("SUCCESS: New path for DB:", documentPath);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  }

  // 3. Update Database
  await prisma.meetings.update({
    where: { MeetingID: id },
    data: {
      MeetingDate: new Date(formData.get("MeetingDate") as string),
      MeetingTypeID: Number(formData.get("MeetingTypeID")),
      MeetingDescription: (formData.get("MeetingDescription") as string) || null,
      
      // Now storing the path string, not just the filename
      DocumentPath: documentPath || null, 

      IsCancelled: formData.get("IsCancelled") === "on",
      CancellationDateTime: formData.get("CancellationDateTime")
        ? new Date(formData.get("CancellationDateTime") as string)
        : null,
      CancellationReason: (formData.get("CancellationReason") as string) || null,
    },
  });

  revalidatePath("/meetings");
  redirect("/meetings");
}

export default EditMeetingAction;