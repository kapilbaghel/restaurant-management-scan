
import bcrypt from "bcryptjs";

// Convert password into a secure hash
export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// Verify password during login
export async function verifyPassword(password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
}
