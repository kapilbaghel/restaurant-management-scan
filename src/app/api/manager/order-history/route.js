
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifyManagerToken } from "@/lib/managerAuth";

import Manager from "@/models/Manager";
import Restaurant from "@/models/Restaurant";
import Order from "@/models/Order";
import Table from "@/models/Table";

export async function GET(request) {
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

    // 4. Read filters
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || "All";
    const search = searchParams.get("search")?.trim() || "";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const allowedStatuses = ["All", "Served", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status filter" },
        { status: 400 }
      );
    }

    // 5. Build restaurant-scoped query
    const query = {
      ownerId: manager.ownerId,
      restaurantId: restaurant._id,
      status:
        status === "All"
          ? { $in: ["Served", "Cancelled"] }
          : status,
    };

    // 6. Date filtering
    if (from || to) {
      query.createdAt = {};

      if (from) {
        const fromDate = new Date(`${from}T00:00:00.000`);
        if (Number.isNaN(fromDate.getTime())) {
          return NextResponse.json(
            { success: false, message: "Invalid start date" },
            { status: 400 }
          );
        }
        query.createdAt.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(`${to}T23:59:59.999`);
        if (Number.isNaN(toDate.getTime())) {
          return NextResponse.json(
            { success: false, message: "Invalid end date" },
            { status: 400 }
          );
        }
        query.createdAt.$lte = toDate;
      }
    }

    // 7. Fetch orders
    let orders = await Order.find(query)
      .populate("tableId", "tableNumber")
      .sort({ createdAt: -1 })
      .lean();

    // 8. Search by order number or table number
    if (search) {
      const normalizedSearch = search.toLowerCase();

      orders = orders.filter((order) => {
        const orderNumber = String(order.orderNumber || "").toLowerCase();
        const tableNumber = String(
          order.tableId?.tableNumber || ""
        ).toLowerCase();

        return (
          orderNumber.includes(normalizedSearch) ||
          tableNumber.includes(normalizedSearch)
        );
      });
    }

    // 9. Format response
    const formattedOrders = orders.map((order) => ({
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      tableNumber: order.tableId?.tableNumber || "N/A",
      items: order.items || [],
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    // 10. Summary
    const totalOrders = formattedOrders.length;
    const completedOrders = formattedOrders.filter(
      (order) => order.status === "Served"
    ).length;
    const cancelledOrders = formattedOrders.filter(
      (order) => order.status === "Cancelled"
    ).length;
    const paidRevenue = formattedOrders
      .filter((order) => order.status === "Served" && order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      summary: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        paidRevenue,
      },
    });

  } catch (error) {
    console.error("Manager Order History API Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}
