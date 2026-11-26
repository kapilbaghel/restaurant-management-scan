import MenuItem from "@/models/MenuItem";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import { verifyOwnerToken } from "@/lib/ownerAuth";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Verify owner session
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Owner login required." },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (
      !payload?.ownerId ||
      !mongoose.Types.ObjectId.isValid(payload.ownerId)
    ) {
      return NextResponse.json(
        { message: "Invalid owner session." },
        { status: 401 }
      );
    }

    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    }).select("_id");

    if (!owner) {
      return NextResponse.json(
        { message: "Owner not found or account inactive." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

const { name, description, image, restaurantIds } = body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !name?.trim() ||
      !Array.isArray(restaurantIds) ||
      restaurantIds.length === 0
    ) {
      return NextResponse.json(
        { message: "Category name and at least one valid branch are required." },
        { status: 400 }
      );
    }

    const uniqueIds = [...new Set(restaurantIds.map(String))];

    if (!uniqueIds.every((branchId) =>
      mongoose.Types.ObjectId.isValid(branchId)
    )) {
      return NextResponse.json(
        { message: "Invalid branch selected." },
        { status: 400 }
      );
    }

    const restaurants = await Restaurant.find({
      _id: { $in: uniqueIds },
      ownerId: owner._id,
    }).select("_id");

    if (restaurants.length !== uniqueIds.length) {
      return NextResponse.json(
        { message: "One or more selected branches are invalid or not owned by you." },
        { status: 403 }
      );
    }


// Find current category
const currentCategory = await Category.findOne({
  _id: id,
  ownerId: owner._id,
});

if (!currentCategory) {
  return NextResponse.json(
    { message: "Category not found." },
    { status: 404 }
  );
}

// Find branches being removed from this category
const removedBranchIds = currentCategory.restaurantIds
  .map((branchId) => branchId.toString())
  .filter((branchId) => !uniqueIds.includes(branchId));

// Check whether menu items are assigned to removed branches
if (removedBranchIds.length > 0) {
  const existingMenuItem = await MenuItem.findOne({
    ownerId: owner._id,
    categoryId: id,
    restaurantIds: { $in: removedBranchIds },
  }).select("_id");

  if (existingMenuItem) {
    return NextResponse.json(
      {
        message:
          "Cannot remove this branch because menu items are assigned to it. Please update menu item assignments first.",
      },
      { status: 400 }
    );
  }
}



    const category = await Category.findOneAndUpdate(
      {
        _id: id,
        ownerId: owner._id,
      },
{
  name: name.trim(),
  description: description?.trim() || "",
  image: image?.trim() || "",
  restaurantIds: restaurants.map((restaurant) => restaurant._id),
},
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Category already exists." },
        { status: 409 }
      );
    }

    console.error("PUT Category Error:", error);

    return NextResponse.json(
      { message: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Owner login required." },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (
      !payload?.ownerId ||
      !mongoose.Types.ObjectId.isValid(payload.ownerId)
    ) {
      return NextResponse.json(
        { message: "Invalid owner session." },
        { status: 401 }
      );
    }

    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    }).select("_id");

    if (!owner) {
      return NextResponse.json(
        { message: "Owner not found or account inactive." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid category ID." },
        { status: 400 }
      );
    }

    const category = await Category.findOne({
      _id: id,
      ownerId: owner._id,
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    const existingMenuItem = await MenuItem.findOne({
      ownerId: owner._id,
      categoryId: category._id,
    }).select("_id");

    if (existingMenuItem) {
      return NextResponse.json(
        {
          message:
            "Cannot delete this category because menu items are assigned to it. Please update or remove those menu items first.",
        },
        { status: 400 }
      );
    }

    await Category.deleteOne({
      _id: category._id,
      ownerId: owner._id,
    });

    return NextResponse.json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE Category Error:", error);

    return NextResponse.json(
      { message: "Failed to delete category." },
      { status: 500 }
    );
  }
}
