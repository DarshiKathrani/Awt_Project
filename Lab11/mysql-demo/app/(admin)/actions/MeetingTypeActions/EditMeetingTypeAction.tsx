"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import React from 'react'

async function EditMeetingTypeAction(formData:FormData) {
     const id = Number(formData.get("MeetingTypeID"));

    const saveObj={
    MeetingTypeName : formData.get('MeetingTypeName') as string,
    Remarks : formData.get('Remarks') as string
    
  }
  await prisma.meetingtype.update({
    where:{MeetingTypeID:id},data:saveObj
  });
  revalidatePath('/meetingtypes');
  redirect('/meetingtypes');

  
}
export default EditMeetingTypeAction


