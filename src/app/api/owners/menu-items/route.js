
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

// GET Menu Items
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

const menuItems = await MenuItem.find(filter);

for (const item of menuItems) {
  if (!item.branchAvailability || item.branchAvailability.length === 0) {
    item.branchAvailability = item.restaurantIds.map((restaurantId) => ({
      restaurantId,
      isAvailable: item.isAvailable ?? true,
    }));

    await item.save();
  }
}

await MenuItem.populate(menuItems, [
  { path: "categoryId", select: "name" },
  { path: "restaurantIds", select: "name city state" },
]);

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error("GET Menu Items Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch menu items." },
      { status: 500 }
    );
  }
}

// POST Create Menu Item
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
      !name?.trim() ||
      !Array.isArray(restaurantIds) ||
      restaurantIds.length === 0 ||
      !categoryId ||
      !foodType ||
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields and select at least one branch." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category selected." },
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
    { message: "Please enter valid size, quantity and price for every variant." },
    { status: 400 }
  );
}


    if (!["Veg", "Non-Veg", "Egg"].includes(foodType)) {
      return NextResponse.json(
        { message: "Invalid food type." },
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

const category = await Category.findOne({
  _id: categoryId,
  ownerId: auth.owner._id,
});

if (!category) {
  return NextResponse.json(
    { message: "Invalid category selected." },
    { status: 400 }
  );
}

const categoryBranchIds = category.restaurantIds.map((id) =>
  id.toString()
);

const allBranchesAssignedToCategory = uniqueIds.every((id) =>
  categoryBranchIds.includes(id.toString())
);

if (!allBranchesAssignedToCategory) {
  return NextResponse.json(
    {
      message: "Selected category is not assigned to all selected branches.",
    },
    { status: 400 }
  );
}

    if (!category) {
      return NextResponse.json(
        { message: "Category not found or not assigned to the selected branches." },
        { status: 404 }
      );
    }

    const menuItem = await MenuItem.create({
      name: name.trim(),
      description: description?.trim() || "",
      ownerId: auth.owner._id,
      restaurantIds: restaurants.map((restaurant) => restaurant._id),
      categoryId,
      foodType,
      price: numericPrice,
      variants: validatedVariants,
      image: image || "",
    branchAvailability: restaurants.map((restaurant) => ({
  restaurantId: restaurant._id,
  isAvailable: true,
})),
      isRecommended: isRecommended ?? false,
    });

    return NextResponse.json(
      {
        message: "Menu item created successfully.",
        menuItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Menu Items Error:", error);

    return NextResponse.json(
      { message: "Failed to create menu item." },
      { status: 500 }
    );
  }
}
