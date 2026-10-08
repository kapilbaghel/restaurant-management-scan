import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      ownerName,
      ownerEmail,
      restaurantName,
    } = body;

    if (!ownerEmail || !restaurantName) {
      return Response.json(
        {
          success: false,
          message: "Owner email and restaurant name are required.",
        },
        { status: 400 }
      );
    }

const { data, error } = await resend.emails.send({
  from: "RestaurantOS <onboarding@resend.dev>",
  to: [ownerEmail],
      subject: "Welcome to RestaurantOS",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">

          <h2>Welcome to RestaurantOS</h2>

          <p>Hello ${ownerName || "Owner"},</p>

          <p>
            Your RestaurantOS owner account has been created successfully.
          </p>

          <p>
            <strong>Restaurant:</strong> ${restaurantName}
          </p>

          <p>
            <strong>Login Email:</strong> ${ownerEmail}
          </p>

          <p>
            Please click the button below to set your password.
          </p>

          <a
            href="http://localhost:3000/owner/set-password"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Set Your Password
          </a>

          <p style="margin-top: 30px;">
            Regards,<br />
            RestaurantOS Team
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        {
          success: false,
          message: "Email could not be sent.",
          error,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Owner invitation email sent successfully.",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}