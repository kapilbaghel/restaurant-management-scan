
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import Restaurant from "@/models/Restaurant";
import Owner from "@/models/Owner";
import { cookies } from "next/headers";
import { verifyOwnerToken } from "@/lib/ownerAuth";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (!payload?.ownerId) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const owner = await Owner.findById(payload.ownerId);

    if (!owner || owner.status !== "Active") {
      return NextResponse.json(
        { message: "Owner not found or inactive." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { restaurantId, isAvailable } = await request.json();

    if (
      !restaurantId ||
      typeof isAvailable !== "boolean"
    ) {
      return NextResponse.json(
        { message: "Branch and availability status are required." },
        { status: 400 }
      );
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId: owner._id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { message: "Branch not found or access denied." },
        { status: 404 }
      );
    }

    const menuItem = await MenuItem.findOne({
      _id: id,
      ownerId: owner._id,
      restaurantIds: restaurant._id,
    });

    if (!menuItem) {
      return NextResponse.json(
        { message: "Menu item is not assigned to this branch." },
        { status: 404 }
      );
    }

// Initialize availability array if it doesn't exist
menuItem.branchAvailability = menuItem.branchAvailability || [];

    const existingBranch = menuItem.branchAvailability.find(
      (branch) =>
        String(branch.restaurantId) === String(restaurant._id)
    );

    if (existingBranch) {
      existingBranch.isAvailable = isAvailable;
    } else {
      menuItem.branchAvailability.push({
        restaurantId: restaurant._id,
        isAvailable,
      });
    }

    await menuItem.save();

    return NextResponse.json({
      message: "Branch availability updated successfully.",
      restaurantId: String(restaurant._id),
      isAvailable,
    });
  } catch (error) {
    console.error("Branch Availability Update Error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating availability." },
      { status: 500 }
    );
  }
}
