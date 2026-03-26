import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";

const secretKey = process.env.JWT_SECRET_KEY || "fallback_secret_key_for_development";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession(token?: string) {
  if (token) {
    try {
      return await decrypt(token);
    } catch {
      return null;
    }
  }

  try {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function setSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ id: userId, role, expires });

  cookies().set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function clearSession() {
  cookies().set("session", "", {
    expires: new Date(0),
    path: "/",
  });
}

/**
 * Reads the JWT session cookie and returns the current authenticated user from DB.
 * Returns null if not authenticated.
 */
export async function getUserFromRequest(_req?: Request) {
  try {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    const payload = await decrypt(session);
    if (!payload?.id) return null;
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: { id: true, name: true, email: true, role: true },
    });
    return user;
  } catch {
    return null;
  }
}
