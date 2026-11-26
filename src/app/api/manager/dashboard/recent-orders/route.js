
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifyManagerToken } from "@/lib/managerAuth";

import Manager from "@/models/Manager";
import Restaurant from "@/models/Restaurant";
import Order from "@/models/Order";
import Table from "@/models/Table";

export async function GET() {
  try {
    await connectDB();

    // Verify manager session
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

    // Verify active manager
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

    // Verify assigned restaurant
    const restaurant = await Restaurant.findOne({
      _id: manager.restaurantId,
      ownerId: manager.ownerId,
      status: "Active",
    }).select("_id");

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 403 }
      );
    }

    // Fetch latest 5 orders
    const orders = await Order.find({
      ownerId: manager.ownerId,
      restaurantId: restaurant._id,
    })
      .populate("tableId", "tableNumber")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentOrders = orders.map((order) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      tableNumber: order.tableId?.tableNumber || "N/A",
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({
      success: true,
      orders: recentOrders,
    });

  } catch (error) {
    console.error("Recent Orders API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch recent orders",
      },
      { status: 500 }
    );
  }
}
