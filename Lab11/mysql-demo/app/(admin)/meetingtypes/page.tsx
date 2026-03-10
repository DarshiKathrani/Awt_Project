import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/app/ui/DeleteMeeting";
import Search from "@/app/ui/Search"; // Using our generic component
import { 
  Plus, 
  Layers, 
  Eye, 
  Edit2, 
  SearchX, 
  Hash, 
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

  // 2. Fetch filtered categories
  const rows = await prisma.meetingtype.findMany({
    where: {
      MeetingTypeName: { contains: query },
    },
    orderBy: { MeetingTypeName: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Layers className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Configuration</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic leading-none">
              Meeting <span className="text-indigo-600 font-light not-italic">Types</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Manage and organize session classifications
            </p>
          </div>

          <Link
            href="/meetingtypes/add"
            className="inline-flex items-center justify-center bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Type
          </Link>
        </div>

        {/* SEARCH AREA */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <Search placeholder="Search categories..." />
          </div>
          {query && (
            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Results for: {query}
            </div>
          )}
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden shadow-indigo-100/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-24">Ref</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {rows.map((m) => (
                  <tr
                    key={m.MeetingTypeID}
                    className="group hover:bg-indigo-50/30 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <Hash className="w-3 h-3" />
                        <span className="text-xs font-black tracking-widest">{m.MeetingTypeID}</span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-100 rounded-full group-hover:bg-indigo-500 transition-all" />
                        <p className="font-black text-gray-800 text-lg uppercase italic tracking-tight group-hover:translate-x-1 transition-transform">
                          {m.MeetingTypeName}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/meetingtypes/${m.MeetingTypeID}`}
                          className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100 shadow-none hover:shadow-sm"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>

                        <Link
                          href={`/meetingtypes/edit/${m.MeetingTypeID}`}
                          className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-green-100 shadow-none hover:shadow-sm"
                          title="Edit Type"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>

                        <div className="pl-2 border-l border-gray-100">
                           <DeleteButton id={m.MeetingTypeID} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {rows.length === 0 && (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gray-50 mb-6 border border-gray-100 text-gray-200">
                <SearchX className="w-10 h-10" />
              </div>
              <h3 className="text-gray-900 font-black uppercase text-lg tracking-tight">No Categories Found</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 max-w-xs mx-auto leading-relaxed">
                The term <span className="text-indigo-500 italic">"{query}"</span> does not match any meeting types in our database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}