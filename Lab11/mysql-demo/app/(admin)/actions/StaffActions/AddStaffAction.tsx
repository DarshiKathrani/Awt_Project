"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

async function AddStaffAction(formData: FormData) {
  const StaffName = formData.get("StaffName") as string;
  const MobileNo = formData.get("MobileNo") as string;
  const countryCode = (formData.get("CountryCode") as string) || "";
  const fullContact = MobileNo ? `${countryCode}${MobileNo}` : "";
  const EmailAddress = formData.get("EmailAddress") as string;
  const Remarks = formData.get("Remarks") as string;

  const Password = formData.get("Password") as string;
  const Role = formData.get("Role") as "staff" | "meeting_convener";

  if (!StaffName || !EmailAddress || !Password || !Role) {
    throw new Error("Required fields missing");
  }

  const hashedPassword = await bcrypt.hash(Password, 10);


  await prisma.$transaction(async (tx) => {

    const user = await tx.users.create({
      data: {
        name: StaffName,
        email: EmailAddress,
        password: hashedPassword,
        role: Role,
      },
    });


    await tx.staff.create({
      data: {
        StaffName,
        MobileNo: fullContact,
        EmailAddress,
        Remarks,
        user_id: user.user_id,
      },
    });
  });

  revalidatePath("/staffs");
  redirect("/staffs");
}

export { AddStaffAction };
