// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ 
    code: 0, 
    message: "Logged out successfully" 
  });
  
  // Clear the cookie
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  
  return response;
}