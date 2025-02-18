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
        .response
        .replace(/<think>[\s\S]*?<\/think>/g, "");
      

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
