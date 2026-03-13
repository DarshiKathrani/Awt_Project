import { prisma } from "@/lib/prisma";
import { meetings } from "@prisma/client";
export const dynamic = "force-dynamic";
export default async function GetById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.meetingmember.findFirst({
    where: {
      MeetingMemberID: Number(id),
    },
    include:{
        meetings:true,
        staff:true
}

  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold text-red-600">
          Meeting Member not found
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Meeting Member Details
        </h1>
        <p>
            <span className="font-semibold">Meetings:</span>{" "}
            {product?.staff.StaffName}
          </p>
        <p>
            <span className="font-semibold">Meetings:</span>{" "}
            {product?.meetings.MeetingDescription}
          </p>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Remarks:</span>{" "}
            {product.Remarks ?? "No remarks provided"}
          </p>

          <p>
            <span className="font-semibold">Attendance:</span>{" "}
            <span className={product.IsPresent ? "text-green-600" : "text-red-600"}>
              {product.IsPresent ? "Present" : "Absent"}
            </span>
          </p>

          <p>
            <span className="font-semibold">Created On:</span>{" "}
            {product.Created
              ? product.Created.toLocaleString()
              : "Not available"}
          </p>
          <p>
            <span className="font-semibold">Last Modified On:</span>{" "}
            {product.Modified
              ? product.Modified.toLocaleString()
              : "Not available"}
          </p>
          
        </div>

        <div className="mt-6">
          <a
            href="/meetingmembers"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            ← Back to Meeting Members
          </a>
        </div>
      </div>
    </div>
  );
}
