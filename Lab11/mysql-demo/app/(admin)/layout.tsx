'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../ui/AdminNavbar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Start as loading

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
      } else {
        setLoading(false); // Only stop loading if admin
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (loading) {
    // Return a full-screen loader so the user doesn't see the dashboard content
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}