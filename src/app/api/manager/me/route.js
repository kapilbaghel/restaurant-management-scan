
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Manager from "@/models/Manager";
import Restaurant from "@/models/Restaurant";
import { verifyManagerToken } from "@/lib/managerAuth";

export async function GET() {
  try {
    await connectDB();

    // Read manager session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("manager_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to continue.",
        },
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = await verifyManagerToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    // Verify manager from database
    const manager = await Manager.findOne({
      _id: payload.managerId,
      ownerId: payload.ownerId,
      status: "Active",
    }).select("-passwordHash -documents");

    if (!manager || !manager.restaurantId) {
      return NextResponse.json(
        {
          success: false,
          message: "Manager account is inactive or has no assigned restaurant.",
        },
        { status: 403 }
      );
    }

    // Verify assigned restaurant
    const restaurant = await Restaurant.findOne({
      _id: manager.restaurantId,
      ownerId: manager.ownerId,
      status: "Active",
    }).select("name address city phone");

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          message: "Assigned restaurant is unavailable or inactive.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
      },
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        phone: restaurant.phone,
      },
    });
  } catch (error) {
    console.error("Manager Session Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify manager session.",
      },
      { status: 500 }
    );
  }
}
