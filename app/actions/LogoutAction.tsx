"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function LogoutAction() {
  const cookieStore = await cookies();

  // Delete the token cookie
    cookieStore.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  redirect("/");
}

export { LogoutAction };
