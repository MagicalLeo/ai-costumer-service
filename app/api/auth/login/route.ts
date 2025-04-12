// app/api/auth/login/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ 
        code: 1, 
        message: "Invalid credentials" 
      }, { status: 401 });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        code: 1, 
        message: "Invalid credentials" 
      }, { status: 401 });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    
    // Create response
    const response = NextResponse.json({ 
      code: 0, 
      data: { 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email 
        },
        token // Include token in response for debugging
      } 
    });
    
    // Set cookie with proper settings
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax", // Changed from strict to lax for better compatibility
      secure: process.env.NODE_ENV === "production" // Only secure in production
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ 
      code: 1, 
      message: "Login failed" 
    }, { status: 500 });
  }
}