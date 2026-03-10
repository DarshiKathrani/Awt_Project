import { prisma } from "@/lib/prisma";
import React from "react";
import Link from "next/link";
// import ExportReport from "../ui/ExportReport";

export default async function AdminDashboard() {
  // Fetching stats concurrently for performance
  const [
    staffCount, meetingCount, typeCount, cancelledMeetings,
    totalMemberRecords, presentMemberRecords
  ] = await Promise.all([
    prisma.staff.count(),
    prisma.meetings.count(),
    prisma.meetingtype.count(),
    prisma.meetings.count({ where: { IsCancelled: true } }),
    prisma.meetingmember.count(),
    prisma.meetingmember.count({ where: { IsPresent: true } }),
  ]);

  const attendanceRate = totalMemberRecords > 0 
    ? Math.round((presentMemberRecords / totalMemberRecords) * 100) 
    : 0;


  const recentMeetings = await prisma.meetings.findMany({
    take: 5,
    orderBy: { Created: 'desc' },
    include: { meetingtype: true }
  });


  const reportData = recentMeetings.map(m => ({
    ID: m.MeetingID,
    Date: m.MeetingDate.toLocaleDateString(),
    Type: m.meetingtype.MeetingTypeName,
    Description: m.MeetingDescription,
    Status: m.IsCancelled ? "Cancelled" : "Active"
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of system activity and attendance.</p>
        </div>
        {/* <ExportReport data={reportData} fileName="Admin_Recent_Meetings" /> */}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard title="Staff" value={staffCount} color="blue" />
        <StatCard title="Meetings" value={meetingCount} color="indigo" />
        <StatCard title="Attendance" value={`${attendanceRate}%`} color="green" />
        <StatCard title="Types" value={typeCount} color="purple" />
        <StatCard title="Cancelled" value={cancelledMeetings} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold">Recent Activity</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="p-4">Meeting</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMeetings.map((m) => (
                <tr key={m.MeetingID} className="border-b hover:bg-gray-50">
                  <td className="p-4">{m.MeetingDescription}</td>
                  <td className="p-4">{m.meetingtype.MeetingTypeName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      m.IsCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {m.IsCancelled ? 'Cancelled' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link href="/staffs/add" className="p-2 bg-blue-50 text-blue-700 rounded text-center font-medium">Add Staff</Link>
            <Link href="/meetings/add" className="p-2 bg-green-50 text-green-700 rounded text-center font-medium">Add Meeting</Link>
            <Link href="/meetingtypes/add" className="p-2 bg-purple-50 text-purple-700 rounded text-center font-medium">Add Type</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
  const colors: any = { blue: "text-blue-600", indigo: "text-indigo-600", green: "text-green-600", purple: "text-purple-600", red: "text-red-600" };
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p className="text-xs font-bold text-gray-400 uppercase">{title}</p>
      <p className={`text-2xl font-black ${colors[color]}`}>{value}</p>
    </div>
  );
}