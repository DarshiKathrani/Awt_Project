import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function NotAuthorized() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Visual Icon Group */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-100 rounded-[2.5rem] rotate-6 scale-110 opacity-50"></div>
          <div className="relative bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl shadow-indigo-100/50">
            <ShieldAlert className="w-16 h-16 text-indigo-600" />
            <div className="absolute -bottom-2 -right-2 bg-gray-900 p-2 rounded-xl border-4 border-[#F8F9FB]">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic leading-none">
            Access <span className="text-indigo-600 font-light not-italic">Restricted</span>
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
            Governance Clearance Required
          </p>
          <div className="pt-4">
            <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-[280px] mx-auto">
              Your current profile does not have the necessary permissions to view the 
              <span className="font-bold text-gray-900"> Admin Dashboard</span>.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Safety
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] pt-8">
          MinutesHQ Security Protocol v4.0
        </p>
      </div>
    </div>
  );
}