import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function PostLogin() {

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const decoded: any = jwt.decode(token);

  if (decoded.role === "admin") {
    redirect("/admin");
  }

  if (decoded.role === "staff") {
    redirect("/staff");
  }

  if (decoded.role === "meeting_convener") {
    redirect("/convener-dashboard");
  }

  redirect("/");
}