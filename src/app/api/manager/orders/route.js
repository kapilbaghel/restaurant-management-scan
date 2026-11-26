
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
    });

    if (!manager || !manager.restaurantId) {
      return NextResponse.json(
        { success: false, message: "Manager or restaurant not found" },
        { status: 403 }
      );
    }

    // 3. Verify assigned restaurant
    const restaurant = await Restaurant.findOne({
      _id: manager.restaurantId,
      ownerId: manager.ownerId,
      status: "Active",
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Assigned restaurant is inactive" },
        { status: 403 }
      );
    }

    // 4. Fetch restaurant orders
    const orders = await Order.find({
      ownerId: manager.ownerId,
      restaurantId: restaurant._id,
    })
      .populate("tableId", "tableNumber")
      .sort({ createdAt: -1 })
      .lean();

    // 5. Format response
    const formattedOrders = orders.map((order) => ({
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      tableNumber: order.tableId?.tableNumber || "N/A",
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
    });

  } catch (error) {
    console.error("Manager Orders API Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
