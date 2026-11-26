
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import { hashPassword } from "@/lib/password";
import { hashInvitationToken } from "@/lib/invitation";

export async function POST(request) {
  try {
    await connectDB();

    const { token, password } = await request.json();

    // Check required fields
    if (!token || !password) {
      return Response.json(
        {
          success: false,
          message: "Token and password are required.",
        },
        { status: 400 }
      );
    }

    // Validate password
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return Response.json(
        {
          success: false,
          message: "Password must contain at least 8 characters, one uppercase letter, one number and one special character.",
        },
        { status: 400 }
      );
    }

    // Find owner using invitation token
    const tokenHash = hashInvitationToken(token);

    const owner = await Owner.findOne({
      invitationTokenHash: tokenHash,
      invitationExpiresAt: { $gt: new Date() },
    });

    if (!owner) {
      return Response.json(
        {
          success: false,
          message: "Invitation link is invalid or expired.",
        },
        { status: 400 }
      );
    }

    // Hash and save password
    owner.passwordHash = await hashPassword(password);
    owner.passwordSetAt = new Date();

    // Make invitation token unusable
    owner.invitationTokenHash = null;
    owner.invitationExpiresAt = null;

    await owner.save();

    return Response.json({
      success: true,
      message: "Password set successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Set password error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
