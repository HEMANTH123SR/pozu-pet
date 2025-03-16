"use client";
import React, { useState } from "react";
import { Search, Command } from "lucide-react";

export const SearchTriggerComponent = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="flex min-h-14 h-14 border-b">
      <div className="w-full h-full">
        <div
          className={`
            flex items-center justify-between px-4 h-full
            transition-all duration-300 ease-in-out
            ${isSearchFocused ? "bg-gray-50 shadow-sm" : "bg-gray-100"}
          `}
        >
          <div className="flex-1 flex items-center gap-3">
            <Search
              size={24}
              className={`
                transform transition-all duration-300 ease-in-out
                ${
                  isSearchFocused
                    ? "text-blue-500 scale-110 rotate-12 -translate-y-0.5"
                    : "text-gray-500 scale-100 rotate-0"
                }
              `}
            />

            <input
              className={`
                w-full bg-transparent lg:text-sm xl:text-base outline-none
                transition-all duration-300 ease-in-out
                ${
                  isSearchFocused
                    ? "text-gray-800 placeholder-blue-400 translate-x-1"
                    : "text-gray-800 placeholder-gray-500 translate-x-0"
                }
              `}
              placeholder="Find and connect.."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          <div
            className={`
              flex items-center gap-2 pl-3 border-l border-gray-200
              transition-opacity duration-300
              ${isSearchFocused ? "opacity-50" : "opacity-100"}
            `}
          >
            <div
              className={`
                flex items-center gap-1 px-2 py-1 rounded
                border border-gray-200 text-gray-600
                transition-all duration-300 ease-in-out
                hover:bg-gray-50 hover:border-gray-300
                ${isSearchFocused ? "bg-white/60" : "bg-white/80"}
              `}
            >
              <Command
                size={14}
                className={`
                  lg:hidden xl:block
                  transition-transform duration-300
                  hover:scale-110
                `}
              />
              <Command
                size={12}
                className={`
                  lg:block xl:hidden
                  transition-transform duration-300
                  hover:scale-110
                `}
              />
              <span
                className={`
                  lg:text-xs xl:text-sm
                  transition-all duration-300
                  ${isSearchFocused ? "opacity-50" : "opacity-100"}
                `}
              >
                K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
