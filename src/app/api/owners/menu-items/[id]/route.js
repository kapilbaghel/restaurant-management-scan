
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { verifyOwnerToken } from "@/lib/ownerAuth";

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

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const auth = await getLoggedInOwner();

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const body = await request.json();

const {
  name,
  description,
  restaurantIds,
  categoryId,
  foodType,
  price,
  variants = [],
  image,
  isRecommended,
} = body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !name?.trim() ||
      !Array.isArray(restaurantIds) ||
      restaurantIds.length === 0 ||
      !mongoose.Types.ObjectId.isValid(categoryId) ||
      !foodType ||
      price === undefined ||
      price === ""
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields and select at least one branch." },
        { status: 400 }
      );
    }

    if (!["Veg", "Non-Veg", "Egg"].includes(foodType)) {
      return NextResponse.json(
        { message: "Invalid food type." },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { message: "Please enter a valid price." },
        { status: 400 }
      );
    }

    if (!Array.isArray(variants)) {
  return NextResponse.json(
    { message: "Invalid menu item variants." },
    { status: 400 }
  );
}

const validatedVariants = variants.map((variant) => ({
  size: variant.size?.trim(),
  quantity: variant.quantity?.trim(),
  price: Number(variant.price),
}));

if (
  validatedVariants.some(
    (variant) =>
      !variant.size ||
      !variant.quantity ||
      !Number.isFinite(variant.price) ||
      variant.price < 0
  )
) {
  return NextResponse.json(
    {
      message:
        "Please enter valid size, quantity and price for every variant.",
    },
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

    // Verify that every selected branch belongs to this owner
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

    // Verify category belongs to owner and is assigned to every selected branch
    const category = await Category.findOne({
      _id: categoryId,
      ownerId: auth.owner._id,
    });

    if (!category) {
      return NextResponse.json(
        { message: "Invalid category." },
        { status: 400 }
      );
    }

    const categoryBranchIds = category.restaurantIds.map((branchId) =>
      branchId.toString()
    );

    const categoryAvailableForAllBranches = uniqueIds.every((branchId) =>
      categoryBranchIds.includes(branchId)
    );

    if (!categoryAvailableForAllBranches) {
      return NextResponse.json(
        {
          message: "Please assign this category to all selected branches first.",
        },
        { status: 400 }
      );
    }

// Find existing menu item
const existingMenuItem = await MenuItem.findOne({
  _id: id,
  ownerId: auth.owner._id,
});

if (!existingMenuItem) {
  return NextResponse.json(
    { message: "Menu item not found or access denied." },
    { status: 404 }
  );
}

// Preserve existing branch availability
const existingAvailability = existingMenuItem.branchAvailability || [];

const updatedBranchAvailability = restaurants.map((restaurant) => {
  const existingBranch = existingAvailability.find(
    (branch) =>
      String(branch.restaurantId) === String(restaurant._id)
  );

  return {
    restaurantId: restaurant._id,
    isAvailable: existingBranch
      ? existingBranch.isAvailable
      : true,
  };
});


// Update only this owner's menu item
const menuItem = await MenuItem.findOneAndUpdate(
  {
    _id: id,
    ownerId: auth.owner._id,
  },
  {
    name: name.trim(),
    description: description?.trim() || "",
    restaurantIds: restaurants.map((restaurant) => restaurant._id),
    branchAvailability: updatedBranchAvailability,
categoryId,
foodType,
price: numericPrice,
variants: validatedVariants,
image: image || "",
    isRecommended: Boolean(isRecommended),
  },
  { new: true, runValidators: true }
)
  .populate("categoryId", "name")
  .populate("restaurantIds", "name city state");

    if (!menuItem) {
      return NextResponse.json(
        { message: "Menu item not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Menu item updated successfully.",
        menuItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Menu Item Error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating menu item." },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const auth = await getLoggedInOwner();

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid menu item ID." },
        { status: 400 }
      );
    }

    const deletedItem = await MenuItem.findOneAndDelete({
      _id: id,
      ownerId: auth.owner._id,
    });

    if (!deletedItem) {
      return NextResponse.json(
        { message: "Menu item not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Menu item deleted successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete Menu Item Error:", error);

    return NextResponse.json(
      { message: "Something went wrong while deleting menu item." },
      { status: 500 }
    );
  }
}


