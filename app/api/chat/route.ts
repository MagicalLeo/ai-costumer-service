// app/api/chat/route.ts
import { MessageRequestBody } from "@/types/Chat";
import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

// 全局状态追踪
let isInThinkMode = false;
let thinkContent = '';
let thinkStartId = '';
let thinkCounter = 0;

export async function POST(request: NextRequest) {
  // 身份验证代码保持不变
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
    
    // 验证聊天所有权 (代码保持不变)
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
    
    // 重置全局状态
    isInThinkMode = false;
    thinkContent = '';
    thinkCounter = 0;
    
    // 注入必要的样式（只在第一次请求时）
    let stylesInjected = false;
    
    // 准备流式处理
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const context = messages.slice(0, -1).map(msg => msg.content).join("\n");
          const content = messages[messages.length - 1].content;
          
          // 向后端 API 发送请求并获取流式响应
          const response = await fetch("http://127.0.0.1:3001/backend/api/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ context, content }),
          });
          
          if (!response.ok || !response.body) {
            const errorMsg = !response.ok ? response.statusText : "No response body";
            controller.enqueue(encoder.encode(`Error: ${errorMsg}`));
            controller.close();
            return;
          }
          
          // 创建读取器以处理流式响应
          const reader = response.body.getReader();
          let decoder = new TextDecoder();
          let buffer = '';
          
          // 首先注入样式
          if (!stylesInjected) {
            controller.enqueue(encoder.encode(getStyles()));
            stylesInjected = true;
          }
          
          // 读取并处理流式数据
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // 处理剩余缓冲区
              if (buffer.length > 0) {
                processStreamChunk(buffer, controller, encoder);
              }
              
              // 如果思考模式还未结束，强制结束
              if (isInThinkMode) {
                controller.enqueue(encoder.encode(`</div></details>`));
                isInThinkMode = false;
              }
              
              break;
            }
            
            // 将二进制数据转换为文本并追加到缓冲区
            buffer += decoder.decode(value, { stream: true });
            
            // 处理 SSE 格式的数据
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || ''; // 将剩余部分保留在缓冲区
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.substring(6)); // 移除 'data: ' 前缀
                  
                  if (data.chunk) {
                    processStreamChunk(data.chunk, controller, encoder);
                  }
                  
                  if (data.done) {
                    // 如果思考模式还未结束，强制结束
                    if (isInThinkMode) {
                      controller.enqueue(encoder.encode(`</div></details>`));
                      isInThinkMode = false;
                    }
                    
                    // 结束流
                    controller.close();
                    return;
                  }
                  
                  if (data.error) {
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

// 注入所需的样式
function getStyles() {
  return `
<style>
  .thinking-block {
    margin: 16px 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .dark .thinking-block {
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .thinking-summary {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background-color: #f0f4f8;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-weight: 500;
    list-style: none;
  }
  
  .dark .thinking-summary {
    background-color: #2d3748;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .thinking-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    border-radius: 50%;
    background-color: #cbd5e0;
    color: #2d3748;
    font-size: 14px;
    transition: transform 0.3s ease;
  }
  
  .dark .thinking-icon {
    background-color: #4a5568;
    color: #e2e8f0;
  }
  
  .thinking-title {
    flex-grow: 1;
    font-size: 14px;
    color: #4a5568;
  }
  
  .dark .thinking-title {
    color: #e2e8f0;
  }
  
  .thinking-content {
    padding: 16px;
    color: #4a5568;
    background-color: #f7fafc;
    font-size: 14px;
    line-height: 1.6;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .dark .thinking-content {
    background-color: #1a202c;
    color: #cbd5e0;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .thinking-content pre {
    background-color: #edf2f7;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  .dark .thinking-content pre {
    background-color: #2d3748;
  }
  
  /* 使用HTML details元素的开关效果 */
  details.thinking-block > summary {
    list-style: none;
  }
  
  details.thinking-block > summary::-webkit-details-marker {
    display: none;
  }
  
  details.thinking-block > summary::after {
    content: '▼';
    display: inline-block;
    transition: transform 0.3s ease;
    margin-left: 8px;
    font-size: 12px;
  }
  
  details.thinking-block:not([open]) > summary::after {
    transform: rotate(-90deg);
  }
  
  details.thinking-block[open] > summary {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .dark details.thinking-block[open] > summary {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    .thinking-block {
      border-color: rgba(255, 255, 255, 0.1);
    }
    .thinking-summary {
      background-color: #2d3748;
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
    .thinking-title {
      color: #e2e8f0;
    }
    .thinking-content {
      background-color: #1a202c;
      color: #cbd5e0;
      border-top-color: rgba(255, 255, 255, 0.05);
    }
    .thinking-icon {
      background-color: #4a5568;
      color: #e2e8f0;
    }
  }
</style>
`;
}

// 处理流式数据块
function processStreamChunk(chunk: string, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
  if (!chunk || chunk.trim() === '') return;
  
  // 查找 <think> 和 </think> 标签的位置
  const thinkStartIndex = chunk.indexOf('<think>');
  const thinkEndIndex = chunk.indexOf('</think>');
  
  // 如果当前不在思考模式中
  if (!isInThinkMode) {
    // 检查是否有开始标签
    if (thinkStartIndex !== -1) {
      // 发送开始标签前的内容
      if (thinkStartIndex > 0) {
        controller.enqueue(encoder.encode(chunk.substring(0, thinkStartIndex)));
      }
      
      // 开始思考模式
      isInThinkMode = true;
      thinkContent = '';
      thinkCounter++;
      thinkStartId = `thinking-block-${Date.now()}-${thinkCounter}`;
      
      // 发送可折叠思考区块的开始HTML (使用HTML5 details/summary元素)
      const thinkingBlockHTML = `
<details class="thinking-block" id="${thinkStartId}" open>
  <summary class="thinking-summary">
    <div class="thinking-icon">💭</div>
    <div class="thinking-title">AI的思考过程</div>
  </summary>
  <div class="thinking-content">
`;
      
      controller.enqueue(encoder.encode(thinkingBlockHTML));
      
      // 处理开始标签后的内容
      const remainingContent = chunk.substring(thinkStartIndex + 7);
      
      // 检查剩余内容中是否有结束标签
      const remainingEndIndex = remainingContent.indexOf('</think>');
      
      if (remainingEndIndex !== -1) {
        // 思考内容
        const thoughtContent = remainingContent.substring(0, remainingEndIndex);
        thinkContent += thoughtContent;
        controller.enqueue(encoder.encode(thinkContent));
        
        // 结束思考模式
        controller.enqueue(encoder.encode(`</div></details>`));
        
        isInThinkMode = false;
        
        // 处理结束标签后的剩余内容
        const afterEndContent = remainingContent.substring(remainingEndIndex + 8);
        if (afterEndContent) {
          controller.enqueue(encoder.encode(afterEndContent));
        }
      } else {
        // 没有结束标签，继续思考模式
        thinkContent += remainingContent;
        controller.enqueue(encoder.encode(remainingContent));
      }
    } else {
      // 没有开始标签，直接发送内容
      controller.enqueue(encoder.encode(chunk));
    }
  } 
  // 如果已经在思考模式中
  else {
    // 检查是否有结束标签
    if (thinkEndIndex !== -1) {
      // 添加结束标签前的内容到思考内容
      const beforeEndContent = chunk.substring(0, thinkEndIndex);
      thinkContent += beforeEndContent;
      controller.enqueue(encoder.encode(beforeEndContent));
      
      // 结束思考模式
      controller.enqueue(encoder.encode(`</div></details>`));
      
      isInThinkMode = false;
      
      // 处理结束标签后的剩余内容
      const afterEndContent = chunk.substring(thinkEndIndex + 8);
      if (afterEndContent) {
        controller.enqueue(encoder.encode(afterEndContent));
      }
    } else {
      // 没有结束标签，继续累积思考内容
      thinkContent += chunk;
      controller.enqueue(encoder.encode(chunk));
    }
  }
}