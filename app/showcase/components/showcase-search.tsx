// components/showcase-search.tsx
"use client";

import { Search } from "lucide-react";

export function SearchShowcase() {
  return (
    <div className="flex w-full p-5 items-center space-x-4 border-b">
      <Search size={28} strokeWidth={1.8} className={`text-gray-500 `} />
      <input
        className="outline-none w-full h-full bg-transparent text-lg placeholder-gray-400"
        placeholder="search showcase"
        aria-label="Search showcase"
      />
    </div>
  );
}
