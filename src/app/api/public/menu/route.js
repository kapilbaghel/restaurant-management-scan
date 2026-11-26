
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import Table from "@/models/Table";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const restaurantId = searchParams.get("restaurantId");
    const tableId = searchParams.get("tableId");

    if (!restaurantId || !tableId) {
      return NextResponse.json(
        { success: false, message: "Restaurant ID and Table ID are required." },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(restaurantId) ||
      !mongoose.Types.ObjectId.isValid(tableId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid Restaurant ID or Table ID." },
        { status: 400 }
      );
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      status: "Active",
   }).select("name image address city ownerId");

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found or inactive." },
        { status: 404 }
      );
    }

    const table = await Table.findOne({
      _id: tableId,
      restaurantId: restaurantId,
    }).select("tableNumber capacity");

    if (!table) {
      return NextResponse.json(
        { success: false, message: "Invalid table for this restaurant." },
        { status: 404 }
      );
    }

    const categories = await Category.find({
      restaurantIds: restaurantId,
      ownerId: restaurant.ownerId,
      status: "Active",
    })
      .sort({ sortOrder: 1, name: 1 })
     .select("name description image sortOrder");

    const menuItems = await MenuItem.find({
      restaurantIds: restaurantId,
      ownerId: restaurant.ownerId,
      categoryId: { $in: categories.map((category) => category._id) },
    })
      .select("name description price image foodType categoryId isRecommended branchAvailability variants")
      .lean();

    const availableMenuItems = menuItems.filter((item) => {
      const branch = item.branchAvailability?.find(
        (entry) => String(entry.restaurantId) === String(restaurantId)
      );

      return branch ? branch.isAvailable : true;
    });

const formattedCategories = categories.map((category) => ({
  _id: category._id,
  name: category.name,
  description: category.description,
  image: category.image || "",
  sortOrder: category.sortOrder,
  items: availableMenuItems.filter(
    (item) => String(item.categoryId) === String(category._id)
  ),
}));

    return NextResponse.json({
      success: true,
      restaurant,
      table,
      categories: formattedCategories,
    });
  } catch (error) {
    console.error("Public Menu API Error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load menu." },
      { status: 500 }
    );
  }
}
