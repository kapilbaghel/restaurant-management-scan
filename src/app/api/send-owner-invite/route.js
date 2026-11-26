
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import Owner from "@/models/Owner";
import {
  generateInvitationToken,
  hashInvitationToken,
} from "@/lib/invitation";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { ownerName, ownerEmail, restaurantName } = body;

    if (!ownerEmail || !restaurantName) {
      return Response.json(
        {
          success: false,
          message: "Owner email and restaurant name are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = ownerEmail.trim().toLowerCase();

    // Find existing owner
    const owner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (!owner) {
      return Response.json(
        {
          success: false,
          message: "Owner account not found.",
        },
        { status: 404 }
      );
    }

    if (owner.passwordHash) {
      return Response.json(
        {
          success: false,
          message: "This owner has already set a password.",
        },
        { status: 400 }
      );
    }

    // Generate secure invitation token
    const token = generateInvitationToken();

    owner.invitationTokenHash = hashInvitationToken(token);
    owner.invitationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    await owner.save();

    // Create invitation link
    const invitationLink =
      `${process.env.NEXT_PUBLIC_APP_URL}/owner/set-password?token=${token}`;

    // Brevo SMTP transporter
 
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    minVersion: "TLSv1.2",
  },
});


    await transporter.verify();

console.log("Brevo SMTP connected successfully!");

    // Send invitation email
    const info = await transporter.sendMail({
      from: `"RestaurantOS" <kapilbaghelabc27@gmail.com>`,
      to: normalizedEmail,
      subject: "Welcome to RestaurantOS",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
          <h2>Welcome to RestaurantOS</h2>

          <p>Hello ${ownerName || owner.name || "Owner"},</p>

          <p>Your RestaurantOS owner account has been created successfully.</p>

          <p><strong>Restaurant:</strong> ${restaurantName}</p>

          <p><strong>Login Email:</strong> ${normalizedEmail}</p>

          <p>Please click below to set your password.</p>

          <a
            href="${invitationLink}"
            style="display: inline-block; padding: 12px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;"
          >
            Set Your Password
          </a>

          <p>This invitation link will expire in 24 hours and can only be used once.</p>

          <p style="margin-top: 30px;">
            Regards,<br />
            RestaurantOS Team
          </p>
        </div>
      `,
    });

    return Response.json({
      success: true,
      message: "Owner invitation email sent successfully.",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    return Response.json(
      {
        success: false,
        message: "Email could not be sent.",
      },
      { status: 500 }
    );
  }
}
