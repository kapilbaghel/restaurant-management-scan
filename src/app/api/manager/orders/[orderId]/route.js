
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifyManagerToken } from "@/lib/managerAuth";

import Manager from "@/models/Manager";
import Restaurant from "@/models/Restaurant";
import Order from "@/models/Order";

const allowedTransitions = {
  Pending: ["Accepted", "Cancelled"],
  Accepted: ["Preparing", "Cancelled"],
  Preparing: ["Ready"],
  Ready: ["Served"],
  Served: [],
  Cancelled: [],
};

export async function PATCH(request, { params }) {
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

    // 4. Get order ID and requested status
    const { orderId } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = [
      "Pending",
      "Accepted",
      "Preparing",
      "Ready",
      "Served",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    // 5. Find order belonging to this restaurant
    const order = await Order.findOne({
      _id: orderId,
      ownerId: manager.ownerId,
      restaurantId: restaurant._id,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // 6. Validate status transition
    if (!allowedTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot change order status from ${order.status} to ${status}`,
        },
        { status: 400 }
      );
    }

    // 7. Update order
    order.status = status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: {
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
