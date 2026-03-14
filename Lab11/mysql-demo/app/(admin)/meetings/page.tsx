import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteMeeting from "@/app/ui/DeleteMeeting";
import Search from "@/app/ui/Search"; // Our new generic component
import { meetings } from "@prisma/client";
import { 
  CalendarPlus, 
  Clock, 
  FileText, 
  Eye, 
  Edit2, 
  SearchX, 
  Calendar,
  ChevronRight
} from "lucide-react";

export default async function GetAll({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  // 1. Resolve search parameters
  const params = await searchParams;
  const query = params?.query || "";

  // 2. Fetch filtered data from Prisma
  const rows = await prisma.meetings.findMany({
    where: {
      OR: [
        { MeetingDescription: { contains: query } },
      ],
    },
    orderBy: { MeetingDate: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-200 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Governance Module</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic leading-none">
              Meeting <span className="text-indigo-600 font-light not-italic">HUB</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Centralized repository for session logs and documentation
            </p>
          </div>

          <Link
            href="/meetings/add"
            className="inline-flex items-center justify-center bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95 shrink-0"
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Schedule New Session
          </Link>
        </div>

        {/* SEARCH & FILTER AREA */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/3">
            <Search placeholder="Search meetings by description..." />
          </div>
          <div className="hidden md:block text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Showing {rows.length} result(s)
          </div>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden shadow-indigo-100/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Schedule</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Description & ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Docs</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Control</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {rows.map((m: meetings) => (
                  <tr key={m.MeetingID} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    
                    {/* Date Block */}
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white border border-gray-200 flex flex-col items-center justify-center shadow-sm group-hover:border-indigo-200 group-hover:scale-105 transition-all">
                          <span className="text-[9px] font-black uppercase text-indigo-500 leading-none">
                            {new Date(m.MeetingDate).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-lg font-black text-gray-900">
                            {new Date(m.MeetingDate).getDate()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-sm font-black text-gray-800">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {new Date(m.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Year {new Date(m.MeetingDate).getFullYear()}</div>
                        </div>
                      </div>
                    </td>

                    {/* Content */}
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-gray-900 uppercase italic tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {m.MeetingDescription || "Untitled Session"}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-100 px-2 py-0.5 rounded-md">
                            MTG-{m.MeetingID.toString().padStart(4, '0')}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-8 py-6">
                      {m.IsCancelled ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] bg-red-50 text-red-600 border border-red-100">
                          Terminated
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] bg-indigo-50 text-indigo-600 border border-indigo-100">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Document Link */}
                    <td className="px-8 py-6 text-center">
  {m.DocumentPath ? (
    <a
      href={m.DocumentPath}
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-gray-100 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-200"
      
    >
      <FileText className="w-5 h-5" />
    </a>
  ) : (
    <div className="w-10 h-10 rounded-xl border border-dashed border-gray-200 inline-flex items-center justify-center text-gray-200">
      —
    </div>
  )}
</td>

                    {/* Actions Group */}
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/meetings/${m.MeetingID}`}
                          className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100 hover:shadow-sm"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </Link>

                        <Link
                          href={`/meetings/edit/${m.MeetingID}`}
                          className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-green-100 hover:shadow-sm"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </Link>

                        <div className="pl-1 border-l border-gray-100">
                            <DeleteMeeting id={m.MeetingID} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY SEARCH STATE */}
          {rows.length === 0 && (
            <div className="py-32 text-center bg-white">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gray-50 mb-6 border border-gray-100 text-gray-200">
                <SearchX className="w-10 h-10" />
              </div>
              <h3 className="text-gray-900 font-black uppercase text-lg tracking-tight">Data Sync Failed</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 max-w-xs mx-auto leading-relaxed">
                No sessions match the current query string: <span className="text-indigo-500 italic">"{query}"</span>
              </p>
              <Link href="/meetings" className="inline-block mt-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}