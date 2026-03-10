import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User, Mail, Phone, ShieldCheck, Hash, LogOut, Edit3 } from "lucide-react";
import Link from "next/link";
import { LogoutAction } from "@/app/(admin)/actions/AuthActions/LogoutAction";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    return JSON.parse(payloadJson) as { user_id: number; email: string; role: string };
  } catch { return null; }
}

export default async function StaffProfile() {
  const auth = await getAuthenticatedUser();
  if (!auth) redirect("/");

  const staff = await prisma.staff.findUnique({
    where: { user_id: auth.user_id },
    include: { user: true }
  });

  if (!staff) return <div className="p-20 text-center font-black text-slate-400">Profile Not Linked</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-bold text-blue-600 flex items-center gap-2 group mb-4">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Staff Account</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Main Profile Info */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black italic shadow-lg shadow-blue-200">
              {staff.StaffName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase">{staff.StaffName}</h2>
              <p className="text-blue-600 font-bold text-sm tracking-wide">Authorized Staff Member</p>
            </div>
          </div>

          {/* Action Card */}
          {/* <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Management</h3>
            <Link href="/dashboard/profile/edit" className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-sm text-center hover:bg-slate-200 transition-all">
              Edit Profile
            </Link>
          </div> */}
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 font-black text-slate-800 uppercase text-sm tracking-widest">
            Personal Information
          </div>
          
          <div className="divide-y divide-slate-100">
            <ProfileRow icon={Hash} label="Staff ID" value={`#${staff.StaffID}`} />
            <ProfileRow icon={User} label="Full Name" value={staff.StaffName} />
            <ProfileRow icon={Mail} label="Email" value={staff.user?.email || auth.email} />
            <ProfileRow icon={Phone} label="Phone" value={(staff as any).PhoneNo || "Not Assigned"} />
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-8 p-6 bg-red-50 border-2 border-dashed border-red-100 rounded-3xl flex items-center justify-between">
          <p className="font-bold text-red-900">End your session</p>
          <form action={LogoutAction}>
          <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
            Sign Out
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-6 flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="font-bold text-slate-800 text-lg">{value}</p>
      </div>
    </div>
  );
}