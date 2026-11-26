
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { ownerId } = await params;

    // Validate Owner ID
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Owner ID.",
        },
        { status: 400 }
      );
    }

    // Find and delete Owner
    const deletedOwner = await Owner.findByIdAndDelete(ownerId);

    if (!deletedOwner) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Owner deleted successfully.",
      ownerId: deletedOwner._id.toString(),
    });
  } catch (error) {
    console.error("Delete owner error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete owner.",
      },
      { status: 500 }
    );
  }
}
