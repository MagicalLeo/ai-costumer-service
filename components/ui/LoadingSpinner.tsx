// components/ui/LoadingSpinner.tsx
"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "medium",
  message = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  // Map size to pixel values
  const sizeMap = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  const spinnerSize = sizeMap[size];
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${spinnerSize} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        {/* Spinning element */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>
      </div>
      
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
}