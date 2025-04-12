// app/api/message/update/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Get user from token
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    console.log("Unauthorized attempt to update message");
    return NextResponse.json({ 
      code: 1, 
      message: "Unauthorized" 
    }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;
  
  try {
    // If no chatId provided, create a new chat
    if (!data.chatId) {
      const chat = await prisma.chat.create({
        data: {
          title: "New Chat",
          userId: userId, // Associate with the current user
        },
      });
      data.chatId = chat.id;
      console.log("Created new chat:", chat.id, "for user:", userId);
    } else {
      // If chatId provided, verify user owns this chat
      const chat = await prisma.chat.findUnique({
        where: { id: data.chatId }
      });
      
      if (!chat) {
        console.log("Chat not found:", data.chatId);
        return NextResponse.json({ 
          code: 1, 
          message: "Chat not found" 
        }, { status: 404 });
      }
      
      if (chat.userId !== userId) {
        console.log("Unauthorized access to chat:", data.chatId, "by user:", userId);
        return NextResponse.json({ 
          code: 1, 
          message: "Unauthorized to access this chat" 
        }, { status: 403 });
      }
      
      // Update chat's timestamp
      await prisma.chat.update({
        data: {
          updateTime: new Date(),
        },
        where: {
          id: data.chatId,
        },
      });
    }

    // Create or update message
    const message = await prisma.message.upsert({
      create: data,
      update: data,
      where: {
        id: id || "", // Handle empty id for new messages
      },
    });
    
    return NextResponse.json({ code: 0, data: { message } });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json({ 
      code: 1, 
      message: "Failed to update message" 
    }, { status: 500 });
  }
}