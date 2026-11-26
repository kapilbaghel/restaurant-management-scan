
import { NextResponse } from "next/server";
import { randomInt, createHash } from "crypto";
import nodemailer from "nodemailer";

import connectDB from "@/lib/mongodb";
import CustomerOtp from "@/models/CustomerOtp";
import CustomerAccount from "@/models/CustomerAccount";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const mobile = String(body.mobile || "").trim();

    // Validate email
    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check whether customer already exists
    const existingCustomer = await CustomerAccount.findOne({ email });

    // New customer must provide name and mobile
    if (!existingCustomer) {
      if (!name || !/^[6-9]\d{9}$/.test(mobile)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please enter your name and valid 10-digit mobile number.",
          },
          { status: 400 }
        );
      }
    }

    // Block inactive customers
    if (existingCustomer && existingCustomer.status !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is currently blocked. Please contact the restaurant.",
        },
        { status: 403 }
      );
    }

    const now = new Date();

    // Find previous OTP request
    let otpRecord = await CustomerOtp.findOne({ email });

    // 60-second resend cooldown
    if (
      otpRecord &&
      now.getTime() - new Date(otpRecord.lastSentAt).getTime() < 60000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before requesting another OTP.",
        },
        { status: 429 }
      );
    }

    // Generate a secure 6-digit OTP
    const otp = String(randomInt(100000, 1000000));

    const otpHash = createHash("sha256")
      .update(otp)
      .digest("hex");

    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    if (!otpRecord) {
      otpRecord = new CustomerOtp({ email });
    }

    otpRecord.otpHash = otpHash;
    otpRecord.expiresAt = expiresAt;
    otpRecord.attempts = 0;
    otpRecord.lastSentAt = now;
    otpRecord.verifiedAt = null;

    otpRecord.pendingName = existingCustomer ? "" : name;
    otpRecord.pendingMobile = existingCustomer ? "" : mobile;

    await otpRecord.save();

    // Brevo SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        minVersion: "TLSv1.2",
      },
    });

    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

const emailInfo = await transporter.sendMail({
  from: `"RestaurantOS" <${fromEmail}>`,
  to: email,
  subject: "Your RestaurantOS Login OTP",
  text: `Your verification OTP is ${otp}. It is valid for 10 minutes. Do not share this code with anyone.`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;background:#FCFBF8;border-radius:16px;">
      <h2 style="color:#17392D;">Verify your email</h2>
      <p style="color:#526158;">Use the following OTP to continue with your RestaurantOS account.</p>
      <div style="padding:20px;text-align:center;background:#EDF2EC;border-radius:12px;margin:24px 0;">
        <h1 style="letter-spacing:10px;color:#17392D;margin:0;">${otp}</h1>
      </div>
      <p style="color:#526158;">This OTP expires in <strong>10 minutes</strong>.</p>
      <p style="font-size:12px;color:#929990;">Please do not share this code with anyone.</p>
      <p style="color:#526158;">RestaurantOS Team</p>
    </div>
  `,
});

console.log("OTP EMAIL DELIVERY RESULT:", {
  accepted: emailInfo.accepted,
  rejected: emailInfo.rejected,
  response: emailInfo.response,
  messageId: emailInfo.messageId,
});

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to your email.",
      expiresIn: 600,
    });
  } catch (error) {
    console.error("Customer Send OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send OTP. Please try again later.",
      },
      { status: 500 }
    );
  }
}
