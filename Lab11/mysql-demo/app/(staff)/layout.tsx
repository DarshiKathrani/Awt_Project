import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) redirect("/login");

  let payload: { role: string };
  try {
    const payloadBase64 = token.value.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    payload = JSON.parse(payloadJson);
  } catch {
    redirect("/login");
  }

  // STRICT CHECK: Only 'staff' allowed. Admins are redirected.
  if (payload.role !== "staff") {
    redirect("/not-authorized");
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Personalized Staff Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-black text-slate-900 uppercase tracking-tighter text-lg">MyPortal</span>
          </div>
          
          <div className="flex gap-8 items-center">
            <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Overview</Link>
            <Link href="/history" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">My History</Link>
            {/* Simple Profile Avatar */}
            <Link href="/profile" className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center hover:border-indigo-200 transition-all">
               <span className="text-xs font-black text-slate-500">USER</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}