import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Manager from "@/models/Manager";
import Counter from "@/models/Counter";
import { verifyOwnerToken } from "@/lib/ownerAuth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await connectDB();

const cookieStore = await cookies();
const token = cookieStore.get("owner_session")?.value;

if (!token) {
  return NextResponse.json(
    { success: false, message: "Please login first." },
    { status: 401 }
  );
}

const payload = await verifyOwnerToken(token);

if (!payload) {
  return NextResponse.json(
    { success: false, message: "Invalid or expired session." },
    { status: 401 }
  );
}

    const managers = await Manager.find({
      ownerId: payload.ownerId,
      $or: [
        { managerCode: { $exists: false } },
        { managerCode: "" },
        { managerCode: null },
      ],
    }).sort({ createdAt: 1 });

    const updatedManagers = [];

    for (const manager of managers) {
      const counter = await Counter.findByIdAndUpdate(
        "manager",
        { $inc: { sequence: 1 } },
        { new: true, upsert: true }
      );

      const managerCode = `MGR-${String(counter.sequence).padStart(6, "0")}`;

      manager.managerCode = managerCode;
      await manager.save();

      updatedManagers.push({
        name: manager.name,
        managerCode: manager.managerCode,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${updatedManagers.length} managers updated successfully.`,
      managers: updatedManagers,
    });
  } catch (error) {
    console.error("Manager ID backfill error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to generate Manager IDs." },
      { status: 500 }
    );
  }
}