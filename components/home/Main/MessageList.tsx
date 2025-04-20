// components/home/Main/MessageList.tsx
import { useAppContext } from "@/components/AppContext";
import Markdown from "@/components/common/Markdown";
import { ActionType } from "@/reducers/AppReducers";
import { useEffect, useRef } from "react";

export default function MessageList() {
  const {
    state: { messageList, streamingId, selectedChat },
    dispatch,
  } = useAppContext();
  
  // 添加引用，用于获取消息列表的DOM元素
  const messageListRef = useRef<HTMLDivElement>(null);

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
  
  // 添加处理思考区块的useEffect
  useEffect(() => {
    // 处理思考区块的交互
    function setupThinkingBlocks() {
      if (!messageListRef.current) return;
      
      // 查找所有思考区块
      const thinkingBlocks = messageListRef.current.querySelectorAll('.thinking-block');
      
      thinkingBlocks.forEach(block => {
        // 避免重复添加事件监听器
        if (block.hasAttribute('data-js-initialized')) return;
        block.setAttribute('data-js-initialized', 'true');
        
        // 为每个区块添加切换事件
        block.addEventListener('toggle', function(this: HTMLElement) {
          const summary = this.querySelector('.thinking-summary');
          const content = this.querySelector('.thinking-content');
          
          if (summary && content) {
            if (this.hasAttribute('open')) {
              // 展开时的效果
              summary.classList.add('is-open');
              // 平滑过渡效果
              (content as HTMLElement).style.maxHeight = `${(content as HTMLElement).scrollHeight}px`;
              setTimeout(() => {
                (content as HTMLElement).style.maxHeight = 'none'; // 移除高度限制，允许内容自由增长
              }, 300);
            } else {
              // 折叠时的效果
              summary.classList.remove('is-open');
              // 设置当前高度，然后动画到零
              (content as HTMLElement).style.maxHeight = `${(content as HTMLElement).scrollHeight}px`;
              setTimeout(() => {
                (content as HTMLElement).style.maxHeight = '0px';
              }, 10);
            }
          }
        });
      });
    }
    
    // 初始设置
    setupThinkingBlocks();
    
    // 使用MutationObserver监听DOM变化，处理动态添加的思考区块
    const observer = new MutationObserver(mutations => {
      let shouldSetup = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // 元素节点
              const element = node as Element;
              if (element.classList?.contains('thinking-block') || 
                  element.querySelector?.('.thinking-block')) {
                shouldSetup = true;
              }
            }
          });
        }
      });
      
      if (shouldSetup) {
        setupThinkingBlocks();
      }
    });
    
    // 开始观察文档变更
    if (messageListRef.current) {
      observer.observe(messageListRef.current, { childList: true, subtree: true });
    }
    
    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, [messageList]); // 当消息列表变化时重新设置
  
  return (
    <div className="relative w-full" ref={messageListRef}>
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