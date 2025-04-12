// app/api/message/delete/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Authenticate user
  const token = request.cookies.get("auth_token")?.value;
  const userId = await getUserIdFromToken(token);
  
  if (!userId) {
    return NextResponse.json({ 
      code: 1, 
      message: "Unauthorized" 
    }, { status: 401 });
  }
  
  try {
    const id = request.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ code: -1 });
    }
    
    // Get message and check ownership
    const message = await prisma.message.findUnique({
      where: { id },
      include: { chat: true }
    });
    
    if (!message) {
      return NextResponse.json({ 
        code: 1, 
        message: "Message not found" 
      }, { status: 404 });
    }
    
    // Verify user owns the chat
    if (message.chat.userId !== userId) {
      return NextResponse.json({ 
        code: 1, 
        message: "Unauthorized to delete this message" 
      }, { status: 403 });
    }
    
    // Delete the message
    await prisma.message.delete({
      where: { id }
    });
    
    return NextResponse.json({ code: 0 });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json({ 
      code: 1, 
      message: "Failed to delete message" 
    }, { status: 500 });
  }
}