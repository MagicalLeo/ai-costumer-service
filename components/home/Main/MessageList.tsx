// components/home/Main/MessageList.tsx
import { useAppContext } from "@/components/AppContext";
import Markdown from "@/components/common/Markdown";
import { ActionType } from "@/reducers/AppReducers";
import { useEffect } from "react";

export default function MessageList() {
  const {
    state: { messageList, streamingId, selectedChat },
    dispatch,
  } = useAppContext();

  async function getData(chatId: string) {
    const response = await fetch(`/api/message/list?chatId=${chatId}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { data } = await response.json();
    dispatch({
      type: ActionType.UPDATE,
      field: "messageList",
      value: data.list,
    });
  }

  useEffect(() => {
    if (selectedChat) {
      getData(selectedChat.id);
    } else {
      dispatch({
        type: ActionType.UPDATE,
        field: "messageList",
        value: [],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);
  
  return (
    <div className="relative w-full">
      {/* <UserAuth /> */}
      <div className="w-full pt-10 pb-48 dark:text-gray-300">
        <ul>
          {messageList.map((message) => {
            const isUser = message.role === "user";
            return (
              <li
                key={message.id}
                className={`${
                  isUser
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } `}
              >
                <div className="w-full max-w-4xl mx-auto flex px-4 py-6 space-x-6 text-lg">
                  <div className="text-3xl leading-[1]">
                    {isUser ? "😄" : "🤖"}
                  </div>
                  <div className="flex-1 overflow-x-auto break-words">
                    <Markdown>{`${message.content}${
                      message.id === streamingId ? "▍" : ""
                    }`}</Markdown>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}