import { sleep } from "@/common/util";
import { MessageRequestBody } from "@/types/Chat";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as MessageRequestBody;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const content = messages[messages.length - 1].content;

      const response = await fetch("http://localhost:8080/backend/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!response.body) {
        console.log(response.statusText);
        return;
      } else {
        const responseText = await response.text();
        console.log(responseText)
        for (let i = 0; i < responseText.length; i++) {
          await sleep(100);
          controller.enqueue(encoder.encode(responseText[i]));
        }
        controller.close();
      }
    },
  });
  return new Response(stream);
}
