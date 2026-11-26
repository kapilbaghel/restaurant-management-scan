
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET is not configured in environment variables.");
}

const secret = new TextEncoder().encode(secretKey);

// Create Owner JWT token
export async function createOwnerToken(owner) {
  return await new SignJWT({
    ownerId: owner._id.toString(),
    email: owner.email,
    role: "Owner",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

// Verify Owner JWT token
export async function verifyOwnerToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload.ownerId || payload.role !== "Owner") {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}
