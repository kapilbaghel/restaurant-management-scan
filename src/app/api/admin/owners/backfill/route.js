
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

import Admin from "@/models/Admin";
import Owner from "@/models/Owner";
import Counter from "@/models/Counter";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  const payload = await verifyAdminToken(token);

  if (!payload?.adminId || payload.role !== "Super Admin") {
    return null;
  }

  await connectDB();

  return await Admin.findOne({
    _id: payload.adminId,
    status: "Active",
    role: "Super Admin",
  }).select("_id");
}

export async function POST() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin login required." },
        { status: 401 }
      );
    }

    await connectDB();

    // Get current counter and highest existing Owner ID
    const existingCounter = await Counter.findById("owner");

    const highestOwner = await Owner.findOne({
      ownerCode: { $regex: /^OWN-\d{6}$/ },
    })
      .sort({ ownerCode: -1 })
      .select("ownerCode")
      .lean();

    const highestExistingNumber = highestOwner
      ? Number(highestOwner.ownerCode.replace("OWN-", ""))
      : 0;

    let currentSequence = Math.max(
      existingCounter?.sequence || 0,
      highestExistingNumber
    );

    // Find owners without Owner IDs
    const owners = await Owner.find({
      $or: [
        { ownerCode: { $exists: false } },
        { ownerCode: "" },
        { ownerCode: null },
      ],
    }).sort({ createdAt: 1 });

    const updatedOwners = [];

    for (const owner of owners) {
      currentSequence += 1;

      owner.ownerCode = `OWN-${String(currentSequence).padStart(6, "0")}`;

      await owner.save();

      updatedOwners.push({
        name: owner.name,
        ownerCode: owner.ownerCode,
      });
    }

    // Update counter
    await Counter.findByIdAndUpdate(
      "owner",
      { $max: { sequence: currentSequence } },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `${updatedOwners.length} owners updated successfully.`,
      updatedOwners,
    });
  } catch (error) {
    console.error("Owner ID backfill error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate Owner IDs.",
      },
      { status: 500 }
    );
  }
}
