"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function EditStaffAction(formData: FormData) {

  const id = Number(formData.get("StaffID"));

  const countryCode = formData.get("CountryCode") as string;
  const numberPart = formData.get("MobileNo") as string;
  const fullContact = numberPart ? `${countryCode}${numberPart}` : "";

  const StaffName = formData.get("StaffName") as string;
  const EmailAddress = formData.get("EmailAddress") as string;
  const Remarks = formData.get("Remarks") as string;

  await prisma.$transaction(async (tx) => {

    const staff = await tx.staff.update({
      where: { StaffID: id },
      data: {
        StaffName,
        MobileNo: fullContact,
        EmailAddress,
        Remarks,
      },
    });

    if (staff.user_id) {
      await tx.users.update({
        where: { user_id: staff.user_id },
        data: {
          name: StaffName,
          email: EmailAddress,
        },
      });
    }
  });

  revalidatePath("/staffs");
  redirect("/staffs");
}

export default EditStaffAction;