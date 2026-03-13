export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PostLogin() {
  const cookieStore = await cookies();  
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  const role = payload.role;

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "staff") {
    redirect("/dashboard");
  }

  if (role === "meeting_convener") {
    redirect("/convener-dashboard");
  }

  redirect("/not-authorized");
}