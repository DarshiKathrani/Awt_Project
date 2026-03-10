import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-2xl uppercase">Minutes</span>
          </Link>

          <div className="hidden md:flex gap-10 items-center">
            <Link href="/dashboard" className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">
              Overview
            </Link>
            <Link href="/dashboard/archive" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
              Meetings
            </Link>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Logged In</p>
                <p className="text-[10px] font-bold text-slate-400">{payload.name || "Staff Member"}</p>
             </div>
             <button className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center hover:ring-4 ring-indigo-50 transition-all">
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  {payload.name ? payload.name.substring(0, 2) : 'ST'}
                </span>
             </button>
          </div>
        </div>
      </nav>

      <main>
        {children}
      </main>
    </div>
  );
}