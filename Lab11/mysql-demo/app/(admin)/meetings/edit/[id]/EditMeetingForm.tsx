"use client";

import { useState } from "react";
import { UpdateMeetingAction } from "@/app/(admin)/actions/MeetingActions/EditMeetingAction";
import { UploadButton } from "../../add/uploadthing";

export default function EditMeetingForm({ meeting, meetingTypes }: any) {
  const [pdfUrl, setPdfUrl] = useState(meeting.DocumentPath); // Pre-fill with existing URL

  // Helper to bind the ID to our action
  const updateMeetingWithId = UpdateMeetingAction.bind(null, meeting.id);

  return (
    <form action={updateMeetingWithId} className="space-y-6">
      <input type="datetime-local" name="MeetingDate" defaultValue={meeting.MeetingDate.toISOString().slice(0, 16)} />
      
      <select name="MeetingTypeID" defaultValue={meeting.MeetingTypeID}>
        {meetingTypes?.map((type: any) => (
          <option key={type.MeetingTypeID} value={type.MeetingTypeID}>{type.MeetingTypeName}</option>
        ))}
      </select>

      <input type="text" name="MeetingDescription" defaultValue={meeting.MeetingDescription || ""} />

      {/* UploadThing */}
      <UploadButton
        endpoint="pdfUploader"
        onClientUploadComplete={(res) => { if (res?.[0]) setPdfUrl(res[0].ufsUrl); }}
      />
      <input type="hidden" name="DocumentPath" value={pdfUrl} />

      <button type="submit">Update Meeting</button>
    </form>
  );
}