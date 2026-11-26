
import { NextResponse } from "next/server";
import { createHash } from "crypto";

import connectDB from "@/lib/mongodb";
import CustomerAccount from "@/models/CustomerAccount";

export async function POST(request) {
  try {
    await connectDB();

    const sessionToken = request.cookies.get("customer_session")?.value;

    if (sessionToken) {
      const sessionTokenHash = createHash("sha256")
        .update(sessionToken)
        .digest("hex");

      await CustomerAccount.updateOne(
        { sessionTokenHash },
        {
          $set: {
            sessionTokenHash: "",
            sessionExpiresAt: null,
          },
        }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set("customer_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Customer Logout Error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to logout. Please try again." },
      { status: 500 }
    );
  }
}
