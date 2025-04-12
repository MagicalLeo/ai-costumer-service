// components/AppContext.tsx
"use client"

import { createContext, useContext, useMemo, useReducer, useEffect, ReactNode } from "react"
import { Action, State, initState, reducer } from "@/reducers/AppReducers"

// Define User type
export type User = {
  id: string;
  username: string;
  email: string;
};

// Extend State to include user info
export interface AuthState extends State {
  user: User | null;
  isAuthenticated: boolean;
}

// Extend Action types
export enum AuthActionType {
  SET_USER = "SET_USER",
  LOGOUT = "LOGOUT",
}

// Create initial auth state by extending initState
const initialAuthState: AuthState = {
  ...initState,
  user: null,
  isAuthenticated: false,
};

// Extend reducer to handle auth actions
const authReducer = (state: AuthState, action: Action | { type: AuthActionType; payload?: any }): AuthState => {
  // Handle auth-specific actions
  if (action.type === AuthActionType.SET_USER) {
    return {
      ...state,
      user: action.payload,
      isAuthenticated: true,
    };
  }
  
  if (action.type === AuthActionType.LOGOUT) {
    return {
      ...state,
      user: null,
      isAuthenticated: false,
      messageList: [],
      selectedChat: null,
    };
  }
  
  // Delegate to the original reducer for non-auth actions
  return {
    ...reducer(state, action as Action),
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  };
};

type AppContextProps = {
  state: AuthState;
  dispatch: React.Dispatch<Action | { type: AuthActionType; payload?: any }>;
}

const AppContext = createContext<AppContextProps>(null!);

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider({
  children
}: {
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  
  // Check for user authentication on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        
        if (data.code === 0) {
          dispatch({
            type: AuthActionType.SET_USER,
            payload: data.data.user,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);
  
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}