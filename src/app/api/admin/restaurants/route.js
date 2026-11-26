import Counter from "@/models/Counter";
import { Types } from "mongoose";
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Restaurant from "@/models/Restaurant";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import Admin from "@/models/Admin";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyAdminToken(token);

  if (!payload?.adminId || payload.role !== "Super Admin") {
    return null;
  }

  await connectDB();

  const admin = await Admin.findOne({
    _id: payload.adminId,
    status: "Active",
    role: "Super Admin",
  }).select("_id");

  return admin;
}

export async function POST(request) {
  let createdOwner = null;

  try {
    const admin = await requireAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      restaurant,
      owner,
    } = body;

    // Check required data
    if (!restaurant || !owner) {
      return Response.json(
        {
          success: false,
          message: "Restaurant and owner details are required.",
        },
        { status: 400 }
      );
    }

    const requiredFields = [
      restaurant.name,
      restaurant.gstNumber,
      restaurant.phone,
      restaurant.email,
      restaurant.address,
      restaurant.city,
      restaurant.state,
      restaurant.pincode,
      owner.name,
      owner.phone,
      owner.email,
      owner.address,
      owner.city,
      owner.state,
      owner.pincode,
      owner.pan,
      owner.aadhaar,
    ];

    if (requiredFields.some((field) => !field || !String(field).trim())) {
      return Response.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = owner.email.trim().toLowerCase();

    // Check whether owner email already exists
    const existingOwner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (existingOwner) {
      return Response.json(
        {
          success: false,
          message: "An owner account with this email already exists.",
        },
        { status: 409 }
      );
    }


    // Generate unique Owner ID
const counter = await Counter.findByIdAndUpdate(
  "owner",
  { $inc: { sequence: 1 } },
  { new: true, upsert: true }
);

const ownerCode = `OWN-${String(counter.sequence).padStart(6, "0")}`;

    // Create owner in MongoDB
    createdOwner = await Owner.create({
      ownerCode: ownerCode,
      name: owner.name.trim(),
      email: normalizedEmail,
      phone: owner.phone,
      address: owner.address,
      city: owner.city,
      state: owner.state,
      pincode: owner.pincode,
      pan: owner.pan,
      aadhaar: owner.aadhaar,
      panDocument: owner.panDocument || "",
      aadhaarDocument: owner.aadhaarDocument || "",
      status: "Active",
    });


// Generate unique Restaurant ID
const restaurantCounter = await Counter.findByIdAndUpdate(
  "restaurant",
  { $inc: { sequence: 1 } },
  { new: true, upsert: true }
);

const restaurantCode = `RES-${String(
  restaurantCounter.sequence
).padStart(6, "0")}`;

    // Create restaurant in MongoDB
    const newRestaurant = await Restaurant.create({
      restaurantCode: restaurantCode,
      name: restaurant.name.trim(),
      gst: restaurant.gstNumber,
      phone: restaurant.phone,
      email: restaurant.email.trim().toLowerCase(),
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      pincode: restaurant.pincode,
      status: restaurant.status || "Active",
      ownerId: createdOwner._id,
      managerId: null,
      branchType: "main",
      parentRestaurantId: null,
    });

    return Response.json(
      {
        success: true,
        message: "Owner and restaurant created successfully.",
        ownerId: createdOwner._id,
        restaurantId: newRestaurant._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create restaurant error:", error);

    // Remove owner if restaurant creation failed
    if (createdOwner) {
      try {
        await Owner.findByIdAndDelete(createdOwner._id);
      } catch (deleteError) {
        console.error("Owner cleanup error:", deleteError);
      }
    }

    return Response.json(
      {
        success: false,
        message: "Unable to create owner and restaurant.",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const restaurants = await Restaurant.find()
      .populate("ownerId")
      .sort({ createdAt: -1 })
      .lean();

    const owners = await Owner.find()
      .select("-passwordHash -invitationTokenHash -invitationExpiresAt")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      restaurants: restaurants.map((restaurant) => ({
        id: String(restaurant._id),
        restaurantCode: restaurant.restaurantCode || "",
        name: restaurant.name,
        gstNumber: restaurant.gst,
        phone: restaurant.phone,
        email: restaurant.email,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        pincode: restaurant.pincode,
        status: restaurant.status,
        ownerId: restaurant.ownerId
          ? String(restaurant.ownerId._id)
          : "",
        managerId: restaurant.managerId || null,
        branchType: restaurant.branchType || "main",
        parentRestaurantId: restaurant.parentRestaurantId
          ? String(restaurant.parentRestaurantId)
          : null,
        image: restaurant.image || "",
      })),

      owners: owners.map((owner) => ({
        id: String(owner._id),
        ownerCode: owner.ownerCode || "",
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
        city: owner.city,
        state: owner.state,
        pincode: owner.pincode,
        pan: owner.pan,
        aadhaar: owner.aadhaar,
        status: owner.status,
        passwordSetAt: owner.passwordSetAt,
      })),
    });
  } catch (error) {
    console.error("Fetch restaurants error:", error);

    return Response.json(
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
    const admin = await requireAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { restaurantId, restaurant } = body;

    if (!restaurantId || !restaurant) {
      return Response.json(
        {
          success: false,
          message: "Restaurant ID and details are required.",
        },
        { status: 400 }
      );
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
        $set: {
          name: restaurant.name?.trim(),
          gst: restaurant.gstNumber,
          phone: restaurant.phone,
          email: restaurant.email?.trim().toLowerCase(),
          address: restaurant.address,
          city: restaurant.city,
          state: restaurant.state,
          pincode: restaurant.pincode,
          status: restaurant.status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRestaurant) {
      return Response.json(
        {
          success: false,
          message: "Restaurant not found.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Restaurant updated successfully.",
    });

  } catch (error) {
    console.error("Update restaurant error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update restaurant.",
      },
      { status: 500 }
    );
  }
}



export async function DELETE(request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const { restaurantId } = await request.json();

  if (!restaurantId || !Types.ObjectId.isValid(restaurantId)) {
      return Response.json(
        {
          success: false,
          message: "Valid restaurant ID is required.",
        },
        { status: 400 }
      );
    }

    const deletedRestaurant = await Restaurant.findByIdAndDelete(
      restaurantId
    );

    if (!deletedRestaurant) {
      return Response.json(
        {
          success: false,
          message: "Restaurant not found.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Restaurant deleted successfully.",
      restaurantId: String(deletedRestaurant._id),
    });
  } catch (error) {
    console.error("Delete restaurant error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to delete restaurant.",
      },
      { status: 500 }
    );
  }
}


