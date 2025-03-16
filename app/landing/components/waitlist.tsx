"use client";
import React from "react";
import { hackerMedium } from "@/fonts/font";
export const GetEarlyAccess = () => {
  //   const [email, setEmail] = useState("");

  //   const handleSubmit = (e: any) => {
  //     e.preventDefault();
  //     console.log("Email submitted:", email);
  //   };

  return (
    <div
      className="flex justify-center items-center"
      style={hackerMedium.style}
    >
      <div className="lowercase  p-1 rounded-sm  z-50 bg-white bg-opacity-65 ">
        <div className="rounded-xl  flex justify-center items-center h-11 sm:h-12 xl:h-14 pl-3 sm:pl-4 p-1.5 border-2 border-b-4 border-blue-800 shadow-md    group-hover:cursor-pointer">
          <input
            type="email"
            placeholder="your email address"
            className="sm:min-w-[200px] md:min-w-[250px]  outline-none font-extralight
          text-sm
          sm:text-base md:text-lg text-[#373636] h-auto  "
          />
          <button className="px-4 py-2 xl:py-1.5 min-w-24  opacity-95 rounded-xl capitalize border-2  border-blue-800 bg-primary  text-white text-sm sm:text-base">
            <span className="md:hidden">start now</span>
            <span className="hidden md:block">join the waitlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
