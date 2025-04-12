// components/ui/LoadingSkeleton.tsx
"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingSkeletonProps {
  fullScreen?: boolean;
  message?: string;
  theme?: string;
}

export default function LoadingSkeleton({
  fullScreen = true,
  message = "Loading your dashboard...",
  theme = "",
}: LoadingSkeletonProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center"
    : "w-full h-full flex items-center justify-center min-h-[400px]";

  return (
    <div className={`${theme} ${containerClasses}`}>
      <div className="relative p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-auto flex flex-col items-center justify-center">
        <LoadingSpinner size="large" message="" />
        
        <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white">
          {message}
        </h3>
        
        <div className="mt-8 w-full space-y-3">
          {/* Simulated content loading bars */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full overflow-hidden">
            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse w-2/3"></div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full overflow-hidden">
            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse w-1/2"></div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full overflow-hidden">
            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}