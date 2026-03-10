import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteStaff from "@/app/ui/DeleteStaff";
import SearchStaff from "@/app/ui/Search"; // Import our new component
import { staff } from "@prisma/client";
import { UserPlus, Mail, Phone, Eye, Edit2 } from "lucide-react";

export default async function GetAll({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  // Await the searchParams in Next.js 15+
  const params = await searchParams;
  const query = params?.query || "";

  // Prisma Search Logic
  const rows = await prisma.staff.findMany({
    where: {
      OR: [
        { StaffName: { contains: query} },
        { EmailAddress: { contains: query} },
        // If StaffID is a number, Prisma requires specific casting or skipping
      ],
    },
    orderBy: { StaffName: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
              Staff <span className="text-blue-600">Directory</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
              Governance & Personnel Management
            </p>
          </div>

          <Link
            href="/staffs/add"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm shadow-blue-200 active:scale-95 text-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Staff
          </Link>
        </div>

        {/* SEARCH BAR SECTION */}
        <div className="flex items-center gap-4">
          <SearchStaff />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Member</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {rows.map((s: staff) => (
                  <tr key={s.StaffID} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-black mr-4 border border-gray-200 group-hover:bg-white transition-colors">
                          {s.StaffName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">{s.StaffName}</div>
                          <div className="text-[10px] text-gray-400 font-bold">ID: #00{s.StaffID}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <Mail className="w-3 h-3 text-blue-400" /> {s.EmailAddress || "—"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 uppercase font-bold tracking-tighter">
                          <Phone className="w-3 h-3 text-gray-300" /> {s.MobileNo || "N/A"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/staffs/${s.StaffID}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-blue-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/staffs/edit/${s.StaffID}`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-green-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <DeleteStaff id={s.StaffID} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State / No Results */}
          {rows.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-4 border border-gray-100">
                <SearchStaff /> {/* This icon is actually fine inside the circle too */}
              </div>
              <h3 className="text-gray-900 font-black uppercase tracking-tight">No records found</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
                Try adjusting your search for "{query}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}