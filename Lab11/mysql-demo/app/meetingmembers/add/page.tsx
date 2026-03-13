import { AddMeetingMemberAction } from "@/app/(admin)/actions/MeetingMemberActions/AddMeetingMemberAction";
import React from "react";
import { prisma } from "@/lib/prisma";

async function AddUser() {
    const m = await prisma.meetings.findMany({
         select: {
            MeetingID: true,
            MeetingDescription: true,
    },
    })

    const s = await prisma.staff.findMany({
         select: {
            StaffID: true,
            StaffName: true,
    },
    })
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Meeting Member
        </h2>

        <form action={AddMeetingMemberAction} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff
            </label>
            <select
          name="StaffID"
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Meeting Member</option>
          {s.map((type) => (
            <option
              key={type.StaffID}
              value={type.StaffID}
            >
              {type.StaffName}
            </option>
          ))}
        </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting
            </label>
            <select
          name="MeetingID"
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Meeting</option>
          {m.map((type) => (
            <option
              key={type.MeetingID}
              value={type.MeetingID}
            >
              {type.MeetingDescription}
            </option>
          ))}
        </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              name="Remarks"
              placeholder="Remarks"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="IsPresent"
            id="IsPresent"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="IsPresent" className="text-sm font-medium text-gray-700">
            Mark as Present 
          </label>
        </div>
          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="
                w-full
                bg-blue-600 text-white
                py-2
                rounded-md
                font-medium
                hover:bg-blue-700
                transition
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            >
              Add Meeting Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
