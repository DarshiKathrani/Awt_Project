import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut, LayoutDashboard, CalendarDays } from "lucide-react";
import { LogoutAction } from "../(admin)/actions/AuthActions/LogoutAction";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) redirect("/login");

  let payload: { role: string; name: string };
  try {
    const payloadBase64 = token.value.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    payload = JSON.parse(payloadJson);
  } catch {
    redirect("/");
  }

  if (payload.role !== "staff") redirect("/not-authorized");

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-2xl uppercase">Minutes</span>
          </Link>

          <div className="hidden md:flex gap-10 items-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 transition-colors">
                <LayoutDashboard className="w-3 h-3" /> Overview
            </Link>
            <Link href="/dashboard/archive" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
                <CalendarDays className="w-3 h-3" /> Meetings
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Logged In</p>
              <p className="text-[10px] font-bold text-slate-400">{payload.name || "Staff Member"}</p>
            </div>

            {/* Logout Action */}
            <form action={LogoutAction}>
              <button 
                type="submit"
                className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all group"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}