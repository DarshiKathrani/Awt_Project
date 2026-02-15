"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
async function AddMeetingMemberAction(formData: FormData){
const StaffID = Number(formData.get("StaffID"));
const MeetingID = Number(formData.get("MeetingID"));
const Remarks = formData.get("Remarks") as string;
const IsPresent = formData.get("IsPresent") === "on"
 const data = {StaffID,MeetingID, Remarks,IsPresent};
await prisma.meetingmember.create({data});
revalidatePath("/meetingmembers");
redirect("/meetingmembers")
}
export {AddMeetingMemberAction}