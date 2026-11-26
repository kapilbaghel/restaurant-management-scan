
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";

import Admin from "@/models/Admin";
import Restaurant from "@/models/Restaurant";
import Counter from "@/models/Counter";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  const payload = await verifyAdminToken(token);

  if (!payload?.adminId || payload.role !== "Super Admin") {
    return null;
  }

  await connectDB();

  return await Admin.findOne({
    _id: payload.adminId,
    status: "Active",
    role: "Super Admin",
  }).select("_id");
}

export async function POST() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin login required." },
        { status: 401 }
      );
    }

    await connectDB();

    const existingCounter = await Counter.findById("restaurant");

    const highestRestaurant = await Restaurant.findOne({
      restaurantCode: { $regex: /^RES-\d{6}$/ },
    })
      .sort({ restaurantCode: -1 })
      .select("restaurantCode")
      .lean();

    const highestNumber = highestRestaurant
      ? Number(highestRestaurant.restaurantCode.replace("RES-", ""))
      : 0;

    let currentSequence = Math.max(
      existingCounter?.sequence || 0,
      highestNumber
    );

    const restaurants = await Restaurant.find({
      $or: [
        { restaurantCode: { $exists: false } },
        { restaurantCode: "" },
        { restaurantCode: null },
      ],
    }).sort({ createdAt: 1 });

    const updatedRestaurants = [];

    for (const restaurant of restaurants) {
      currentSequence += 1;

const restaurantCode = `RES-${String(
  currentSequence
).padStart(6, "0")}`;

await Restaurant.updateOne(
  { _id: restaurant._id },
  {
    $set: {
      restaurantCode: restaurantCode,
    },
  }
);

const savedRestaurant = await Restaurant.findById(
  restaurant._id
).select("name restaurantCode").lean();

console.log("SAVED RESTAURANT:", savedRestaurant);

updatedRestaurants.push({
  name: savedRestaurant?.name,
  restaurantCode: savedRestaurant?.restaurantCode || "",
});
    }

    await Counter.findByIdAndUpdate(
      "restaurant",
      { $max: { sequence: currentSequence } },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `${updatedRestaurants.length} restaurants updated successfully.`,
      updatedRestaurants,
    });
  } catch (error) {
    console.error("Restaurant ID backfill error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate Restaurant IDs.",
      },
      { status: 500 }
    );
  }
}
