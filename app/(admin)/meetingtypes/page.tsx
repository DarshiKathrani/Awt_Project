import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/app/ui/DeleteMeeting";

export default async function GetAll() {
  const rows = await prisma.meetingtype.findMany({
    orderBy: { MeetingTypeName: 'asc' } 
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Meeting Categories
            </h1>
            <p className="text-slate-500 font-medium">Manage and organize your meeting types</p>
          </div>
          <Link
            href="/meetingtypes/add"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Type
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-spacing-0">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">ID</th>
                  <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">Category Name</th>
                  <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.map((m) => (
                  <tr
                    key={m.MeetingTypeID}
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold group-hover:bg-white transition-colors">
                        #{m.MeetingTypeID}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-700 text-lg">
                        {m.MeetingTypeName}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        {/* View Link */}
                        <Link
                          href={`/meetingtypes/${m.MeetingTypeID}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>

                        {/* Edit Link */}
                        <Link
                          href={`/meetingtypes/edit/${m.MeetingTypeID}`}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all"
                          title="Edit Type"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Link>

                        {/* Delete Component */}
                        <div className="hover:scale-110 transition-transform">
                          <DeleteButton id={m.MeetingTypeID} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-slate-900 font-bold">No Categories Found</h3>
              <p className="text-slate-500 text-sm">Get started by creating your first meeting type.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}