// reducers/AppReducers.tsx
import { Chat, Message } from "@/types/Chat";

// User type for authentication
export type User = {
  id: string;
  username: string;
  email: string;
};

export type State = {
  displayNavigation: boolean;
  themeMode: "dark" | "light";
  messageList: Message[];
  streamingId: string;
  selectedChat?: Chat | null;
  // New authentication properties
  user: User | null;
  isAuthenticated: boolean;
};

export enum ActionType {
  UPDATE = "UPDATE",
  ADD_MESSAGE = "ADD_MESSAGE",
  UPDATE_MESSAGE = "UPDATE_MESSAGE",
  REMOVE_MESSAGE = "REMOVE_MESSAGE",
  // New authentication action types
  SET_USER = "SET_USER",
  LOGOUT = "LOGOUT",
  SET_MESSAGE_LIST = "SET_MESSAGE_LIST",
}

type MessageAction = {
  type:
    | ActionType.ADD_MESSAGE
    | ActionType.UPDATE_MESSAGE
    | ActionType.REMOVE_MESSAGE;
  message: Message;
};

type UpdateAction = {
  type: ActionType.UPDATE;
  field: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

// New authentication actions
type AuthAction = 
  | { type: ActionType.SET_USER; payload: User }
  | { type: ActionType.LOGOUT };

type SetMessageListAction = {
  type: ActionType.SET_MESSAGE_LIST;
  messageList: Message[];
};

export type Action = UpdateAction | MessageAction | AuthAction | SetMessageListAction;

export const initState: State = {
  displayNavigation: false,
  themeMode: "light",
  messageList: [],
  streamingId: "",
  // Initialize new authentication properties
  user: null,
  isAuthenticated: false,
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.UPDATE:
      return { ...state, [action.field]: action.value };
    case ActionType.ADD_MESSAGE: {
      const messageList = state.messageList.concat([action.message]);
      return { ...state, messageList };
    }
    case ActionType.UPDATE_MESSAGE: {
      const messageList = state.messageList.map((message) => {
        if (message.id === action.message.id) {
          return action.message;
        }
        return message;
      });
      return { ...state, messageList };
    }
    case ActionType.REMOVE_MESSAGE: {
      const messageList = state.messageList.filter(
        (message) => message.id !== action.message.id
      );
      return { ...state, messageList };
    }
    // Add new case for setting message list
    case ActionType.SET_MESSAGE_LIST: {
      return { ...state, messageList: action.messageList };
    }
    // Add new cases for authentication actions
    case ActionType.SET_USER: {
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    }
    case ActionType.LOGOUT: {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        messageList: [],
        selectedChat: undefined,
      };
    }
    default:
      throw new Error();
  }
}