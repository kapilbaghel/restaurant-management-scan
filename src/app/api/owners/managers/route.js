import Counter from "@/models/Counter";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Manager from "@/models/Manager";
import { verifyOwnerToken } from "@/lib/ownerAuth";
import bcrypt from "bcryptjs";
import { Readable } from "node:stream";
export const runtime = "nodejs";

// Verify logged-in Owner
async function getAuthenticatedOwner() {
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

  await connectDB();

  const owner = await Owner.findOne({
    _id: payload.ownerId,
    status: "Active",
  }).select("_id");

  if (!owner) {
    return { error: "Owner not found or account inactive.", status: 403 };
  }

  return { owner };
}

// GET: Fetch logged-in Owner's managers
export async function GET() {
  try {
    const auth = await getAuthenticatedOwner();

    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

const managers = await Manager.find({
  ownerId: auth.owner._id,
})
  .populate({
    path: "restaurantId",
   select: "name city branchType parentRestaurantId",
    populate: {
      path: "parentRestaurantId",
      select: "name",
    },
  })
  .sort({ createdAt: -1 })
  .lean();

    return NextResponse.json({
      success: true,
 managers: managers.map((manager) => ({
  id: manager._id.toString(),
  managerCode: manager.managerCode || "",
  name: manager.name,
  email: manager.email,
  phone: manager.phone || "",

  // Personal Details
  dateOfBirth: manager.dateOfBirth
    ? manager.dateOfBirth.toISOString().split("T")[0]
    : "",
  maritalStatus: manager.maritalStatus || "",

  // Address Details
  permanentAddress: manager.permanentAddress || "",
  correspondenceAddress: manager.correspondenceAddress || "",

  // Professional Details
  qualification: manager.qualification || "",
  otherQualification: manager.otherQualification || "",
  workExperience: manager.workExperience || "",

// Restaurant & Branch Assignment
restaurantId: manager.restaurantId?._id?.toString() || "",

restaurantName:
  manager.restaurantId?.branchType === "sub"
    ? manager.restaurantId?.parentRestaurantId?.name ||
      manager.restaurantId?.name ||
      "Not Assigned"
    : manager.restaurantId?.name || "Not Assigned",

branchName:
  manager.restaurantId?.city || "City Not Added",

ownerId: manager.ownerId.toString(),
status: manager.status,
})),
    });
  } catch (error) {
    console.error("Fetch managers error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch managers." },
      { status: 500 }
    );
  }
}

// POST: Create a new Manager

 // POST: Create a new Manager with GridFS documents
export async function POST(request) {
  const uploadedIds = [];
  let bucket;

  try {
    const auth = await getAuthenticatedOwner();

    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const status = formData.get("status");

    const dateOfBirth = formData.get("dateOfBirth");
    const maritalStatus = formData.get("maritalStatus");
    const permanentAddress = formData.get("permanentAddress");
    const correspondenceAddress = formData.get("correspondenceAddress");
    const qualification = formData.get("qualification");
    const otherQualification = formData.get("otherQualification");
    const workExperience = formData.get("workExperience");

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Manager name and email are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingManager = await Manager.findOne({
      ownerId: auth.owner._id,
      email: normalizedEmail,
    });

    if (existingManager) {
      return NextResponse.json(
        {
          success: false,
          message: "A manager with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Read uploaded files
    const fileFields = {
      photo: { max: 1, size: 5 * 1024 * 1024 },
      aadhaar: { max: 3, size: 5 * 1024 * 1024 },
      pan: { max: 3, size: 5 * 1024 * 1024 },
      educationCertificates: {
        max: 10,
        size: 10 * 1024 * 1024,
      },
      experienceLetters: {
        max: 2,
        size: 10 * 1024 * 1024,
      },
    };

    const files = {};

    for (const [field, config] of Object.entries(fileFields)) {
      const entries = formData.getAll(field);

      if (entries.some((entry) => typeof entry === "string")) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid file data for ${field}.`,
          },
          { status: 400 }
        );
      }

      files[field] = entries.filter(
        (entry) => typeof entry.arrayBuffer === "function"
      );

      if (files[field].length > config.max) {
        return NextResponse.json(
          {
            success: false,
            message: `Maximum ${config.max} file(s) allowed for ${field}.`,
          },
          { status: 400 }
        );
      }

      for (const file of files[field]) {
        const extension = file.name.split(".").pop()?.toLowerCase();

        const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/jpg",
        ];

        if (
          !allowedExtensions.includes(extension) ||
          (file.type && !allowedTypes.includes(file.type))
        ) {
          return NextResponse.json(
            {
              success: false,
              message: `${file.name} has an unsupported file type.`,
            },
            { status: 400 }
          );
        }

        if (file.size === 0 || file.size > config.size) {
          return NextResponse.json(
            {
              success: false,
              message: `${file.name} must be within the allowed file size.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Connect to GridFS
    bucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "managerDocuments" }
    );

    // Upload one file to GridFS
    const uploadToGridFS = async (file, fieldName) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadStream = bucket.openUploadStream(file.name, {
        metadata: {
          ownerId: auth.owner._id,
          fieldName,
          contentType: file.type || "application/octet-stream",
        },
      });

      const fileId = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          resolve(uploadStream.id);
        });

        uploadStream.on("error", reject);

        Readable.from(buffer).pipe(uploadStream);
      });

      uploadedIds.push(fileId);

      return fileId;
    };

    // Upload all document categories
    const photoId = files.photo.length
      ? await uploadToGridFS(files.photo[0], "photo")
      : null;

    const aadhaarIds = await Promise.all(
      files.aadhaar.map((file) =>
        uploadToGridFS(file, "aadhaar")
      )
    );

    const panIds = await Promise.all(
      files.pan.map((file) =>
        uploadToGridFS(file, "pan")
      )
    );

    const educationIds = await Promise.all(
      files.educationCertificates.map((file) =>
        uploadToGridFS(file, "educationCertificates")
      )
    );

    const experienceIds = await Promise.all(
      files.experienceLetters.map((file) =>
        uploadToGridFS(file, "experienceLetters")
      )
    );

    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : null;


// Generate unique Manager ID
const counter = await Counter.findByIdAndUpdate(
  "manager",
  { $inc: { sequence: 1 } },
  { new: true, upsert: true }
);

const managerCode = `MGR-${String(counter.sequence).padStart(6, "0")}`;


    // Create Manager document in MongoDB
    const manager = await Manager.create({
      managerCode,
      name: name.trim(),
      email: normalizedEmail,
      phone: typeof phone === "string" ? phone : "",
      passwordHash,

      dateOfBirth: dateOfBirth || null,
      maritalStatus: maritalStatus || "",
      permanentAddress: permanentAddress || "",
      correspondenceAddress: correspondenceAddress || "",
      qualification: qualification || "",
      otherQualification: otherQualification || "",
      workExperience: workExperience || "",

      documents: {
        photo: photoId,
        aadhaar: aadhaarIds,
        pan: panIds,
        educationCertificates: educationIds,
        experienceLetters: experienceIds,
      },

      restaurantId: null,
      ownerId: auth.owner._id,
      status: status || "Active",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Manager created successfully.",
        manager: {
          id: manager._id.toString(),
          managerCode: manager.managerCode,
          name: manager.name,
          email: manager.email,
          phone: manager.phone,
          restaurantId: "",
          ownerId: manager.ownerId.toString(),
          status: manager.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create manager error:", error);

    // Remove uploaded GridFS files if manager creation fails
    if (bucket) {
      await Promise.all(
        uploadedIds.map(async (fileId) => {
          try {
            await bucket.delete(fileId);
          } catch (deleteError) {
            console.error("GridFS cleanup error:", deleteError);
          }
        })
      );
    }

    return NextResponse.json(
      { success: false, message: "Unable to create manager." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing Manager's password
export async function PUT(request) {
  try {
    const auth = await getAuthenticatedOwner();

    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { managerId, password, confirmPassword } =
      await request.json();

    if (!managerId || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Manager ID and both password fields are required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid manager ID." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match." },
        { status: 400 }
      );
    }

    const passwordRules =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/;

    if (!passwordRules.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must have at least 8 characters, one capital letter, one number and one special character.",
        },
        { status: 400 }
      );
    }

    const manager = await Manager.findOne({
      _id: managerId,
      ownerId: auth.owner._id,
    });

    if (!manager) {
      return NextResponse.json(
        { success: false, message: "Manager not found." },
        { status: 404 }
      );
    }

    manager.passwordHash = await bcrypt.hash(password, 10);
    await manager.save();

    return NextResponse.json({
      success: true,
      message: "Manager password updated successfully.",
    });
  } catch (error) {
    console.error("Update manager password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update manager password.",
      },
      { status: 500 }
    );
  }
}

