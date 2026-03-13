import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    return JSON.parse(payloadJson) as { user_id: number; email: string; role: string };
  } catch { return null; }
}

export default async function StaffDashboard() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/");

  const staff = await prisma.staff.findUnique({
    where: { user_id: user.user_id },
    include: {
      meetingmember: {
        include: { meetings: { include: { meetingtype: true } } },
        orderBy: { meetings: { MeetingDate: 'desc' } }
      }
    }
  });

  if (!staff) return <div className="p-20 text-center font-bold text-slate-400">Profile Not Linked</div>;

  const totalMeetings = staff.meetingmember.length;
  const attendedCount = staff.meetingmember.filter(m => m.IsPresent).length;
  const attendanceRate = totalMeetings > 0 ? Math.round((attendedCount / totalMeetings) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Staff Portal</h1>
          <p className="text-gray-500 text-sm font-medium">Welcome back, {staff.StaffName}.</p>
        </div>
      </div>

      {/* KPI Cards - Matching Admin Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Records" value={totalMeetings} color="blue" />
        <StatCard title="Attended" value={attendedCount} color="indigo" />
        <StatCard title="Compliance" value={`${attendanceRate}%`} color="green" />
        <StatCard title="Status" value={attendanceRate >= 75 ? "Good" : "Review"} color={attendanceRate >= 75 ? "purple" : "red"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Table - Matching Admin Design */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-sm text-gray-700 uppercase tracking-wider">Attendance History</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50">
              <tr className="border-b">
                <th className="p-4">Meeting</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.meetingmember.map((m) => (
                <tr key={m.MeetingMemberID} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{m.meetings.MeetingDescription}</td>
                  <td className="p-4 text-gray-500">{new Date(m.meetings.MeetingDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${m.IsPresent ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                      {m.IsPresent ? 'PRESENT' : 'ABSENT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold mb-4 text-sm uppercase text-gray-600">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/profile" className="p-2 bg-gray-50 text-gray-700 rounded text-center font-medium hover:bg-gray-100 transition-colors">View Profile</Link>
            <a href="mailto:admin@system.com" className="p-2 bg-indigo-50 text-indigo-700 rounded text-center font-medium hover:bg-indigo-100 transition-colors">Contact Admin</a>
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
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <p className={`text-2xl font-black ${colors[color]}`}>{value}</p>
    </div>
  );
}