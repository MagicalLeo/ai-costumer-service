// app/api/chat/list/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const userId = await getUserIdFromToken(token); // Add await here
  
  if (!userId) {
    return NextResponse.json({ 
      code: 1, 
      message: "Unauthorized" 
    }, { status: 401 });
  }
  
  const param = request.nextUrl.searchParams.get("page");
  const page = param ? parseInt(param) : 1;
  
  try {
    console.log("Fetching chat list for user:", userId, "on page:", page);
    const list = await prisma.chat.findMany({
      where: {
        userId: userId
      },
      skip: (page - 1) * 20,
      take: 20,
      orderBy: {
        updateTime: "desc",
      },
    });
    
    const count = await prisma.chat.count({
      where: {
        userId: userId
      }
    });
    
    const hasMore = count > page * 20;
    
    return NextResponse.json({ code: 0, data: { list, hasMore } });
  } catch (error) {
    console.error("Error fetching chat list:", error);
    return NextResponse.json({ 
      code: 1, 
      message: "Failed to fetch chat list" 
    }, { status: 500 });
  }
}