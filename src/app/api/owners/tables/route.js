import QRCode from "qrcode";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Restaurant from "@/models/Restaurant";
import Table from "@/models/Table";
import { verifyOwnerToken } from "@/lib/ownerAuth";

export async function POST(request) {
  try {
    // Verify Owner session
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Owner login required." },
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

    // Verify active Owner
    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    }).select("_id");

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Owner not found or account inactive." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { restaurantId, tableNumber, capacity } = body;

    if (
      !mongoose.Types.ObjectId.isValid(restaurantId) ||
      !tableNumber?.trim() ||
      !Number.isInteger(Number(capacity)) ||
      Number(capacity) < 1
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide valid table details." },
        { status: 400 }
      );
    }

    // Verify branch belongs to logged-in Owner
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

const table = await Table.create({
  tableNumber: tableNumber.trim(),
  capacity: Number(capacity),
  ownerId: owner._id,
  restaurantId: restaurant._id,
});

// Generate QR Code URL
const menuUrl = new URL("/menu", request.url);

menuUrl.searchParams.set("restaurantId", String(restaurant._id));
menuUrl.searchParams.set("tableId", String(table._id));

// Generate and save QR Code
console.log("QR URL:", menuUrl.toString());

const generatedQR = await QRCode.toDataURL(menuUrl.toString());

console.log("QR Generated:", generatedQR ? "Yes" : "No");

table.qrCode = generatedQR;

await table.save();

console.log("QR Saved:", table.qrCode ? "Yes" : "No");

    return NextResponse.json(
      {
        success: true,
        message: "Table created successfully.",
        table,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Table Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "This table number already exists in this branch.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create table." },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    // Verify Owner session
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Owner login required." },
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

    // Verify active Owner
    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    }).select("_id");

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Owner not found or account inactive." },
        { status: 403 }
      );
    }

    // Get selected branch ID from URL
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return NextResponse.json(
        { success: false, message: "Invalid branch ID." },
        { status: 400 }
      );
    }

    // Verify branch belongs to Owner
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

    // Fetch tables of selected branch only
    const tables = await Table.find({
      ownerId: owner._id,
      restaurantId: restaurant._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tables,
    });

  } catch (error) {
    console.error("Fetch Tables Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch tables." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
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
    const { tableId, restaurantId, tableNumber, capacity } = body;

    if (
      !mongoose.Types.ObjectId.isValid(tableId) ||
      !mongoose.Types.ObjectId.isValid(restaurantId) ||
      !tableNumber?.trim() ||
      !Number.isInteger(Number(capacity)) ||
      Number(capacity) < 1
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide valid table details." },
        { status: 400 }
      );
    }

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

    const table = await Table.findOneAndUpdate(
      {
        _id: tableId,
        ownerId: owner._id,
        restaurantId: restaurant._id,
      },
      {
        tableNumber: tableNumber.trim(),
        capacity: Number(capacity),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!table) {
      return NextResponse.json(
        { success: false, message: "Table not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Table updated successfully.",
      table,
    });

  } catch (error) {
    console.error("Update Table Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "This table number already exists in this branch.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update table." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
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
    const { tableId, restaurantId } = body;

    if (
      !mongoose.Types.ObjectId.isValid(tableId) ||
      !mongoose.Types.ObjectId.isValid(restaurantId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid table or branch ID." },
        { status: 400 }
      );
    }

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

    const table = await Table.findOneAndDelete({
      _id: tableId,
      ownerId: owner._id,
      restaurantId: restaurant._id,
    });

    if (!table) {
      return NextResponse.json(
        { success: false, message: "Table not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Table deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Table Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete table." },
      { status: 500 }
    );
  }
}
