import { sleep } from "@/common/util";
import { MessageRequestBody } from "@/types/Chat";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as MessageRequestBody;
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
          .response// 移除空的 <think></think> 标签
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
}
