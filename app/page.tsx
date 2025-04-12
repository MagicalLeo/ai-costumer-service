// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/home/Navigation";
import Main from "@/components/home/Main/Index";
import { useAppContext } from "@/components/AppContext";
import { ActionType } from "@/reducers/AppReducers";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function Home() {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        if (state.isAuthenticated) {
          setAuthenticated(true);
          setLoading(false);
          return;
        }
        
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        
        if (data.code === 0 && data.data.user) {
          dispatch({
            type: ActionType.SET_USER,
            payload: data.data.user,
          });
          setAuthenticated(true);
        } else {
          // Redirect to login if not authenticated
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Redirect to login on error
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [state.isAuthenticated, dispatch]);
  
  if (loading) {
    return <LoadingSkeleton theme={state.themeMode} />;
  }
  
  if (!authenticated) {
    return null; // Don't render anything, redirecting to login
  }
  
  return (
    <main className={`${state.themeMode} h-full flex`}>
      <Navigation />
      <Main />
    </main>
  );
}