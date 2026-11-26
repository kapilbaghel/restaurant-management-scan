import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Manager from "@/models/Manager";
import { cookies } from "next/headers";
import { verifyOwnerToken } from "@/lib/ownerAuth";

export const runtime = "nodejs";

async function getAuthenticatedOwner() {
  const cookieStore = await cookies();
  const token = cookieStore.get("owner_session")?.value;

  if (!token) return null;

  const payload = await verifyOwnerToken(token);

  if (!payload?.ownerId) return null;

  const owner = await Owner.findOne({
    _id: payload.ownerId,
    status: "Active",
  }).select("_id");

  return owner;
}

async function getFile(bucket, fileId) {
  if (!fileId) return null;

  const file = await bucket.find({
    _id: new mongoose.Types.ObjectId(fileId),
  }).next();

  if (!file) return null;

  const buffer = await new Promise((resolve, reject) => {
    const chunks = [];
    const stream = bucket.openDownloadStream(file._id);

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const contentType =
    file.metadata?.contentType || "application/octet-stream";

  return {
    name: file.filename,
    data: `data:${contentType};base64,${buffer.toString("base64")}`,
  };
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    const owner = await getAuthenticatedOwner();

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { managerId } = await params;

    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Manager ID." },
        { status: 400 }
      );
    }

    const manager = await Manager.findOne({
      _id: managerId,
      ownerId: owner._id,
    })
      .populate("restaurantId", "name")
      .lean();

    if (!manager) {
      return NextResponse.json(
        { success: false, message: "Manager not found." },
        { status: 404 }
      );
    }

    const bucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "managerDocuments" }
    );

    const photo = await getFile(bucket, manager.documents?.photo);

    const getFiles = async (ids = []) =>
      Promise.all(ids.map((id) => getFile(bucket, id)));

    const [aadhaar, pan, educationCertificates, experienceLetters] =
      await Promise.all([
        getFiles(manager.documents?.aadhaar),
        getFiles(manager.documents?.pan),
        getFiles(manager.documents?.educationCertificates),
        getFiles(manager.documents?.experienceLetters),
      ]);

    return NextResponse.json({
      success: true,
      manager: {
        id: manager._id.toString(),
        managerCode: manager.managerCode || "",
        name: manager.name,
        email: manager.email,
        phone: manager.phone || "",
        photo: photo?.data || "",

        dateOfBirth: manager.dateOfBirth
          ? manager.dateOfBirth.toISOString().split("T")[0]
          : "",

        maritalStatus: manager.maritalStatus || "",
        permanentAddress: manager.permanentAddress || "",
        correspondenceAddress: manager.correspondenceAddress || "",
        qualification: manager.qualification || "",
        otherQualification: manager.otherQualification || "",
        workExperience: manager.workExperience || "",

        restaurant: manager.restaurantId?.name || "Not Assigned",
        restaurantId: manager.restaurantId?._id?.toString() || "",

        status: manager.status,

        aadhaar: aadhaar.filter(Boolean),
        pan: pan.filter(Boolean),
        educationCertificates: educationCertificates.filter(Boolean),
        experienceLetters: experienceLetters.filter(Boolean),
      },
    });
  } catch (error) {
    console.error("Fetch manager details error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch manager details." },
      { status: 500 }
    );
  }
}