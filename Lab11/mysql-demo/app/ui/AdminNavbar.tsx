
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutAction } from "../(admin)/actions/AuthActions/LogoutAction";
import { LogOut } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();

  // Define navigation items with their display names and routes
  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Staff Management", href: "/staffs" },
    { name: "Meetings", href: "/meetings" },
    { name: "Attendance", href: "/attendance" },
    { name: "Meeting Types", href: "/meetingtypes" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Logo and Links */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-2xl font-black text-blue-600 tracking-tighter">
                MEET<span className="text-gray-800">FLOW</span>
              </Link>
            </div>
            
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side: Profile/User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-800 leading-none">System Admin</span>
              <span className="text-xs text-green-500 font-medium uppercase tracking-widest mt-1 flex items-center justify-end">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
              AD
            </div>
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
      </div>
      
      {/* Mobile Menu (Optional simple version) */}
      {/* <div className="md:hidden border-t border-gray-100 bg-gray-50 flex justify-around py-2">
         {navItems.slice(0, 4).map((item) => (
            <Link key={item.name} href={item.href} className="text-[10px] font-bold text-gray-500 uppercase">
              {item.name.split(' ')[0]}
            </Link>
         ))}
      </div> */}
    </nav>
  );
}