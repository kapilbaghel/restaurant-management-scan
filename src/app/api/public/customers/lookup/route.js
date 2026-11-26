import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Restaurant from "@/models/Restaurant";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const restaurantId = searchParams.get("restaurantId");
    const mobile = searchParams.get("mobile");

    if (!restaurantId || !mobile) {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant ID and mobile number are required.",
        },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid mobile number.",
        },
        { status: 400 }
      );
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant || restaurant.status !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant not found or inactive.",
        },
        { status: 404 }
      );
    }

    const customer = await Customer.findOne({
      restaurantId,
      mobile,
    }).select("name status");

    if (!customer) {
      return NextResponse.json({
        success: true,
        exists: false,
      });
    }

    if (customer.status === "Blocked") {
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          message: "You cannot place an order at this restaurant.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      exists: true,
      customer: {
        name: customer.name,
      },
    });
  } catch (error) {
    console.error("Customer Lookup Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to find customer.",
      },
      { status: 500 }
    );
  }
}