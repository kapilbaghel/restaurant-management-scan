
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import { verifyPassword } from "@/lib/password";
import { createOwnerToken } from "@/lib/ownerAuth";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const owner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (!owner || !owner.passwordHash) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (owner.status !== "Active") {
      return Response.json(
        {
          success: false,
          message: "Your account is inactive.",
        },
        { status: 403 }
      );
    }

    const isPasswordCorrect = await verifyPassword(
      password,
      owner.passwordHash
    );

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Create Owner JWT token
    const token = await createOwnerToken(owner);

    // Prepare response
    const response = Response.json({
      success: true,
      message: "Login successful.",
      owner: {
        id: owner._id.toString(),
        name: owner.name,
        email: owner.email,
      },
    });

    // Set secure HTTP-only cookie
    response.headers.append(
      "Set-Cookie",
      `owner_session=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    );

    return response;

  } catch (error) {
    console.error("Owner login error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
