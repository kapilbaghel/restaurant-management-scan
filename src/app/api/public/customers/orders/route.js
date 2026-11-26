
import { createHash } from "crypto";
import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import CustomerAccount from "@/models/CustomerAccount";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await connectDB();

    // Read global customer session cookie
    const sessionToken = request.cookies.get("customer_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view your order history.",
        },
        { status: 401 }
      );
    }

    // Hash session token
    const sessionTokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    // Authenticate customer account
    const customer = await CustomerAccount.findOne({
      sessionTokenHash,
      sessionExpiresAt: { $gt: new Date() },
      status: "Active",
    }).select("+sessionTokenHash");

    if (!customer) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Your session has expired. Please login again.",
        },
        { status: 401 }
      );

      response.cookies.set("customer_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });

      return response;
    }

    // Fetch orders across all restaurants for this customer
    const orders = await Order.find({
      customerAccountId: customer._id,
    })
      .select(
        "orderNumber restaurantId tableId items totalAmount status paymentStatus createdAt"
      )
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      message: "Order history fetched successfully.",
      orders,
    });

  } catch (error) {
    console.error("Customer Order History Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch order history.",
      },
      { status: 500 }
    );
  }
}
