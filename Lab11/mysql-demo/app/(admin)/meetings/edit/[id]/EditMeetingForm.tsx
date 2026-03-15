"use client";

import { useState } from "react";
import { UpdateMeetingAction } from "@/app/(admin)/actions/MeetingActions/EditMeetingAction";
import { UploadButton } from "../../add/uploadthing";// Adjust path as needed


export default function EditMeetingForm({ meeting, meetingTypes }: any) {
  const [pdfUrl, setPdfUrl] = useState(meeting.DocumentPath);

  // IMPORTANT: Use MeetingID, not 'id'
  const updateMeetingWithId = UpdateMeetingAction.bind(null, meeting.MeetingID);

  return (
    <form action={updateMeetingWithId} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold">Edit Meeting</h2>

      {/* Date Field */}
      <div>
        <label className="block text-sm font-medium">Meeting Date</label>
        <input 
          type="datetime-local" 
          name="MeetingDate" 
          defaultValue={meeting.MeetingDate.toISOString().slice(0, 16)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Type Dropdown */}
      <div>
        <label className="block text-sm font-medium">Meeting Type</label>
        <select name="MeetingTypeID" defaultValue={meeting.MeetingTypeID} className="w-full p-2 border rounded-md">
          {meetingTypes?.map((type: any) => (
            <option key={type.MeetingTypeID} value={type.MeetingTypeID}>{type.MeetingTypeName}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input 
          type="text" 
          name="MeetingDescription" 
          defaultValue={meeting.MeetingDescription || ""} 
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Upload Section - Fixed Container */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
        <p className="mb-2 text-sm text-gray-600">{pdfUrl ? "Document Selected" : "Upload Document"}</p>
        <UploadButton
          endpoint="pdfUploader"
          onClientUploadComplete={(res) => { if (res?.[0]) setPdfUrl(res[0].ufsUrl); }}
        />
      </div>
      <input type="hidden" name="DocumentPath" value={pdfUrl || ""} />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
        Update Meeting
      </button>
    </form>
  );
}