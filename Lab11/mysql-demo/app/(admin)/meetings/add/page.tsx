"use client";

import React, { useState } from "react";
import { UploadButton } from "./uploadthing";
import { AddMeetingAction } from "../../actions/MeetingActions/AddMeetingAction";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Calendar, Tag, AlignLeft, Paperclip, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { ClientUploadedFileData } from "uploadthing/types";

interface Props {
  meetingTypes: { MeetingTypeID: number; MeetingTypeName: string }[];
}

export default function AddMeetingForm({ meetingTypes }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Schedule Meeting</h2>
          <p className="text-gray-500 mt-2">Fill in the details below to create a new meeting record.</p>
        </div>

        <form action={AddMeetingAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meeting Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="MeetingDate"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Meeting Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                Meeting Type
              </label>
              <select
                name="MeetingTypeID"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all appearance-none"
                required
              >
                <option value="">Select Type</option>
                {meetingTypes.map((type) => (
                  <option key={type.MeetingTypeID} value={type.MeetingTypeID}>
                    {type.MeetingTypeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Meeting Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-blue-500" />
              Meeting Description
            </label>
            <input
              type="text"
              name="MeetingDescription"
              placeholder="What is this meeting about?"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* UploadThing Section */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-blue-500" />
              Attachment (PDF only)
            </label>
            <div className={`p-4 border-2 border-dashed rounded-xl transition-all ${pdfUrl ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <UploadButton
                endpoint="pdfUploader"
                onUploadBegin={() => setIsUploading(true)}
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setPdfUrl(res[0].url);
                    setIsUploading(false);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload Error: ${error.message}`);
                  setIsUploading(false);
                }}
                appearance={{
                  button: "bg-blue-600 after:bg-blue-700 focus-within:ring-blue-600 text-sm font-bold px-6",
                  allowedContent: "text-xs text-gray-400"
                }}
              />
              {pdfUrl && (
                <div className="mt-2 flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold font-sans">Ready to save!</span>
                </div>
              )}
            </div>
            
            {/* Hidden field to send the URL to the server action */}
            <input type="hidden" name="DocumentPath" value={pdfUrl} />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                isUploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}