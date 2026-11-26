
import { NextResponse } from "next/server";
import { createHash } from "crypto";

import connectDB from "@/lib/mongodb";
import CustomerAccount from "@/models/CustomerAccount";

export async function GET(request) {
  try {
    await connectDB();

    const sessionToken = request.cookies.get("customer_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    const sessionTokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const customer = await CustomerAccount.findOne({
      sessionTokenHash,
      sessionExpiresAt: { $gt: new Date() },
      status: "Active",
    }).select("+sessionTokenHash");

    if (!customer) {
      const response = NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );

      response.cookies.set("customer_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
    });
  } catch (error) {
    console.error("Customer Session Error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to check customer session." },
      { status: 500 }
    );
  }
}
