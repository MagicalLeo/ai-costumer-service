// app/api/auth/register/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        code: 1, 
        message: "Username or email already exists" 
      }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      code: 0, 
      data: { user: userWithoutPassword } 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      code: 1, 
      message: "Registration failed" 
    }, { status: 500 });
  }
}