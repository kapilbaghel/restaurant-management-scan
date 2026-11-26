
import crypto from "crypto";

// Generate a secure random invitation token
export function generateInvitationToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Convert token into SHA-256 hash
export function hashInvitationToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}
