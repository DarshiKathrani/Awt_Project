"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import React from 'react'

async function EditMeetingMemberAction(formData:FormData) {
     const id = Number(formData.get("MeetingMemberID"));

    const saveObj={
    StaffID : Number(formData.get('StaffID')),
    MeetingID : Number(formData.get('MeetingID')),
    Remarks : formData.get('Remarks') as string,
    IsPresent: formData.get('IsPresent') === "on"
    
  }
  await prisma.meetingmember.update({
    where:{MeetingMemberID:id},data:saveObj
  });
  revalidatePath('/meetingmembers');
  redirect('/meetingmembers');

  
}
export default EditMeetingMemberAction


