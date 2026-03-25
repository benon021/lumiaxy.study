import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // Try to get the session from the cookies
  const sessionToken = request.cookies.get("session")?.value;
  const session = sessionToken ? await getSession(sessionToken) : null;

  // If the user is trying to access a secure route without a session
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      // Redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Optional: If the user is already logged in, they shouldn't visit /login or /signup
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup")
  ) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
