// app/api/chat/route.ts
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
      
      if (chat.userId !== await userId) {
        return new Response(JSON.stringify({ 
          code: 1, 
          message: "Unauthorized to access this chat" 
        }), { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // 準備流式處理
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const context = messages.slice(0, -1).map(msg => msg.content).join("\n");
          const content = messages[messages.length - 1].content;
          
          console.log("context:", context);
          console.log("content:", content);
          
          // 向後端 API 發送請求並獲取流式響應
          const response = await fetch("http://127.0.0.1:3001/backend/api/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ context, content }),
          });
          
          if (!response.ok) {
            controller.enqueue(encoder.encode(`Error: ${response.statusText}`));
            controller.close();
            return;
          }
          
          if (!response.body) {
            controller.enqueue(encoder.encode("Error: No response body"));
            controller.close();
            return;
          }
          
          // 創建讀取器以處理流式響應
          const reader = response.body.getReader();
          let decoder = new TextDecoder();
          let buffer = '';
          
          // 讀取並處理流式數據
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // 確保處理剩餘的緩衝區
              if (buffer.length > 0) {
                processBuffer(buffer, controller, encoder);
              }
              break;
            }
            
            // 將二進制數據轉換為文本
            buffer += decoder.decode(value, { stream: true });
            
            // 處理 SSE 格式的數據
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || ''; // 將剩餘部分保留在緩衝區
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.substring(6)); // 移除 'data: ' 前綴
                  
                  if (data.chunk) {
                    // 處理思考模式標籤
                    let processedChunk = data.chunk
                      .replace(/<think>\s*<\/think>/g, "")
                      .replace(
                        /<think>([\s\S]*?)<\/think>/g,
                        '<div class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-l-4 border-gray-300 dark:border-gray-600 p-4 my-4 italic">思考中...$1</div>'
                      );
                    
                    controller.enqueue(encoder.encode(processedChunk));
                  }
                  
                  if (data.done) {
                    // 結束流
                    controller.close();
                    return;
                  }
                  
                  if (data.error) {
                    // 處理錯誤
                    controller.enqueue(encoder.encode(`Error: ${data.error}`));
                    controller.close();
                    return;
                  }
                } catch (e) {
                  console.error("Error parsing SSE data:", e, line);
                }
              }
            }
          }
          
          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(encoder.encode(`Error: ${errorMessage}`));
          controller.close();
        }
      }
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

// 輔助函數：處理 SSE 緩衝區
function processBuffer(buffer: string, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
  if (!buffer || buffer.trim() === '') return;
  
  const lines = buffer.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const data = JSON.parse(line.substring(6)); // 移除 'data: ' 前綴
        
        if (data.chunk) {
          // 處理思考模式標籤
          // let processedChunk = data.chunk
          //   .replace(/<think>\s*<\/think>/g, "")
          //   .replace(
          //     /<think>([\s\S]*?)<\/think>/g,
          //     '<div class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-l-4 border-gray-300 dark:border-gray-600 p-4 my-4 italic">思考中...$1</div>'
          //   );
          let processedChunk = data.chunk
          if(processedChunk.includes("<think>")) {
            console.log("包含思考模式標籤")
          }
          if(processedChunk.includes("<think></think>")) {
            console.log("包含空的思考模式標籤")
          }
          if(processedChunk.includes("</think>")) {
            console.log("包含結束思考模式標籤")}
          controller.enqueue(encoder.encode(processedChunk));
        }
      } catch (e) {
        console.error("Error parsing buffer data:", e, line);
      }
    }
  }
}