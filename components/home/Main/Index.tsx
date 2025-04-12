// components/home/Main/Index.tsx
"use client";
import { useAppContext } from "@/components/AppContext";
import ChatInput from "./ChatInput";
import Menu from "./Menu";
import MessageList from "./MessageList";
import Welcome from "./Welcome";
import UserInfo from "./UserInfo";
import { ClickToComponent } from "click-to-react-component";

export default function Main() {
  const {
    state: { selectedChat },
  } = useAppContext();
  return (
    <div className="flex-1 relative">
      <main className="overflow-y-auto w-full h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <ClickToComponent />
        <div className="relative z-40">
          <Menu />
          <UserInfo />
        </div>

        <div className="relative z-30">
          {!selectedChat && <Welcome />}
        </div>
        <MessageList />
        <ChatInput />
      </main>
    </div>
  );
}