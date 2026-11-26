import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const payload = await verifyAdminToken(token);

    if (!payload || !payload.adminId) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired session." },
        { status: 401 }
      );
    }

    await connectDB();

    const admin = await Admin.findOne({
      _id: payload.adminId,
      status: "Active",
    }).select("_id name email role");

    if (!admin || admin.role !== "Super Admin") {
      return NextResponse.json(
        { success: false, message: "Admin access denied." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin verification error:", error);

    return NextResponse.json(
      { success: false, message: "Session verification failed." },
      { status: 500 }
    );
  }
}