import { groupByDate } from "@/common/util";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatItem from "./ChatItem";
import {
  EventListener,
  useEventBusContext,
} from "@/components/EventBusContext";
import { useAppContext } from "@/components/AppContext";
import { Chat } from "@/types/Chat";
import { ActionType } from "@/reducers/AppReducers";

export default function ChatList() {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const pageRef = useRef(1);
  const loadMoreRef = useRef(null);
  const hasMoreRef = useRef(false);
  const loadingRef = useRef(false);

  const groupList = useMemo(() => {
    return groupByDate(chatList);
  }, [chatList]);
  const { subscribe, unsubscribe } = useEventBusContext();
  const {
    state: { selectedChat },
    dispatch,
  } = useAppContext();

  async function getData() {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response.statusText);
      loadingRef.current = false;
      return;
    }

    const { data } = await response.json();
    hasMoreRef.current = data.hasMore;
    if (pageRef.current === 1) {
      setChatList(data.list);
    } else {
      setChatList((list) => list.concat(data.list));
    }
    pageRef.current += 1;
    loadingRef.current = false;
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const callback: EventListener = () => {
      pageRef.current = 1;
      getData();
    };
    subscribe("fetchChatList", callback);
    return () => unsubscribe("fetchChatList", callback);
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const div = loadMoreRef.current;
    if (div) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          getData();
        }
      });
      observer.observe(div);
    }
    return () => {
      if (observer && div) {
        observer.unobserve(div);
      }
    };
  }, []);

  return (
    <div className="flex-1 mb-[48px] mt-2 flex flex-col overflow-y-auto">
      {groupList.map(([date, list]) => {
        return (
          <div key={date}>
            <div className="sticky top-0 z-10 p-3 text-sm bg-gray-900 text-gray-500">
              {date}
            </div>
            <ul>
              {list.map((item) => {
                const selected = selectedChat?.id === item.id;
                return (
                  <ChatItem
                    key={item.id}
                    item={item}
                    selected={selected}
                    onSelected={(chat) => {
                      dispatch({
                        type: ActionType.UPDATE,
                        field: "selectedChat",
                        value: chat,
                      });
                    }}
                  />
                );
              })}
            </ul>
          </div>
        );
      })}
      <div ref={loadMoreRef}>&nbsp;</div>
    </div>
  );
}
