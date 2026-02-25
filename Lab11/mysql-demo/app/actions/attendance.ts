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

  revalidatePath(`//convener-dashboard/attendance/${meetingId}`);
  redirect(`/convener-dashboard/attendance/${meetingId}`);
}

// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

export async function SaveAttendanceAction(formData: FormData) {
  const meetingId = Number(formData.get("MeetingID"));
  const entries = Array.from(formData.entries());

  const presentStaffIds = entries
    .filter(([key, value]) => key.startsWith("staff_") && value === "on")
    .map(([key]) => Number(key.replace("staff_", "")));

  await prisma.$transaction([
   
    prisma.meetingmember.updateMany({
      where: { MeetingID: meetingId },
      data: { IsPresent: false },
    }),
   
    prisma.meetingmember.updateMany({
      where: {
        MeetingID: meetingId,
        StaffID: { in: presentStaffIds },
      },
      data: { IsPresent: true },
    }),
  ]);

  revalidatePath(`/convener-dashboard/attendance/${meetingId}`);
  revalidatePath(`/convener-dashboard/attendance/`);
  redirect(`/convener-dashboard`);
}