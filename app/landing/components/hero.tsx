import React from "react";
import { strawberry } from "@/fonts/font";
export const HeroTextContent = () => {
  return (
    <div className="flex flex-col space-y-5 justify-center items-center mt-20 mb-10">
      <div className="flex flex-col justify-center items-center">
        <h1
          className="text-7xl text-center  font-semibold tracking-wide leading-tight"
          style={strawberry.style}
        >
          {`Know What's Happening on `}

          <span className="text-[#0056FE] inline-block mt-2 relative">
            Your Campus 🏫
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8.5C52 2.5 159.5 2.5 298 8.5"
                stroke="#0056FE"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
      </div>

      <p className="text-lg text-slate-600 tracking-wider leading-relaxed">
        {`Student network to show and tell what you're working on`}
      </p>
    </div>
  );
};

{
  /* <h1
className="text-6xl font-bold text-gray-900 mb-6 leading-tight"
style={hackerMedium.style}
>
Where College Students <br />
<span className="text-[#0056FE] inline-block mt-2 relative">
  Create Magic! 🚀
  <svg
    className="absolute -bottom-2 left-0 w-full"
    viewBox="0 0 300 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 8.5C52 2.5 159.5 2.5 298 8.5"
      stroke="#0056FE"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
</span>
</h1> */
}

// hero text
// Know What's Happening on Your Campus

// sub hero text
//  Student network to show and tell what you're working on
