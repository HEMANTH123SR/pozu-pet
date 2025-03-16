

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hackerMedium } from "@/fonts/font";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";


export function MobileNav() {
  const pathname = usePathname();


  if (pathname === "/sign-up" || pathname === "/sign-in" || pathname === "/post") {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 h-[65px] w-full bg-darkBackground lg:hidden"
      style={hackerMedium.style}
    >
      <div className="flex w-full h-full items-center justify-between border-t border-darkBorder">
        {/* Feed Tab */}
        <div className="flex-1">
          <Link href="/" className="block">
            <div className="relative flex flex-col items-center whitespace-nowrap">
              <div className={`relative z-[inherit] shrink-0 pb-1 pt-2 ${pathname === "/" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                <DynamicSvgIcon
                  src="/home.svg"
                  isActive={false}
                  increaseStrokeWidth={pathname === "/"}
                  size={24}
                />
              </div>
              <p style={{ lineHeight: "1rem" }}
                className={`relative z-[inherit] whitespace-nowrap text-[0.67rem] transition-colors font-semibold ${pathname === "/" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                Home
              </p>
            </div>
          </Link>
        </div>

        {/* Search Tab */}
        <div className="flex-1">
          <Link href="/search" className="block">
            <div className="relative flex flex-col items-center whitespace-nowrap">
              <div className={`relative z-[inherit] shrink-0 pb-1 pt-2 ${pathname === "/search" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                <DynamicSvgIcon
                  src="/explore.svg"
                  isActive={false}
                  increaseStrokeWidth={pathname === "/search"}
                  size={24}
                />
              </div>
              <p style={{ lineHeight: "1rem" }}
                className={`relative z-[inherit] whitespace-nowrap text-[0.67rem] transition-colors font-semibold ${pathname === "/search" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                Explore
              </p>
            </div>
          </Link>
        </div>

        {/* Events Tab */}
        <div className="flex-1">
          <Link href="/events" className="block">
            <div className="relative flex flex-col items-center whitespace-nowrap">
              <div className={`relative z-[inherit] shrink-0 pb-1 pt-2 ${pathname === "/events" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                <DynamicSvgIcon
                  src="/events.svg"
                  isActive={false}
                  increaseStrokeWidth={pathname === "/events"}
                  size={24}
                />
              </div>
              <p style={{ lineHeight: "1rem" }}
                className={`relative z-[inherit] whitespace-nowrap text-[0.67rem] transition-colors font-semibold ${pathname === "/events" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                Events
              </p>
            </div>
          </Link>
        </div>

        {/* Clubs Tab */}
        <div className="flex-1">
          <Link href="/clubs" className="block">
            <div className="relative flex flex-col items-center whitespace-nowrap">
              <div className={`relative z-[inherit] shrink-0 pb-1 pt-2 ${pathname === "/clubs" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                <DynamicSvgIcon
                  src="/club.svg"
                  isActive={false}
                  increaseStrokeWidth={pathname === "/clubs"}
                  size={24}

                />
              </div>
              <p className={`relative z-[inherit] whitespace-nowrap text-xs transition-colors ${pathname === "/clubs" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                Clubs
              </p>
            </div>
          </Link>
        </div>

        {/* Inbox Tab */}
        <div className="flex-1">
          <Link href="/chat" className="block">
            <div className="relative flex flex-col items-center whitespace-nowrap">
              <div className={`relative z-[inherit] shrink-0 pb-1 pt-2 ${pathname === "/chat" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                <DynamicSvgIcon
                  src="/flex-icon-set/inbox.svg"
                  isActive={false}
                  increaseStrokeWidth={pathname === "/chat"}
                  size={24}

                />
              </div>
              <p className={`relative z-[inherit] whitespace-nowrap text-xs transition-colors ${pathname === "/clubs" ? "text-darkTextPrimary" : "text-darkTextPrimary"}`}>
                Inbox
              </p>
            </div>
          </Link>
        </div>


      </div>
    </nav>
  );
}