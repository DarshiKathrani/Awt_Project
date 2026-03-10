import Link from "next/link";
import { LayoutDashboard, Calendar, Users, LogOut, Compass } from "lucide-react";
import { LogoutAction } from "../(admin)/actions/AuthActions/LogoutAction";

export default function ConvenerLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Overview", href: "/convener-dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { label: "Schedule", href: "/convener-dashboard/schedule", icon: Calendar, color: "text-emerald-500" },
    { label: "Attendance", href: "/convener-dashboard/attendance", icon: Users, color: "text-violet-500" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-slate-700 font-sans">
      <aside className="w-64 border-r border-slate-200/60 flex flex-col fixed h-full bg-white/80 backdrop-blur-md z-50">
        <div className="p-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800 italic">Minutes<span className="text-indigo-500">HQ</span></span>
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
          <form action={LogoutAction}>
          <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
            Sign Out
          </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12">
        {children}
      </main>
    </div>
  );
}