
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import { verifyOwnerToken } from "@/lib/ownerAuth";

// Verify logged-in owner
async function getLoggedInOwner() {
  const cookieStore = await cookies();
  const token = cookieStore.get("owner_session")?.value;

  if (!token) {
    return { error: "Unauthorized. Owner login required.", status: 401 };
  }

  const payload = await verifyOwnerToken(token);

  if (
    !payload?.ownerId ||
    !mongoose.Types.ObjectId.isValid(payload.ownerId)
  ) {
    return { error: "Invalid owner session.", status: 401 };
  }

  const owner = await Owner.findOne({
    _id: payload.ownerId,
    status: "Active",
  }).select("_id");

  if (!owner) {
    return { error: "Owner not found or account inactive.", status: 403 };
  }

  return { owner };
}

// GET Categories
export async function GET(request) {
  try {
    await connectDB();

    const auth = await getLoggedInOwner();

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    const filter = {
      ownerId: auth.owner._id,
    };

    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return NextResponse.json(
          { message: "Invalid restaurant ID." },
          { status: 400 }
        );
      }

      const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        ownerId: auth.owner._id,
      });

      if (!restaurant) {
        return NextResponse.json(
          { message: "Restaurant not found or access denied." },
          { status: 404 }
        );
      }

      filter.restaurantIds = restaurant._id;
    }

    const categories = await Category.find(filter)
      .populate("restaurantIds", "name city state")
      .sort({ sortOrder: 1, createdAt: 1 });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET Categories Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch categories." },
      { status: 500 }
    );
  }
}

// POST Create Category
export async function POST(request) {
  try {
    await connectDB();

    const auth = await getLoggedInOwner();

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();

   const { name, description, image, restaurantIds } = body;

    if (
      !name?.trim() ||
      !Array.isArray(restaurantIds) ||
      restaurantIds.length === 0
    ) {
      return NextResponse.json(
        { message: "Category name and at least one branch are required." },
        { status: 400 }
      );
    }

    const uniqueIds = [...new Set(restaurantIds.map(String))];

    if (!uniqueIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return NextResponse.json(
        { message: "Invalid branch selected." },
        { status: 400 }
      );
    }

    const restaurants = await Restaurant.find({
      _id: { $in: uniqueIds },
      ownerId: auth.owner._id,
    }).select("_id");

    if (restaurants.length !== uniqueIds.length) {
      return NextResponse.json(
        { message: "One or more selected branches are invalid or not owned by you." },
        { status: 403 }
      );
    }

const category = await Category.create({
  name: name.trim(),
  description: description?.trim() || "",
  image: image?.trim() || "",
  ownerId: auth.owner._id,
  restaurantIds: restaurants.map((restaurant) => restaurant._id),
});

    return NextResponse.json(
      {
        message: "Category created successfully.",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Category already exists." },
        { status: 409 }
      );
    }

    console.error("POST Categories Error:", error);

    return NextResponse.json(
      { message: "Failed to create category." },
      { status: 500 }
    );
  }
}
