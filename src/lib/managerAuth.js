import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET is not configured in environment variables.");
}

const secret = new TextEncoder().encode(secretKey);

// Create Manager JWT token
export async function createManagerToken(manager) {
  return await new SignJWT({
    managerId: manager._id.toString(),
    ownerId: manager.ownerId.toString(),
    restaurantId: manager.restaurantId?.toString() || null,
    email: manager.email,
    role: "Manager",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

// Verify Manager JWT token
export async function verifyManagerToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload.managerId || payload.role !== "Manager") {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}