import { getAuthCookie, verifyToken } from "@/lib/auth/jwt";

export async function getUserFromCookie() {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}
