import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNavbar from "../ui/AdminNavbar";

type Role = 'admin' | 'meeting_convener' | 'staff';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  let payload: { role: Role };

  try {
    const payloadBase64 = token.value.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    payload = JSON.parse(payloadJson);
  } catch {
    redirect("/login");
  }
  if (payload.role !== "admin") {
    redirect("/not-authorized");
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
