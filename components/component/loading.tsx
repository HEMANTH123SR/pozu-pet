import React from "react";
import Image from "next/image";

export const SandboxLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen ">
      {/* Logo Container */}
      <div className="mb-8 animate-fade-in-down">
        <Image
          src="/logo.png"
          alt="Sandbox Logo"
          width={70}
          height={70}
          className="w-20 h-20 rounded-xl border-blue-900"
        />
      </div>

      {/* Loading Bar Container */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="w-full h-full bg-primary animate-loading-bar" />
      </div>
    </div>
  );
};
