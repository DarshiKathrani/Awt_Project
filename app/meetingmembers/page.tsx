import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteMeetingMember from "../ui/DeleteMeetingMember";
import { meetingmember, staff } from "@prisma/client";

export default async function GetAll() {
  const rows = await prisma.meetingmember.findMany(
    {
    include:{
        meetings:true,
        staff:true,
    }
  }
);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Meeting Members
          </h2>

          <Link
            href="/meetingmembers/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add New Meeting Member
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="px-4 py-3">ID</th>
                {/* <th className="px-4 py-3">Meeting Date</th> */}
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Meeting</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((m) => (
                <tr
                  key={m.MeetingMemberID}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{m.MeetingMemberID}</td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {m.staff.StaffName}
                  </td>
                  <td>
                    {m.meetings.MeetingDescription??"No Description"}
                  </td>

                  <td className="px-4 py-3">
                    {m.IsPresent ? (
                      <span className="text-green-600">Present</span>
                    ) : (
                      <span className="text-red-600">Absent</span>
                    )}
                  </td>

                  {/* View */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/meetingmembers/${m.MeetingMemberID}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>

                  {/* Edit */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/meetingmembers/edit/${m.MeetingMemberID}`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3">
                    <DeleteMeetingMember id={m.MeetingMemberID} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No staff member found.
          </p>
        )}
      </div>
    </div>
  );
}