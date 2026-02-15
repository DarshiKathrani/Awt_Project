import { prisma } from "@/lib/prisma";
import EditMeetingAction from "@/app/actions/EditMeetingAction";

async function EditUser({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
    select: {
      MeetingID: true,
      MeetingDate: true,
      MeetingTypeID: true,
      MeetingDescription: true,
      IsCancelled: true,
      CancellationDateTime: true,
      CancellationReason: true,
      DocumentPath: true,
    },
  });

  const meetingTypes = await prisma.meetingtype.findMany();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      {/* Soft background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Meeting Details
          </h2>
          <p className="text-slate-400 text-sm mt-1">Modify the schedule or status of Meeting ID: #{data?.MeetingID}</p>
        </div>

        <form action={EditMeetingAction} className="p-8 space-y-6">
          <input type="hidden" name="MeetingID" value={data?.MeetingID} />
          <input type="hidden" name="ExistingDocumentPath" defaultValue={data?.DocumentPath ?? ""} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meeting Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Meeting Schedule</label>
              <input
                type="datetime-local"
                name="MeetingDate"
                defaultValue={
                  data?.MeetingDate
                    ? new Date(data.MeetingDate.getTime() - data.MeetingDate.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Meeting Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
              <select
                name="MeetingTypeID"
                defaultValue={data?.MeetingTypeID}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
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

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Agenda / Description</label>
            <input
              type="text"
              name="MeetingDescription"
              defaultValue={data?.MeetingDescription ?? ""}
              placeholder="Brief description of the meeting"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <hr className="border-slate-100" />

          {/* Cancellation Section */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Meeting Status
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Is Cancelled?</span>
                <input
                  type="checkbox"
                  name="IsCancelled"
                  defaultChecked={data?.IsCancelled ?? false}
                  id="isCancelled"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                name="CancellationDateTime"
                id="cancelDate"
                placeholder="Cancellation Time"
                defaultValue={
                  data?.CancellationDateTime
                    ? new Date(data.CancellationDateTime.getTime() - data.CancellationDateTime.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                disabled={!data?.IsCancelled}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50 transition-all outline-none"
              />
              <textarea
                name="CancellationReason"
                id="cancelReason"
                rows={1}
                placeholder="Reason for cancellation..."
                defaultValue={data?.CancellationReason ?? ""}
                disabled={!data?.IsCancelled}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50 transition-all outline-none"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Documents</label>
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">Current File</p>
                <p className="text-sm text-slate-600 truncate">
                  {data?.DocumentPath ? data.DocumentPath.split('_').slice(1).join('_') : "No document attached"}
                </p>
              </div>
              <label className="cursor-pointer bg-white px-4 py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                Replace
                <input type="file" name="DocumentPath" className="hidden" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
             <a href="/meetings" className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 text-center rounded-xl font-bold hover:bg-slate-200 transition-all">
               Cancel
             </a>
             <button className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all">
               Save Changes
             </button>
          </div>

          {/* INLINE JS */}
         {/* INLINE JS (FIXED) */}
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const chk = document.getElementById("isCancelled");
        const date = document.getElementById("cancelDate");
        const reason = document.getElementById("cancelReason");

        function updateState() {
          const isChecked = chk.checked;
          date.disabled = !isChecked;
          reason.disabled = !isChecked;
          
          if(isChecked) {
            date.classList.remove('opacity-50', 'bg-slate-50');
            reason.classList.remove('opacity-50', 'bg-slate-50');
          } else {
            date.classList.add('opacity-50', 'bg-slate-50');
            reason.classList.add('opacity-50', 'bg-slate-50');
          }
        }

        // Run on load
        updateState();

        // Run on change
        chk.addEventListener("change", updateState);
      })();
    `,
  }}
/>
        </form>
      </div>
    </div>
  );
}

export default EditUser;