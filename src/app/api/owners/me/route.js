
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import { cookies } from "next/headers";
import { verifyOwnerToken } from "@/lib/ownerAuth";
import { Types } from "mongoose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Owner login required.",
        },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (!payload?.ownerId || !Types.ObjectId.isValid(payload.ownerId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid owner session.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    }).select(
      "-passwordHash -invitationTokenHash -invitationExpiresAt"
    );

    if (!owner) {
      return Response.json(
        {
          success: false,
          message: "Owner not found or account inactive.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      owner: {
        id: owner._id.toString(),
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
        city: owner.city,
        state: owner.state,
        pincode: owner.pincode,
        status: owner.status,
        pan: owner.pan,
        aadhaar: owner.aadhaar,
        panDocument: owner.panDocument,
        aadhaarDocument: owner.aadhaarDocument,
      },
    });

  } catch (error) {
    console.error("Fetch owner error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to fetch owner details.",
      },
      { status: 500 }
    );
  }
}
