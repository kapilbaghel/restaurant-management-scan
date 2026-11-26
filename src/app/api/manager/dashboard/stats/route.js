
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifyManagerToken } from "@/lib/managerAuth";

import Manager from "@/models/Manager";
import Restaurant from "@/models/Restaurant";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";

export async function GET() {
  try {
    await connectDB();

    // 1. Verify manager session
    const cookieStore = await cookies();
    const token = cookieStore.get("manager_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyManagerToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    // 2. Verify active manager
    const manager = await Manager.findOne({
      _id: payload.managerId,
      ownerId: payload.ownerId,
      status: "Active",
    }).select("_id ownerId restaurantId");

    if (!manager || !manager.restaurantId) {
      return NextResponse.json(
        { success: false, message: "Manager or branch not found" },
        { status: 403 }
      );
    }

    // 3. Verify assigned active restaurant
    const restaurant = await Restaurant.findOne({
      _id: manager.restaurantId,
      ownerId: manager.ownerId,
      status: "Active",
    }).select("_id");

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Assigned restaurant is unavailable" },
        { status: 403 }
      );
    }

    const ownerId = manager.ownerId;
    const restaurantId = restaurant._id;

    // 4. Calculate today's date in Indian Standard Time
    const now = new Date();

    const istDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const [year, month, day] = istDate.split("-").map(Number);

    const startOfDay = new Date(
      Date.UTC(year, month - 1, day) - 330 * 60 * 1000
    );

    const endOfDay = new Date(
      startOfDay.getTime() + 24 * 60 * 60 * 1000
    );

    // 5. Fetch dashboard statistics
    const [
      todayOrders,
      pendingOrders,
      revenueResult,
      totalMenuItems,
    ] = await Promise.all([
      Order.countDocuments({
        ownerId,
        restaurantId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      }),

      Order.countDocuments({
        ownerId,
        restaurantId,
        status: "Pending",
      }),

      Order.aggregate([
        {
          $match: {
            ownerId,
            restaurantId,
            paymentStatus: "Paid",
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),

      MenuItem.countDocuments({
        ownerId,
        restaurantIds: restaurantId,
        branchAvailability: {
          $elemMatch: {
            restaurantId,
            isAvailable: true,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        todayOrders,
        todayRevenue: revenueResult[0]?.totalRevenue || 0,
        pendingOrders,
        totalMenuItems,
      },
    });
  } catch (error) {
    console.error("Manager Dashboard Stats Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch dashboard statistics",
      },
      { status: 500 }
    );
  }
}
