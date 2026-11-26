import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Manager from "@/models/Manager";
import Restaurant from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import { createManagerToken } from "@/lib/managerAuth";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const manager = await Manager.findOne({
      email: normalizedEmail,
    });

    if (!manager || !manager.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (manager.status !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "Your manager account is inactive.",
        },
        { status: 403 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      manager.passwordHash
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (!manager.restaurantId) {
      return NextResponse.json(
        {
          success: false,
          message: "No restaurant is assigned to your account. Please contact the owner.",
        },
        { status: 403 }
      );
    }

    const restaurant = await Restaurant.findOne({
      _id: manager.restaurantId,
      ownerId: manager.ownerId,
      status: "Active",
    });

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          message: "Your assigned restaurant is unavailable or inactive.",
        },
        { status: 403 }
      );
    }

    const token = await createManagerToken(manager);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        restaurantId: manager.restaurantId,
      },
    });

    response.cookies.set("manager_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Manager Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during login.",
      },
      { status: 500 }
    );
  }
}