"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { UserInterface } from "@/app/[username]/lib/interface";
import { hackerMedium, strawberry } from "@/fonts/font";
import Image from "next/image";
import { motion } from "framer-motion";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import React, { useEffect, useState } from "react";


// Menu Item Interface
interface MenuItem {
  href: string;
  text: string;
  ariaLabel: string;
  notificationCount?: number;
  svg: string;
}

// Menu Items Configuration
const menuItems: MenuItem[] = [
  {
    href: "/",
    text: "Home",
    ariaLabel: "Go to Discover",
    svg: "/home.svg"
  },
  {
    href: "/chat",
    text: "Inbox",
    ariaLabel: "Go to Inbox",
    svg: "/flex-icon-set/inbox.svg"
  },
  {
    href: "/search",
    text: "Search",
    ariaLabel: "Go to Search",
    svg: "/explore.svg"
  },
  {
    href: "/events",
    text: "Events",
    ariaLabel: "Go to Events",
    svg: "/events.svg"
  },
  {
    href: "/clubs",
    text: "Clubs",
    ariaLabel: "Go To Clubs",
    svg: "/club.svg"
  },
];



export const SideMenu = () => {

  const { user, isSignedIn } = useUser();
  const [profile, setProfile] = useState<UserInterface | null>(null);
  const [mounted, setMounted] = useState(false);

  const currentPath = usePathname();
  const filteredPath = currentPath.split("/").filter((data) => data.trim())[0];

  useEffect(() => {
    setMounted(true);
    (async () => {
      if (isSignedIn) {
        const userDataResponse = await fetch(
          `/api/user/get-user/${user?.username}`
        ).then((res) => res.json());
        const userData: UserInterface = userDataResponse.data;
        if (userDataResponse.success) {
          setProfile(userData);
        }
      }
    })();
  }, [isSignedIn, user?.username]);


  if (currentPath.startsWith("/sign-up/")) {
    return null
  }

  // Check if we should hide the menu (same conditions as before)
  if (
    currentPath === "/home-blue" ||
    currentPath === "/home-blue-white" ||
    filteredPath === "auth" ||
    currentPath === "/sign-in" ||
    currentPath === "/sign-up" ||
    currentPath === "/what-is-sandbox" ||
    currentPath === "/test" ||
    // currentPath === "/chat" ||
    currentPath === "/landing"
  ) {
    return null;
  }

  return (
    <aside
      className={`min-w-[265px] max-w-[265px] border-r dark:border-darkBorder flex-shrink-0 h-screen hidden lg:flex lg:flex-col justify-between lg:pl-6 xl:pl-0 
      transform transition-all duration-700 ease-out overflow-hidden
      ${mounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      style={hackerMedium.style}
    >
      {/* Main content container with scroll */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Logo and Brand - Fixed */}
        <div
          className={`flex-shrink-0 justify-between items-center pr-6 transition-all duration-700 delay-100 transform
          ${mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
        >

          <Link
            href="/"
            className="mt-2 mb-3 flex space-x-1.5 items-center justify-start transition-transform duration-300 ease-out hover:translate-y-1.5"
            aria-label="Go to kampus.social Home"
          >


            <Image
              src="/logo.png"
              // src={"/test-logo-three.png"}
              // src={"/logo/2.png"}
              alt="Kampus Logo"
              width={48}
              height={48}
              className="rounded-2xl"


            />
            <span
              className={`${strawberry.className} text-black  dark:text-darkTextPrimary text-[2rem]`}
            >
              kampus
            </span>
          </Link>
        </div>

        {/* Scrollable content area */}
        <div className="flex-grow overflow-y-auto scroll-hidden">
          {/* Navigation Links */}
          <nav className="flex flex-col w-full text-text_primary space-y-2 justify-start">
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.text}
                  href={item.href}
                  aria-label={item.ariaLabel}
                  className={`flex items-center w-full text-sand-black-800 dark:text-darkTextPrimary justify-start space-x-3 py-3 group transition-all duration-500 ease-out 
                  transform ${mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
                  style={{
                    transitionDelay: `${(index + 2) * 100}ms`,
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="hidden xl:block">
                    <DynamicSvgIcon
                      src={item.svg}
                      isActive={false}
                      increaseStrokeWidth={isActive}
                      size={26}
                    />
                  </div>
                  <div className="xl:hidden">
                    <DynamicSvgIcon
                      src={item.svg}
                      isActive={false}
                      increaseStrokeWidth={isActive}
                      size={24}
                    />
                  </div>
                  <span className="text-sm xl:text-base group-hover:pl-2 transition-all duration-300 ease-out">
                    {item.text}
                  </span>
                  {item.notificationCount && (
                    <span className="bg-primary text-white rounded-full px-2 py-1 text-xs 
                      inline-flex items-center justify-center
                      transition-transform duration-300
                      hover:scale-110 
                      animate-[bounce_2s_ease-in-out_infinite]
                      shadow-sm"
                    >
                      {item.notificationCount}+
                    </span>
                  )}
                </Link>
              );
            })}
            {isSignedIn && <VerifyActionDefault />}
          </nav>
        </div>
      </div>

      {/* Profile Section - Fixed at bottom */}
      <div
        className={`flex-shrink-0 transition-all duration-700 delay-800 transform border-t dark:border-darkBorder pt-2
        `}
      >
        {profile && (
          <div className="flex mb-1 flex-col dark:text-darkTextPrimary space-y-1.5 transition-all duration-300 ease-out">
            <Link
              href={`/${profile.username}`}
              className="flex justify-start items-center space-x-2 py-3 capitalize rounded-lg transition-all duration-300 ease-out"
            >
              <Image
                src={profile.profileImage}
                alt="Profile"
                width={48}
                height={48}
                className="h-11 w-11 xl:w-12 xl:h-12 rounded-full border-2 hover:scale-105 transition-transform duration-300 ease-out"
              />
              <div className="flex flex-col xl:space-y-1">
                <div className="flex items-center">
                  <span className="lg:hidden xl:block text-[1.1rem]">
                    {profile.fullName}
                  </span>
                  <span className="xl:hidden text-[0.92rem]">
                    {profile.username}
                  </span>
                </div>
                <Link
                  href="/network"
                  className="flex text-[0.72rem] justify-start space-x-2 items-center group hover:pl-1 transition-all duration-300 ease-in-out"
                >
                  <span>
                    {profile.followers.length + " "}
                    <span className="text-slate-500 dark:text-darkTextSecondery group-hover:text-white">
                      Followers
                    </span>
                  </span>
                  <span className="lg:hidden xl:block">
                    {profile.following.length + " "}
                    <span className="text-slate-500 dark:text-darkTextSecondery group-hover:text-white">
                      Following
                    </span>
                  </span>
                </Link>
              </div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};





export const VerifyActionDefault = () => {
  const router = useRouter();

  return (
    <div className="w-full flex justify-start items-center cursor-pointer"
      onClick={() => {
        router.push("/verify")
      }}
    >
      <motion.div
        className="relative flex flex-col justify-center items-center bg-darksec rounded-xl py-5 px-2 border-2 border-darkBorder z-50 lg:w-52 xl:w-11/12 overflow-hidden transition-all duration-300"
        whileHover={{
          y: -4,
          boxShadow: "0px 10px 20px rgba(164, 64, 251, 0.2)",
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/id-card.png"
          alt="Verify"
          width={150}
          height={150}
          className="w-[60%] h-auto"
          priority
        />
        <h3 className="text-darkTextPrimary text-sm uppercase pb-1 font-semibold">
          Verify Student Identity
        </h3>
        <p className="text-darkTextPrimary text-xs text-center">
          {`Prove you're a student to unlock exclusive perks, opportunities, and student-only benefits.`}
        </p>
        <button
          type="button"
          className="gap-1 mt-2 flex items-center font-semibold border transition-all ease-in duration-200 whitespace-nowrap text-center select-none disabled:opacity-50 disabled:cursor-not-allowed gap-x-1 text-xs leading-4 py-1 h-6 rounded-lg px-3 text-gray-900 bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white"
        >
          Get Verified
          <span className="-mr-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19.5833M19.5833 12L12.5833 5M19.5833 12L12.5833 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </span>
        </button>
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 opacity-50 blur-xl"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.div>
    </div>
  );
};