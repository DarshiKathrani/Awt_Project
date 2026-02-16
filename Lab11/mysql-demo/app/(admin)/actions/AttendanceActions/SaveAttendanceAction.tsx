"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function SaveAttendanceAction(formData: FormData) {
  const meetingId = Number(formData.get("MeetingID"));
  const entries = Array.from(formData.entries());

  // Get IDs of staff marked as present
  const presentStaffIds = entries
    .filter(([key, value]) => key.startsWith("staff_") && value === "on")
    .map(([key]) => Number(key.replace("staff_", "")));

  await prisma.$transaction([
    // 1. Set all CURRENTLY ASSIGNED members for this meeting to absent
    prisma.meetingmember.updateMany({
      where: { MeetingID: meetingId },
      data: { IsPresent: false },
    }),
    // 2. Set only the checked ones to present
    prisma.meetingmember.updateMany({
      where: {
        MeetingID: meetingId,
        StaffID: { in: presentStaffIds },
      },
      data: { IsPresent: true },
    }),
  ]);

  revalidatePath(`/attendance/${meetingId}`);
  revalidatePath("/attendance");
  redirect("/attendance");
}