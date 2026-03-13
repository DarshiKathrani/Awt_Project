'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../ui/AdminNavbar";

type Role = 'admin' | 'meeting_convener' | 'staff';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  useEffect(() => {

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (!cookie) {
      router.push("/");
      return;
    }

    try {
      const token = cookie.split("=")[1];
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role: Role = payload.role;

      if (role !== "admin") {
        router.push("/not-authorized");
      }

    } catch {
      router.push("/");
    }

  }, []);

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}