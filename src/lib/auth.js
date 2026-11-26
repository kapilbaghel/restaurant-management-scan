import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET is not configured in environment variables.");
}

const secret = new TextEncoder().encode(secretKey);

// Create JWT token
export async function createAdminToken(admin) {
  return await new SignJWT({
    adminId: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

// Verify JWT token
export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    return null;
  }
}