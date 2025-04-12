"use client";

import { useAppContext } from "@/components/AppContext";
import { ActionType } from "@/reducers/AppReducers";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function UserInfo() {
  const { state: { user, isAuthenticated }, dispatch } = useAppContext();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        dispatch({ type: ActionType.LOGOUT });
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="relative z-10" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
            <FiUser className="w-4 h-4" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-200">{user.username}</span>
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}