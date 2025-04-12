// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "./lib/auth";

export function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register", "/_next", "/favicon.ico"];
  const { pathname } = request.nextUrl;
  
  // Allow public paths without authentication
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Allow API routes that handle authentication
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value;
  const userId = getUserIdFromToken(token);
  
  // If no valid token, redirect API requests to 401 response
  if (!userId && pathname.startsWith("/api/")) {
    return NextResponse.json({ code: 1, message: "Unauthorized" }, { status: 401 });
  }
  
  // For non-API routes, let the client-side handle redirects
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match specific page routes we want to protect
    '/((?!login|register|_next|favicon.ico).*)',
  ],
};