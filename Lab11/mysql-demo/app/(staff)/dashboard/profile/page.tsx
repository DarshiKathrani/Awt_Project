import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User, Mail, Phone, ShieldCheck, Hash, LogOut, Edit3 } from "lucide-react";
import Link from "next/link";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    return JSON.parse(payloadJson) as { user_id: number, email: string, role: string };
  } catch { return null; }
}

export default async function StaffProfile() {
  const auth = await getAuthenticatedUser();
  if (!auth) redirect("/login");

  // This query joins the Staff table with the User table
  const staff = await prisma.staff.findUnique({
    where: { user_id: auth.user_id },
    include: {
      user: true // This allows us to access staff.user.email
    }
  });

  if (!staff) return <div className="p-20 text-center font-black text-slate-400 uppercase">Profile Not Linked</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 italic uppercase tracking-tighter">
              My <span className="text-indigo-600">Account</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Verified Staff Credentials</p>
          </div>
          <Link href="/dashboard/profile/edit" className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm">
            <Edit3 className="w-3 h-3" /> Edit Profile
          </Link>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 bg-slate-900 text-white flex items-center gap-6">
            <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-2xl font-black italic">
              {staff.StaffName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase italic leading-none">{staff.StaffName}</h2>
              <p className="text-indigo-400 font-black text-[10px] uppercase mt-2 tracking-widest">Authorized Staff Member</p>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* System Info */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> System Identity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><Hash className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Staff ID</p>
                    <p className="text-sm font-bold text-slate-900">#{staff.StaffID}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><User className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Full Name</p>
                    <p className="text-sm font-bold text-slate-900 uppercase">{staff.StaffName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><Mail className="w-4 h-4" /> Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><Mail className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Primary Email</p>
                    {/* Accessing email through the joined user relation */}
                    <p className="text-sm font-bold text-slate-900">{staff.user?.email || auth.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><Phone className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Phone Number</p>
                    {/* Checks staff table for phone number */}
                    <p className="text-sm font-bold text-slate-900">{(staff as any).PhoneNo || "Not Assigned"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="bg-rose-50 border-2 border-dashed border-rose-100 rounded-[2rem] p-8 flex items-center justify-between">
          <div>
            <h4 className="text-rose-900 font-black uppercase text-sm italic">Session</h4>
            <p className="text-rose-600 text-[10px] font-bold uppercase tracking-wider">Securely sign out</p>
          </div>
          <Link href="/login" className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}