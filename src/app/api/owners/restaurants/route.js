
import Manager from "@/models/Manager";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Restaurant from "@/models/Restaurant";
import { verifyOwnerToken } from "@/lib/ownerAuth";
export async function POST(request) {
  try {
    // Verify Owner session
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Owner login required.",
        },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (
      !payload?.ownerId ||
      !mongoose.Types.ObjectId.isValid(payload.ownerId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid owner session.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Find logged-in Owner
    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    });

    if (!owner) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner not found or account inactive.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      gstNumber,
      phone,
      email,
      address,
      location,
      city,
      state,
      pincode,
      status,
      managerId,
      image,
    } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant name is required.",
        },
        { status: 400 }
      );
    }



// VALIDATE SELECTED MANAGER
if (managerId) {
  if (!mongoose.Types.ObjectId.isValid(managerId)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid manager selected.",
      },
      { status: 400 }
    );
  }

  const manager = await Manager.findOne({
    _id: managerId,
    ownerId: owner._id,
    restaurantId: null,
  });

  if (!manager) {
    return NextResponse.json(
      {
        success: false,
        message: "Manager is already assigned or not available.",
      },
      { status: 409 }
    );
  }
}

    // Escape special regex characters
    const escapedName = name.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    // Find same-name restaurants belonging to this Owner
    const sameNameRestaurants = await Restaurant.find({
      ownerId: owner._id,
      name: {
        $regex: `^${escapedName}$`,
        $options: "i",
      },
    }).sort({ createdAt: 1 });

    const mainBranch = sameNameRestaurants.find(
      (restaurant) => restaurant.branchType === "main"
    );

    const branchType =
      sameNameRestaurants.length === 0 ? "main" : "sub";

    const parentRestaurantId =
      branchType === "main"
        ? null
        : mainBranch?._id || sameNameRestaurants[0]._id;


        // Generate restaurant folder slug
const baseSlug = name
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

// Reuse the main restaurant slug for its branches
const slug =
  mainBranch?.slug ||
  sameNameRestaurants[0]?.slug ||
  baseSlug;
        

    // Create Restaurant under logged-in Owner only
const restaurant = await Restaurant.create({
  name: name.trim(),
  slug,
  gst: gstNumber || "",
  phone: phone || "",
  email: email?.trim().toLowerCase() || "",
  address: address || "",
  location: location || "",
  city: city || "",
  state: state || "",
  pincode: pincode || "",
  status: status || "Active",
  ownerId: owner._id,
  managerId: managerId || null,
  branchType,
  parentRestaurantId,
  image: image || "",
});



// ASSIGN MANAGER TO RESTAURANT
if (managerId) {
  const assignedManager = await Manager.findOneAndUpdate(
    {
      _id: managerId,
      ownerId: owner._id,
      restaurantId: null,
    },
    {
      $set: { restaurantId: restaurant._id },
    },
    {
      new: true,
    }
  );

  // If manager was assigned elsewhere in the meantime
  if (!assignedManager) {
    await Restaurant.findByIdAndDelete(restaurant._id);

    return NextResponse.json(
      {
        success: false,
        message: "Manager is already assigned to another restaurant.",
      },
      { status: 409 }
    );
  }
}



    return NextResponse.json(
      {
        success: true,
        message: "Restaurant created successfully.",
        restaurant: {
          id: restaurant._id.toString(),
          name: restaurant.name,
          ownerId: restaurant.ownerId.toString(),
          branchType: restaurant.branchType,
          parentRestaurantId:
            restaurant.parentRestaurantId?.toString() || null,
          gstNumber: restaurant.gst,
          phone: restaurant.phone,
          email: restaurant.email,
          location: restaurant.location,
          managerId: restaurant.managerId,
          address: restaurant.address,
          city: restaurant.city,
          state: restaurant.state,
          pincode: restaurant.pincode,
          status: restaurant.status,
          image: restaurant.image,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create owner restaurant error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create restaurant.",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    // Verify Owner session
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Owner login required.",
        },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (
      !payload?.ownerId ||
      !mongoose.Types.ObjectId.isValid(payload.ownerId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid owner session.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify active Owner
const owner = await Owner.findOne({
  _id: payload.ownerId,
  status: "Active",
}).select("_id ownerCode");

    if (!owner) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner not found or account inactive.",
        },
        { status: 403 }
      );
    }

const allRestaurants = await Restaurant.find({})
  .select("name ownerId")
  .lean();

  
    // Fetch only logged-in Owner's restaurants
    const restaurants = await Restaurant.find({
      ownerId: owner._id,
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
     restaurants: restaurants.map((restaurant) => ({
  id: restaurant._id.toString(),
    restaurantCode: restaurant.restaurantCode || "",
  name: restaurant.name,
  ownerId: restaurant.ownerId.toString(),
  ownerCode: owner.ownerCode || "",
  branchType: restaurant.branchType,
  parentRestaurantId:
    restaurant.parentRestaurantId?.toString() || null,
  gstNumber: restaurant.gst || "",
  phone: restaurant.phone || "",
  email: restaurant.email || "",
  location: restaurant.location || "",
  managerId: restaurant.managerId?.toString() || "",
  address: restaurant.address || "",
  city: restaurant.city || "",
  state: restaurant.state || "",
  pincode: restaurant.pincode || "",
  status: restaurant.status,
image:
  restaurant.name?.trim().toLowerCase() === "traditional taste"
    ? "/restaurants/traditional-taste/hero.jpg"
    : restaurant.name?.trim().toLowerCase() === "spice route"
    ? "/restaurants/spice-route/hero.jpg"
    : restaurant.image || "",
})),
    });

  } catch (error) {
    console.error("Fetch owner restaurants error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch restaurants.",
      },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    // Verify Owner session
    const cookieStore = await cookies();
    const token = cookieStore.get("owner_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Owner login required." },
        { status: 401 }
      );
    }

    const payload = await verifyOwnerToken(token);

    if (
      !payload?.ownerId ||
      !mongoose.Types.ObjectId.isValid(payload.ownerId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid owner session." },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify active Owner
    const owner = await Owner.findOne({
      _id: payload.ownerId,
      status: "Active",
    }).select("_id");

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Owner not found or account inactive." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { restaurantId, restaurant } = body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return NextResponse.json(
        { success: false, message: "Invalid restaurant ID." },
        { status: 400 }
      );
    }

    if (!restaurant || !restaurant.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Restaurant name is required." },
        { status: 400 }
      );
    }


// FIND EXISTING RESTAURANT
const existingRestaurant = await Restaurant.findOne({
  _id: restaurantId,
  ownerId: owner._id,
});

if (!existingRestaurant) {
  return NextResponse.json(
    {
      success: false,
      message: "Restaurant not found.",
    },
    { status: 404 }
  );
}

// VALIDATE NEW MANAGER
const newManagerId = restaurant.managerId || null;

if (newManagerId) {
  if (!mongoose.Types.ObjectId.isValid(newManagerId)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid manager selected.",
      },
      { status: 400 }
    );
  }

  const manager = await Manager.findOne({
    _id: newManagerId,
    ownerId: owner._id,
    $or: [
      { restaurantId: null },
      { restaurantId: existingRestaurant._id },
    ],
  });

  if (!manager) {
    return NextResponse.json(
      {
        success: false,
        message: "Manager is already assigned to another restaurant.",
      },
      { status: 409 }
    );
  }
}


    // Update only allowed fields
    const updateData = {
      name: restaurant.name.trim(),
      gst: restaurant.gstNumber || "",
      phone: restaurant.phone || "",
      email: restaurant.email?.trim().toLowerCase() || "",
      address: restaurant.address || "",
      location: restaurant.location || "",
      city: restaurant.city || "",
      state: restaurant.state || "",
      pincode: restaurant.pincode || "",
      status: restaurant.status || "Active",
      managerId: restaurant.managerId || null,
      image: restaurant.image || "",
    };

    // Owner can update only their own restaurant
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      {
        _id: restaurantId,
        ownerId: owner._id,
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant not found or you do not have permission to edit it.",
        },
        { status: 404 }
      );
    }


    // UPDATE MANAGER ASSIGNMENT
const oldManagerId = existingRestaurant.managerId
  ? String(existingRestaurant.managerId)
  : null;

const selectedManagerId = newManagerId
  ? String(newManagerId)
  : null;

if (oldManagerId !== selectedManagerId) {
  // Assign new manager first
  if (selectedManagerId) {
    const assignedManager = await Manager.findOneAndUpdate(
      {
        _id: selectedManagerId,
        ownerId: owner._id,
        $or: [
          { restaurantId: null },
          { restaurantId: existingRestaurant._id },
        ],
      },
      {
        $set: { restaurantId: updatedRestaurant._id },
      },
      { new: true }
    );

    if (!assignedManager) {
      // Restore previous manager selection
      await Restaurant.updateOne(
        { _id: updatedRestaurant._id },
        { $set: { managerId: existingRestaurant.managerId || null } }
      );

      return NextResponse.json(
        {
          success: false,
          message: "Manager is already assigned to another restaurant.",
        },
        { status: 409 }
      );
    }
  }

  // Release previous manager
  if (oldManagerId) {
    await Manager.updateOne(
      {
        _id: oldManagerId,
        ownerId: owner._id,
        restaurantId: existingRestaurant._id,
      },
      {
        $set: { restaurantId: null },
      }
    );
  }
}


    return NextResponse.json({
      success: true,
      message: "Restaurant updated successfully.",
      restaurant: {
        id: updatedRestaurant._id.toString(),
        name: updatedRestaurant.name,
        ownerId: updatedRestaurant.ownerId.toString(),
        branchType: updatedRestaurant.branchType,
        parentRestaurantId:
          updatedRestaurant.parentRestaurantId?.toString() || null,
        gstNumber: updatedRestaurant.gst || "",
        phone: updatedRestaurant.phone || "",
        email: updatedRestaurant.email || "",
        location: updatedRestaurant.location || "",
        managerId: updatedRestaurant.managerId?.toString() || "",
        address: updatedRestaurant.address || "",
        city: updatedRestaurant.city || "",
        state: updatedRestaurant.state || "",
        pincode: updatedRestaurant.pincode || "",
        status: updatedRestaurant.status,
        image: updatedRestaurant.image || "",
      },
    });
  } catch (error) {
    console.error("Update owner restaurant error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update restaurant." },
      { status: 500 }
    );
  }
}


