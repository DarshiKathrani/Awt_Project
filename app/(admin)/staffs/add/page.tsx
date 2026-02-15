"use client";

import { AddStaffAction } from "@/app/actions/AddStaffAction";
import React, { useState } from "react";
import Link from "next/link";

const countryCodes = [
  { code: "+1", label: "US/CA", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+91", label: "IN", flag: "🇮🇳" },
  { code: "+61", label: "AU", flag: "🇦🇺" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
];

function AddUser() {
  const [selectedCode, setSelectedCode] = useState("+91");

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
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
          <h2 className="text-3xl font-black tracking-tight">Add Staff</h2>
          <p className="text-blue-100 text-sm mt-1 opacity-90">Create a new profile for the organization directory.</p>
        </div>

        <form action={AddStaffAction} className="p-8 space-y-5">
          {/* Staff Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                name="StaffName"
                required
                placeholder="e.g. John Doe"
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="EmailAddress"
              required
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Role
            </label>
            <select
              name="Role"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="meeting_convener">Meeting Convener</option>
            </select>`
          </div>

          {/* Contact Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Contact Number
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer pr-10"
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
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

              <input type="hidden" name="CountryCode" value={selectedCode} />

              <input
                type="tel"
                name="MobileNo"
                required
                placeholder="000 000 0000"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Login Password
            </label>
            <input
              type="password"
              name="Password"
              required
              placeholder="Set initial password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Notes / Remarks
            </label>
            <textarea
              name="Remarks"
              rows={2}
              placeholder="Additional details (optional)..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register Staff Member
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-4 uppercase tracking-widest font-semibold">
              Data will be stored in the primary database
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;