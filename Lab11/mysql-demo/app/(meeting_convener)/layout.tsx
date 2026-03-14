'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Compass, 
  LogOut, 
  Loader2 
} from "lucide-react";
import { LogoutAction } from "../(admin)/actions/AuthActions/LogoutAction";

export default function ConvenerLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. THE PROTECTOR (EFFECT) ---
  // This ensures the page is only visible to the right person.
  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        if (payload.role !== "meeting_convener") {
          router.replace("/not-authorized");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        router.replace("/");
      }
    };
    checkAuth();
  }, [router]);

  // --- 2. THE 404 KILLER (CLIENT CLEANUP) ---
  // This function clears the Vercel-side cookie manually.
  // We use window.location.origin to ensure we are targeting the right deployment.
  const handleLogoutCleanup = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
  };

  const navItems = [
    { label: "Overview", href: "/convener-dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { label: "Schedule", href: "/convener-dashboard/schedule", icon: Calendar, color: "text-emerald-500" },
    { label: "Attendance", href: "/convener-dashboard/attendance", icon: Users, color: "text-violet-500" },
  ];

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8F9FB]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Validating Gateway...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-slate-700 font-sans">
      <aside className="w-64 border-r border-slate-200/60 flex flex-col fixed h-full bg-white/80 backdrop-blur-md z-50">
        <div className="p-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800 italic">
            Minutes<span className="text-indigo-500">HQ</span>
          </span>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all group"
            >
              <item.icon className={`w-4 h-4 stroke-[2px] ${item.color} opacity-60 group-hover:opacity-100`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100">
          {/* THE FIX: onSubmit fires before the form reaches the server action */}
          <form action={LogoutAction} onSubmit={handleLogoutCleanup}>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all group"
            >
              Sign Out
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}