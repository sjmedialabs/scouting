// JWT Authentication Utilities
// Secure token generation and verification

"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import type { IUser } from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
);

const TOKEN_EXPIRY = "7d";
const COOKIE_NAME = "spark-auth-token";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "client" | "agency" | "admin";
  name: string;
  iat?: number;
  exp?: number;
}

/* ============================
   TOKEN GENERATION
============================ */
export async function generateToken(user: IUser): Promise<string> {
  return await new SignJWT({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/* ============================
   TOKEN VERIFICATION
============================ */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/* ============================
   COOKIE HELPERS (OPTIONAL)
============================ */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // ✅ IMPORTANT: keep false until HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function removeAuthCookie(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}

/* ============================
   🔐 MAIN AUTH FUNCTION (FIX)
============================ */
export async function getCurrentUser(
  req?: Request,
): Promise<JWTPayload | null> {
  try {
    // 1️⃣ Authorization header (PRODUCTION SAFE)
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        return await verifyToken(token);
      }
    }

    // 2️⃣ Next.js headers() fallback (App Router)
    const headerStore = headers();
    const authHeader = headerStore.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      return await verifyToken(token);
    }

    // 3️⃣ Cookie fallback (LOCAL / FUTURE HTTPS)
    const cookieToken = await getAuthCookie();
    if (!cookieToken) return null;

    return await verifyToken(cookieToken);
  } catch (error) {
    console.error("getCurrentUser failed:", error);
    return null;
  }
}

/* ============================
   PASSWORD UTILS
============================ */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(
    password + (process.env.PASSWORD_SALT || "spark-salt"),
  );
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
