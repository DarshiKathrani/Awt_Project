import React from 'react'
import { prisma } from "@/lib/prisma";
import EditMeetingTypeAction from '@/app/(admin)/actions/MeetingTypeActions/EditMeetingTypeAction';
import Link from 'next/link';
export const dynamic = "force-dynamic";
async function EditUser({params}:{params:Promise<{id:string}>}) {
    const {id} = await params;
    const data = await prisma.meetingtype.findFirst({
        where:{
            MeetingTypeID:Number(id)
        }
    })

    if (!data) return <div className="p-10 text-center font-bold">Category not found</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 relative">
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
                
                {/* Header Section */}
                <div className="mb-8">
                    <Link 
                        href="/meetingtypes" 
                        className="text-xs font-bold text-indigo-600 flex items-center gap-1 group mb-4 uppercase tracking-wider"
                    >
                        <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                        Cancel Edits
                    </Link>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Edit Category
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">
                        Updating details for: <span className="text-indigo-600">"{data.MeetingTypeName}"</span>
                    </p>
                </div>

                <form action={EditMeetingTypeAction} className="space-y-6">
                    {/* Hidden ID Field */}
                    <input type='hidden' name='MeetingTypeID' value={data.MeetingTypeID}/>

                    {/* Meeting Type Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Meeting Type Name
                        </label>
                        <input
                            type="text"
                            name="MeetingTypeName"
                            required
                            defaultValue={data.MeetingTypeName}
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-700"
                        />
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Remarks
                        </label>
                        <textarea
                            name="Remarks"
                            defaultValue={data.Remarks ?? ""}
                            rows={3}
                            placeholder="Add notes about this category..."
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-700 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-slate-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Update Category Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUser