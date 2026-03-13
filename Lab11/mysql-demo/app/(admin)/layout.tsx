'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../ui/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  useEffect(() => {

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
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