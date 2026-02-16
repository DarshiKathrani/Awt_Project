import React from 'react'
import { prisma } from "@/lib/prisma";
import EditStaffAction from '@/app/(admin)/actions/StaffActions/EditStaffAction';
import Link from 'next/link';

const countryCodes = [
  { code: "+1", label: "US/CA", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+91", label: "IN", flag: "🇮🇳" },
  { code: "+61", label: "AU", flag: "🇦🇺" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
];

async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.staff.findFirst({
    where: { StaffID: Number(id) },
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Staff member not found.</h2>
          <Link href="/staffs" className="text-blue-600 hover:underline mt-2 inline-block">Return to Directory</Link>
        </div>
      </div>
    );
  }

  // --- LOGIC TO SPLIT THE PHONE NUMBER ---
  const fullNo = data.MobileNo || "";
  const detectedCode = countryCodes.find(c => fullNo.startsWith(c.code))?.code || "+91";
  const rawNumber = fullNo.replace(detectedCode, "");

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6">
      
      {/* Back Button */}
      <div className="w-full max-w-md mb-4">
        <Link href="/staffs" className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Directory
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Decorative Header - Indigo/Purple Theme for Edit */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 px-8 py-10 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Edit Profile</h2>
              <p className="text-indigo-100 text-sm mt-1 opacity-90">Updating info for ID #{data.StaffID}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl border border-white/30">
              {data.StaffName.charAt(0)}
            </div>
          </div>
        </div>

        <form action={EditStaffAction} className="p-8 space-y-5">
          <input type='hidden' name='StaffID' value={data.StaffID} />

          {/* Staff Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="StaffName"
              required
              defaultValue={data.StaffName}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="EmailAddress"
              defaultValue={data.EmailAddress ?? ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              readOnly

            />
          </div>

          {/* Contact Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Contact Number
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  name="CountryCode"
                  defaultValue={detectedCode}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer pr-10"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <input
                type="tel"
                name="MobileNo"
                required
                defaultValue={rawNumber}
                placeholder="Number"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Notes / Remarks
            </label>
            <textarea
              name="Remarks"
              defaultValue={data.Remarks ?? ""}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUser;