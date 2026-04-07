// lib/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ─── Admin credentials ────────────────────────────────────────────────────────
// Read from .env — change ADMIN_USERNAME and ADMIN_PASSWORD there
export const ADMIN = {
  username: process.env.ADMIN_USERNAME || "admin",
  // Store hashed password. We compare at login time using bcrypt.
  // The plain-text source is ADMIN_PASSWORD in .env
  password: process.env.ADMIN_PASSWORD || "admin123",
  role: "admin",
};

// ─── Token ────────────────────────────────────────────────────────────────────
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ─── Password ─────────────────────────────────────────────────────────────────
export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain, hashed) {
  // If the stored value looks like a bcrypt hash use bcrypt, else plain compare
  // (handles the case where ADMIN_PASSWORD is set as plain text in .env)
  if (hashed.startsWith("$2")) {
    return bcrypt.compare(plain, hashed);
  }
  return plain === hashed;
}

// ─── Request helpers ──────────────────────────────────────────────────────────
/**
 * Extract and verify JWT from Authorization header or cookie.
 * Returns decoded payload or null.
 */
export function getAuthPayload(request) {
  // 1. Try Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return verifyToken(token);
  }
  // 2. Try cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (match) {
    return verifyToken(decodeURIComponent(match[1]));
  }
  return null;
}

/**
 * Returns true only if the request carries a valid admin JWT.
 */
export function isAdmin(request) {
  const payload = getAuthPayload(request);
  return payload?.role === "admin";
}

// ─── Response helpers ─────────────────────────────────────────────────────────
export function unauthorizedResponse(message = "Unauthorized") {
  return Response.json({ success: false, error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden — admin only") {
  return Response.json({ success: false, error: message }, { status: 403 });
}
