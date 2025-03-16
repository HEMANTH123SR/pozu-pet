import { Sparkle, Plus } from "lucide-react";

export function ShowCaseHeader() {
  return (
    <div className="flex w-full items-center justify-between h-12 max-h-12 min-h-12 border-b px-7 space-x-5">
      <div className="flex justify-center items-center space-x-2">
        <Sparkle size={22} strokeWidth={1.8} className="text-gray-700" />
        <span className="text-lg font-bold">Showcase </span>
      </div>
      <div className="h-full flex justify-center items-center space-x-5">
        <button className="border-2 py-0.5 space-x-1 flex justify-center items-center px-4 rounded-full text-sm hover:bg-gray-50 transition-colors">
          <Plus size={14} strokeWidth={2.2} className="text-blue-500" />
          <span>Showcase</span>
        </button>
      </div>
    </div>
  );
}
