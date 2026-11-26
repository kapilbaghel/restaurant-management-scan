
import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

import connectDB from "@/lib/mongodb";
import CustomerOtp from "@/models/CustomerOtp";
import CustomerAccount from "@/models/CustomerAccount";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 6-digit OTP." },
        { status: 400 }
      );
    }

    const otpRecord = await CustomerOtp.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP not found. Please request a new OTP." },
        { status: 404 }
      );
    }

    if (otpRecord.expiresAt <= new Date()) {
      await CustomerOtp.deleteOne({ _id: otpRecord._id });

      return NextResponse.json(
        { success: false, message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (otpRecord.attempts >= 5) {
      await CustomerOtp.deleteOne({ _id: otpRecord._id });

      return NextResponse.json(
        { success: false, message: "Too many incorrect attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    const submittedHash = createHash("sha256")
      .update(otp)
      .digest("hex");

    if (submittedHash !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return NextResponse.json(
        {
          success: false,
          message: "Incorrect OTP. Please try again.",
          attemptsRemaining: 5 - otpRecord.attempts,
        },
        { status: 400 }
      );
    }

    let customer = await CustomerAccount.findOne({ email });

    if (!customer) {
      if (!otpRecord.pendingName || !otpRecord.pendingMobile) {
        return NextResponse.json(
          {
            success: false,
            message: "Registration details missing. Please request a new OTP.",
          },
          { status: 400 }
        );
      }

      customer = await CustomerAccount.create({
        name: otpRecord.pendingName,
        email,
        mobile: otpRecord.pendingMobile,
        status: "Active",
      });
    }

    if (customer.status !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is blocked. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Generate secure session token
    const sessionToken = randomBytes(32).toString("hex");

    // Hash token before storing in database
    const sessionTokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    // Session expires after 30 days
    const sessionExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    // Save session in CustomerAccount
    customer.sessionTokenHash = sessionTokenHash;
    customer.sessionExpiresAt = sessionExpiresAt;

    await customer.save();

    // Delete OTP after successful login
    await CustomerOtp.deleteOne({ _id: otpRecord._id });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
    });

    // Secure HTTP-only cookie
    response.cookies.set("customer_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: sessionExpiresAt,
    });

    return response;
  } catch (error) {
    console.error("Customer Verify OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify OTP. Please try again.",
      },
      { status: 500 }
    );
  }
}
