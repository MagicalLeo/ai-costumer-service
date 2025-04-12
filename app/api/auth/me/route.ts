// app/api/auth/me/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      console.log("No user ID found in request");
      return NextResponse.json({ 
        code: 1, 
        message: "Unauthorized" 
      }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.log("User not found with ID:", userId);
      return NextResponse.json({ 
        code: 1, 
        message: "User not found" 
      }, { status: 404 });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      code: 0, 
      data: { user: userWithoutPassword } 
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ 
      code: 1, 
      message: "Authentication failed" 
    }, { status: 401 });
  }
}