
export async function POST() {
  try {
    const response = Response.json({
      success: true,
      message: "Owner logged out successfully.",
    });

    response.headers.append(
      "Set-Cookie",
      "owner_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax" +
        (process.env.NODE_ENV === "production" ? "; Secure" : "")
    );

    return response;
  } catch (error) {
    console.error("Owner logout error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to logout. Please try again.",
      },
      { status: 500 }
    );
  }
}
