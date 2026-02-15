import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteMeeting from "@/app/ui/DeleteMeeting";
import { meetings } from "@prisma/client";

export default async function GetAll() {
  const rows = await prisma.meetings.findMany({
    orderBy: { MeetingDate: 'desc'}
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meeting Hub</h1>
            <p className="text-sm text-gray-500 mt-1">Review schedules, agendas, and attached minutes.</p>
          </div>

          <Link
            href="/meetings/add"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-indigo-200 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Schedule Meeting
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Docs</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {rows.map((m: meetings) => (
                  <tr key={m.MeetingID} className="group hover:bg-indigo-50/30 transition-colors">
                    
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 mr-3">
                           <span className="text-[10px] font-bold uppercase leading-none">
                             {new Date(m.MeetingDate).toLocaleString('default', { month: 'short' })}
                           </span>
                           <span className="text-sm font-black">
                             {new Date(m.MeetingDate).getDate()}
                           </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {new Date(m.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-gray-400">{new Date(m.MeetingDate).getFullYear()}</div>
                        </div>
                      </div>
                    </td>

                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {m.MeetingDescription || "Untitled Meeting"}
                      </div>
                      <div className="text-xs text-gray-400">ID: #{m.MeetingID}</div>
                    </td>

                    
                    <td className="px-6 py-4">
                      {m.IsCancelled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          Scheduled
                        </span>
                      )}
                    </td>

        
<td className="px-4 py-3">
  {m.DocumentPath ? (
    <a
      
      href={m.DocumentPath}
      download={m.DocumentPath.split('/').pop()} 
      target="_self"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
      title="Download document"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </a>
  ) : (
    <span className="text-gray-300">—</span>
  )}
</td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/meetings/${m.MeetingID}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>

                        <Link
                          href={`/meetings/edit/${m.MeetingID}`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>

                        <DeleteMeeting id={m.MeetingID} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {rows.length === 0 && (
            <div className="py-20 text-center">
              <h3 className="text-gray-900 font-bold text-lg">No meetings found</h3>
              <p className="text-gray-500 text-sm mt-1">Plan and schedule your first organizational meeting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}