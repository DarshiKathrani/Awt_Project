import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function GetById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.staff.findFirst({
    where: {
      StaffID: Number(id),
    },
    // Include meeting count to make the detail page more informative
    include: {
      _count: {
        select: { meetingmember: true }
      }
    }
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Staff Member Not Found</h2>
          <p className="text-gray-500 mt-2">The person you are looking for doesn't exist or has been removed.</p>
          <Link href="/staffs" className="mt-4 inline-block text-blue-600 hover:underline font-medium">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <nav className="mb-6">
          <Link href="/staffs" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Staff List
          </Link>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Cover/Header Section */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar and Primary Title */}
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-md">
                <div className="h-full w-full rounded-xl bg-gray-100 flex items-center justify-center text-3xl font-black text-blue-600 border border-gray-100">
                  {product.StaffName.charAt(0)}
                </div>
              </div>
              <Link 
                href={`/staffs/edit/${product.StaffID}`}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm"
              >
                Edit Profile
              </Link>
            </div>

            <div>
              <h1 className="text-3xl font-black text-gray-900">{product.StaffName}</h1>
              <p className="text-gray-500 font-medium">Internal Staff Member • ID #{product.StaffID}</p>
            </div>

            <hr className="my-8 border-gray-100" />

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact Details</h3>
                
                <DetailItem 
                  label="Email Address" 
                  value={product.EmailAddress} 
                  icon={<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />} 
                />
                
                <DetailItem 
                  label="Mobile Number" 
                  value={product.MobileNo} 
                  icon={<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />} 
                />
              </div>

              {/* System Info & Stats */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">System Information</h3>
                
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                   <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">Total Participation</p>
                   <p className="text-2xl font-black text-blue-700">{product._count.meetingmember} <span className="text-sm font-medium">Meetings</span></p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Account Created</span>
                    <span className="text-gray-900 font-medium">{product.Created?.toLocaleDateString()}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Last Updated</span>
                    <span className="text-gray-900 font-medium">{product.Modified?.toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Remarks</h3>
              <p className="text-gray-700 leading-relaxed italic">
                "{product.Remarks || "No specific remarks found for this staff member."}"
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for clean detail rows
function DetailItem({ label, value, icon }: { label: string; value: string | null; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
        <p className="text-gray-900 font-semibold">{value || "Not Provided"}</p>
      </div>
    </div>
  );
}