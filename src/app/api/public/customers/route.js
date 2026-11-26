
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Restaurant from "@/models/Restaurant";

export async function POST(request) {
  try {
    await connectDB();

    const {
      restaurantId,
      name,
      mobile,
      email,
    } = await request.json();

    // Validate restaurant ID
    if (
      !restaurantId ||
      !mongoose.Types.ObjectId.isValid(restaurantId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid restaurant ID is required.",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name?.trim() || !mobile?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and mobile number are required.",
        },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanMobile = mobile.trim();
    const cleanEmail = email?.trim().toLowerCase() || "";

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 10-digit mobile number.",
        },
        { status: 400 }
      );
    }

    if (
      cleanEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // Check restaurant
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      status: "Active",
    });

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant not found or inactive.",
        },
        { status: 404 }
      );
    }

    // Find existing customer by restaurant and mobile
    let customer = await Customer.findOne({
      restaurantId: restaurant._id,
      mobile: cleanMobile,
    });

    if (customer) {
      // Blocked customer check
      if (customer.status === "Blocked") {
        return NextResponse.json(
          {
            success: false,
            message: "You cannot place an order at this restaurant.",
          },
          { status: 403 }
        );
      }

      // Update existing customer details
      customer.name = cleanName;
      customer.email = cleanEmail;

      await customer.save();
    } else {
      // Create new customer
      customer = await Customer.create({
        ownerId: restaurant.ownerId,
        restaurantId: restaurant._id,
        name: cleanName,
        mobile: cleanMobile,
        email: cleanEmail,
      });
    }

    // Generate secure customer session
    const sessionToken = randomBytes(32).toString("hex");

    const sessionTokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    // Session validity: 30 days
    const sessionExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    customer.sessionTokenHash = sessionTokenHash;
    customer.sessionExpiresAt = sessionExpiresAt;

    await customer.save();

    const response = NextResponse.json({
      success: true,
      message: "Customer identified successfully.",
      customer: {
        _id: customer._id,
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email || "",
      },
    });

    // Save session in browser cookie
    response.cookies.set(
      `customer_session_${restaurantId}`,
      sessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: sessionExpiresAt,
      }
    );

    return response;

  } catch (error) {
    console.error("Customer API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save customer details.",
      },
      { status: 500 }
    );
  }
}
