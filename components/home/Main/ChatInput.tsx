// components/home/Main/ChatInput.tsx
import Button from "@/components/common/Button";
import { MdRefresh } from "react-icons/md";
import { PiLightningFill, PiStopBold } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import TextareaAutoSize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/components/AppContext";
import { Message, MessageRequestBody } from "@/types/Chat";
import { ActionType } from "@/reducers/AppReducers";
import {
  useEventBusContext,
  EventListener,
} from "@/components/EventBusContext";
import { useRouter } from "next/navigation";

export default function ChatInput() {
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 控制整個加載狀態
  const {
    state: { messageList, streamingId, selectedChat, isAuthenticated },
    dispatch,
  } = useAppContext();
  const { publish, subscribe, unsubscribe } = useEventBusContext();
  const stopRef = useRef(false);
  const chatIdRef = useRef("");
  const router = useRouter();

  // Check authentication status and redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const callback: EventListener = (data) => {
      console.log("createNewChat{}", data);
      handleSend(data);
    };
    subscribe("createNewChat", callback);
    return () => unsubscribe("createNewChat", callback);
  }, []);

  useEffect(() => {
    if (chatIdRef.current === selectedChat?.id) {
      return;
    }
    chatIdRef.current = selectedChat?.id ?? "";
    stopRef.current = false;
  }, [selectedChat]);

  // 根據streamingId更新加載狀態
  useEffect(() => {
    if (streamingId !== "") {
      setIsLoading(true);
    } else {
      // 當streamingId為空時，需要一個短暫的延遲才能重置狀態
      // 這是為了防止響應完成後立即重新啟用按鈕
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [streamingId]);

  async function createOrUpdateMessage(message: Message) {
    const response = await fetch("/api/message/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    // console.log(response);

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    if (!response.body) {
      console.log("body error");
      return;
    }

    const { data } = await response.json();
    if (!chatIdRef.current) {
      chatIdRef.current = data.message.chatId;
      publish("fetchChatList");
      dispatch({
        type: ActionType.UPDATE,
        field: "selectedChat",
        value: { id: chatIdRef.current },
      });
    }
    return data.message;
  }

  async function deleteMessage(id: string) {
    const response = await fetch(`/api/message/delete?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }

    const { code } = await response.json();
    return code === 0;
  }

  async function handleSend(content: string) {
    // 立即設置加載狀態，防止重複提交
    setIsLoading(true);

    try {
      const message = await createOrUpdateMessage({
        id: "",
        role: "user",
        content,
        chatId: chatIdRef.current,
      });

      // Check if this is the first message in the conversation
      const isFirstMessage = messageList.length === 0;
      dispatch({ type: ActionType.ADD_MESSAGE, message });
      const messages = messageList.concat([message]);
      send(messages);

      // Only generate title on the first message
      if (isFirstMessage) {
        updateChatTitle(messages);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setIsLoading(false); // 發生錯誤時重置加載狀態
    }
  }

  async function updateChatTitle(messages: Message[]) {
    const titleMessage: Message = {
      id: "",
      role: "user",
      content: "使用 5 到 10 个字直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回'新对话'",
      chatId: chatIdRef.current
    }
    const chatId = chatIdRef.current;
    const body: MessageRequestBody = { messages: [...messages, titleMessage] };
    let response = await fetch("/api/chat/updatetitle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log(response);

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    if (!response.body) {
      console.log("body error");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let title = "";
    let finalTitle = "";

    while (!done) {
      const result = await reader.read();
      done = result.done;
      const chunk = decoder.decode(result.value);
      title += chunk;

      // 檢查是否有特殊標記表示最終處理後的標題
      if (chunk.includes("--- 處理後標題 ---")) {
        const parts = title.split("--- 處理後標題 ---");
        if (parts.length > 1) {
          finalTitle = parts[1].trim();
        }
      }
    }

    // 如果找到了處理後標題，使用它；否則使用傳統的處理方式
    if (finalTitle) {
      title = finalTitle;
    } else {
      // 備選處理：萬一後端沒有發送處理後標題
      title = title
        .replace(/<[^>]*>/g, '') // 移除HTML標籤
        .replace(/<think>[\s\S]*?<\/think>/g, '') // 移除思考標籤
        .replace('### Response:', '') // 移除多餘的標題
        .trim() // 移除前後空白
        .replace(/\s+/g, ' '); // 將多個空白替換為單個空白

      // 限制標題長度
      const MAX_TITLE_LENGTH = 100;
      if (title.length > MAX_TITLE_LENGTH) {
        title = title.substring(0, MAX_TITLE_LENGTH);
      }
    }

    console.log("Final title to update:", title);

    response = await fetch("/api/chat/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: chatId, title }),
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    if (code === 0) {
      publish("fetchChatList");
    }
  }

  async function resend() {
    // 檢查是否已經正在加載中
    if (isLoading) {
      console.log("Already loading, ignoring resend request");
      return;
    }

    // 立即設置加載狀態，防止重複點擊
    setIsLoading(true);

    try {
      const messages = [...messageList];
      if (
        messages.length !== 0 &&
        messages[messages.length - 1].role === "assistant"
      ) {
        const result = await deleteMessage(messages[messages.length - 1].id);
        if (!result) {
          console.log("delete error");
          setIsLoading(false); // 發生錯誤時，重置加載狀態
          return;
        }
        dispatch({
          type: ActionType.REMOVE_MESSAGE,
          message: messages[messages.length - 1],
        });
        messages.slice(messages.length - 1, 1);
      }
      console.log("RESENDING MESSAGE...", messages);
      send(messages);
    } catch (error) {
      console.error("Error in resend:", error);
      setIsLoading(false); // 發生錯誤時重置加載狀態
    }
  }
  // 修改 send 函數來處理動態思考內容
  async function send(message: Message[]) {
    stopRef.current = false;
    const body: MessageRequestBody = { messages: message };
    setMessageText("");
    const controller = new AbortController();
    console.log("SENDING MESSAGE...", message[message.length - 1].content);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log(response.statusText);
        setIsLoading(false);
        return;
      }
      if (!response.body) {
        console.log("body error");
        setIsLoading(false);
        return;
      }

      const responseMessage = await createOrUpdateMessage({
        id: "",
        role: "assistant",
        content: "",
        chatId: chatIdRef.current,
      });
      dispatch({ type: ActionType.ADD_MESSAGE, message: responseMessage });
      dispatch({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: responseMessage.id,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let content = "";

      while (!done) {
        if (stopRef.current) {
          controller.abort();
          break;
        }
        const result = await reader.read();
        done = result.done;
        const chunk = decoder.decode(result.value);

        // 添加新內容到已有內容
        content += chunk;

        // 更新消息內容
        dispatch({
          type: ActionType.UPDATE_MESSAGE,
          message: { ...responseMessage, content },
        });
      }

      // 保存完整內容到數據庫
      await createOrUpdateMessage({
        ...responseMessage,
        content,
      });
      dispatch({ type: ActionType.UPDATE, field: "streamingId", value: "" });
    } catch (error) {
      console.error("Error during send operation:", error);
      setIsLoading(false);
    }
  }

  // Handle key press for Enter key to send messages
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      if (messageText.trim() !== '' && !isLoading) {
        handleSend(messageText);
        publish("fetchChatList");
      }
    }
  };

  // 判斷按鈕是否應該被禁用
  const isButtonDisabled = isLoading || streamingId !== "";

  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4">
        {messageList.length !== 0 &&
          (streamingId !== "" ? (
            <Button
              icon={PiStopBold}
              variant="primary"
              className="font-medium bg-red-500 hover:bg-red-600"
              onClick={() => {
                stopRef.current = true;
              }}
            >
              Stop
            </Button>
          ) : (
            <Button
              icon={MdRefresh}
              variant="primary"
              className={`font-medium ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isButtonDisabled}
              onClick={resend}
            >
              Ask Again
            </Button>
          ))}

        <div className="flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-2.5">
          <div className="mx-3 mb-2">
            <PiLightningFill />
          </div>
          <TextareaAutoSize
            className="outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0"
            placeholder="Input your question..."
            rows={1}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            className="mx-3 !rounded-lg"
            icon={FiSend}
            variant="primary"
            disabled={messageText.trim() === "" || isButtonDisabled}
            onClick={() => {
              handleSend(messageText);
              publish("fetchChatList");
            }}
          />
        </div>
        <footer className="text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6">
          ©️{new Date().getFullYear()}&nbsp;
          <a
            className="font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 dark:border-gray-200 dark:hover:border-gray-200/0 animated-underline"
            href="https://github.com/MagicalLeo"
            target="_blank"
          >
            Powered by Codebat
          </a>
        </footer>
      </div>
    </div>
  );
}