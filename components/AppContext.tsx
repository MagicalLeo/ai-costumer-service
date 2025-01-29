"use client";
import { Action, initialState, reducer } from "@/reducers/AppReducers";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";

type State = {
  displayNavigation: boolean;
  themeMode: "dark" | "light";
};

type AppContextProbs = {
  state: State;
  dispatch: Dispatch<Action>;
};

const AppContext = createContext<AppContextProbs>(null!);

export function useAppContext() {
  return useContext(AppContext);
}
export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
