"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AssignMemberAction(formData: FormData) {
  const meetingId = Number(formData.get("MeetingID"));
  const selectedStaffIds = formData.getAll("staffIds").map(id => Number(id));

  
  if (selectedStaffIds.length === 0) {
      return; 
  }

  await prisma.$transaction([
    prisma.meetingmember.deleteMany({ where: { MeetingID: meetingId } }),
    prisma.meetingmember.createMany({
      data: selectedStaffIds.map(staffId => ({
        MeetingID: meetingId,
        StaffID: staffId,
        IsPresent: false,
      }))
    })
  ]);

  revalidatePath(`/attendance/${meetingId}`);
  redirect(`/attendance/${meetingId}`);
}