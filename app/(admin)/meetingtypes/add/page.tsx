import { AddMeetingTypeAction } from "@/app/actions/AddMeetingTypeAction";
import React from "react";
import Link from "next/link";

function AddUser() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 relative">
      {/* Background Decoration - Matches your Add Meeting UI */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            href="/meetingtypes" 
            className="text-xs font-bold text-blue-600 flex items-center gap-1 group mb-4 uppercase tracking-wider"
          >
            <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Category
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Define a new classification for your meetings.</p>
        </div>

        <form action={AddMeetingTypeAction} className="space-y-6">
          
          {/* Meeting Type Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category Name
            </label>
            <input
              type="text"
              name="MeetingTypeName"
              required
              placeholder="e.g. Executive Board, Weekly Sync"
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Internal Remarks
            </label>
            <textarea
              name="Remarks"
              placeholder="Who is this for? Any special requirements?"
              rows={3}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;