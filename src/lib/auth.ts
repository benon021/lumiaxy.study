import { encrypt, decrypt } from "./jwt";
import { cookies } from "next/headers";
import prisma from "./prisma";

export async function getSession(token?: string) {
  if (token) {
    try {
      return await decrypt(token);
    } catch {
      return null;
    }
  }

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function setSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ id: userId, role, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
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
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
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
