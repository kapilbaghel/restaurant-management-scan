
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import QRCode from "qrcode";

import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Restaurant from "@/models/Restaurant";
import Table from "@/models/Table";
import { verifyOwnerToken } from "@/lib/ownerAuth";

export async function POST(request) {
  try {
    // Verify owner session
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (
      !payload?.ownerId ||
      !mongoose.Types.ObjectId.isValid(payload.ownerId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid owner session." },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify active owner
    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    }).select("_id");

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Owner not found or inactive." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { restaurantId } = body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return NextResponse.json(
        { success: false, message: "Invalid branch ID." },
        { status: 400 }
      );
    }

    // Verify branch ownership
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId: owner._id,
    }).select("_id");

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Branch not found or access denied." },
        { status: 403 }
      );
    }

    // Find tables that do not have QR codes
    const tables = await Table.find({
      ownerId: owner._id,
      restaurantId: restaurant._id,
      $or: [
        { qrCode: "" },
        { qrCode: { $exists: false } },
        { qrCode: null },
      ],
    });

    let generatedCount = 0;

    // Generate QR for each existing table
    for (const table of tables) {
      const menuUrl = new URL("/menu", request.url);

      menuUrl.searchParams.set(
        "restaurantId",
        String(restaurant._id)
      );

      menuUrl.searchParams.set(
        "tableId",
        String(table._id)
      );

      table.qrCode = await QRCode.toDataURL(menuUrl.toString());

      await table.save();

      generatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `${generatedCount} QR codes generated successfully.`,
      generatedCount,
    });

  } catch (error) {
    console.error("Generate QR Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate QR codes." },
      { status: 500 }
    );
  }
}
