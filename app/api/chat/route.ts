// app/api/chat/route.ts
import { sleep } from "@/common/util";
import { MessageRequestBody } from "@/types/Chat";
import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // Authenticate user
  const token = request.cookies.get("auth_token")?.value;
  const userId = getUserIdFromToken(token);
  
  if (!userId) {
    return new Response(JSON.stringify({ 
      code: 1, 
      message: "Unauthorized" 
    }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  try {
    const { messages } = (await request.json()) as MessageRequestBody;
    
    // If messages exist and have a chatId, verify ownership
    if (messages.length > 0 && messages[0].chatId) {
      const chatId = messages[0].chatId;
      const chat = await prisma.chat.findUnique({
        where: { id: chatId }
      });
      
      if (!chat) {
        return new Response(JSON.stringify({ 
          code: 1, 
          message: "Chat not found" 
        }), { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      if (chat.userId !== userId) {
        return new Response(JSON.stringify({ 
          code: 1, 
          message: "Unauthorized to access this chat" 
        }), { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // Continue with existing functionality
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const context = messages.slice(0, -1).map(msg => msg.content).join("\n");
        const content = messages[messages.length - 1].content;
        
        console.log("context:", context);
        console.log("content:", content);
        const response = await fetch("http://127.0.0.1:3001/backend/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ context, content }),
        });
        
        if (!response.body) {
          console.log(response.statusText);
          return;
        } else {
          const responseText = JSON.parse(await response.text())
            .response
            // 移除空的 <think></think> 标签
            .replace(/<think>\s*<\/think>/g, "")
            // 替换非空的 <think> 标签及其内容
            .replace(
              /<think>([\s\S]*?)<\/think>/g,
              '<div class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-l-4 border-gray-300 dark:border-gray-600 p-4 my-4 italic">思考中...$1</div>'
            );

          console.log(responseText);
          for (let i = 0; i < responseText.length; i++) {
            await sleep(10);
            controller.enqueue(encoder.encode(responseText[i]));
          }
          controller.close();
        }
      },
    });
    
    return new Response(stream);
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ 
      code: 1, 
      message: "Failed to process chat" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}