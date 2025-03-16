

"use client";
import React from 'react';
import { SignUp } from "@clerk/nextjs";
import { hackerMedium, strawberry } from "@/fonts/font";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { HeaderAuthTop } from "@/components/component/header-auth-top";
import { usePathname } from "next/navigation";

const HeroTextContent = () => {
  return (
    <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-5 justify-center items-center px-4 sm:px-6 md:px-8">
      <div className="flex flex-col justify-center items-center w-full">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl text-center font-semibold tracking-wide leading-tight"
          style={strawberry.style}
        >
          <span className="block mb-2 sm:mb-3 md:mb-4">
            Join Kampus, the student network
          </span>
          <span className="text-primary inline-block relative">
            built for you  👋
            <svg
              className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M2 8.5C52 2.5 159.5 2.5 298 8.5"
                stroke="#5e04d5"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
      </div>
    </div>
  );
};

const AvatarCirclesDemo = () => {
  const avatars = [
    { imageUrl: "/users-avatars/cto-b.png", profileUrl: "/" },
    { imageUrl: "/users-avatars/clo.jpeg", profileUrl: "/" },
    { imageUrl: "/users-avatars/pritam.jpeg", profileUrl: "/" },
    { imageUrl: "/users-avatars/gowtham.jpeg", profileUrl: "/" },
    { imageUrl: "/users-avatars/sudhi.png", profileUrl: "/" },
    { imageUrl: "/users-avatars/divyansh.png", profileUrl: "/" },
    { imageUrl: "/users-avatars/sundhan.jpeg", profileUrl: "/" },
  ];

  return (
    <div className="scale-75 sm:scale-90 md:scale-100 flex justify-center w-full">
      <AvatarCircles numPeople={100} avatarUrls={avatars} />
    </div>
  );
};

export default function Page() {
  const path = usePathname();
  const inUserNamePath = path.startsWith("/sign-up/continue");

  const getSignUpAppearance = () => {
    const baseAppearance = {
      variables: {
        colorBackground: "#0B0B0A",
        colorPrimary: "#5E04D5",
        colorTextOnPrimaryBackground: "#FDFCFD",
        colorTextSecondary: "#666D70",
        borderRadius: "0.5rem",
        fontSize: "1.01rem",

      },

      elements: {

        formButtonPrimary:
          "bg-[#5E04D5] hover:bg-[#5E04D5]/90 text-[#FDFCFD] w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all duration-200",
        socialButtonsBlockButton:
          "bg-[#262626] hover:bg-[#303130] text-[#FDFCFD] w-full px-4 sm:px-6 py-3 sm:py-4 text-xl font-medium transition-all duration-200",
        formFieldInput:
          "bg-[#262626] text-[#FDFCFD] px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg focus:ring-1 focus:ring-[#5E04D5] transition-all duration-200",
        card: inUserNamePath ? "bg-transparent p-10 m-0 " : " p-0 m-0 border-none rounded-none",
        header: inUserNamePath ? "block mt-4 mb-6" : "hidden",
        footer: "hidden",
        dividerLine: "hidden",
        dividerText: "hidden",
        formFieldLabel: "text-[#666D70] text-sm sm:text-base mb-1.5 sm:mb-2",
        identityPreviewText: "text-base sm:text-lg",
        formFieldLabelRow: "mb-1.5 sm:mb-2",
        headerTitle: inUserNamePath ? "text-2xl font-semibold mb-2 text-[#FDFCFD]" : "",
        headerSubtitle: inUserNamePath ? "text-[#666D70] text-base" : "",
        formFieldAction: "text-[#5E04D5] hover:text-[#5E04D5]/80 text-sm",
        formFieldInput__username: "text-lg font-medium",
        logoBox: inUserNamePath ? "hidden" : "block",
        headerLogoBox: inUserNamePath ? "hidden" : "block",
        headerLogo: inUserNamePath ? "hidden" : "block"
      }
    };

    return baseAppearance;
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0B0B0A] text-[#FDFCFD] border-x border-darkBorder">


      <HeaderAuthTop />

      <section className="flex flex-1 flex-col justify-center items-center w-full py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-5xl px-4 sm:px-6 md:px-8 flex flex-col items-center">
          {!inUserNamePath && (
            <>
              <div className="w-full flex justify-center">
                <AvatarCirclesDemo />
              </div>

              <p
                className="text-[#666D70] text-center text-sm sm:text-base mt-2 sm:mt-3 mb-4 sm:mb-6 w-full"
                style={hackerMedium.style}
              >
                The above students joined Kampus. Your move, chief.
              </p>

              <HeroTextContent />
            </>
          )}

          <div className={`w-full flex justify-center ${inUserNamePath ? "" : "mt-6 sm:mt-8"}`}>
            <div className="w-full max-w-md">
              <SignUp
                appearance={getSignUpAppearance()}
              />
            </div>
          </div>

          <p className="text-[#666D70] text-center text-xs sm:text-sm mt-6 sm:mt-8 px-4 w-full">
            By joining, you agree to our Terms of Service and Privacy Policy
          </p>

          <p className="text-[#666D70] text-center mt-4 sm:mt-6 text-sm sm:text-base w-full">
            Already exploring with us? <a href="/sign-in" className="text-[#5E04D5] hover:text-[#5E04D5]/80 transition-all duration-200">Sign in</a>
          </p>
        </div>
      </section>
      <div className='h-6 min-h-6 block lg:hidden border-t w-full border-darkBorder'></div>
    </div>
  );
}