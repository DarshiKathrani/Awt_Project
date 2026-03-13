'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../ui/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/");
      return;
    }

    try {

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
        router.replace("/not-authorized");
        return;
      }

      setChecked(true);

    } catch {
      router.replace("/");
    }

  }, []);

  if (!checked) {
    return null;
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}