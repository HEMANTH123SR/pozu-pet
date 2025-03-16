'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { DiscussionRightSideBarContent } from '@/app/discussions/component/right-side-menu-content';

import { ProfileRightSideBarContent } from '@/app/[username]/components/profile-right-side-bar-content';
import { SignUpCard } from './sign-up-card';

export const RightSideBar = () => {
  const { user, isSignedIn } = useUser();
  const currentPath = usePathname();
  const leftborder = currentPath.slice(0, 7);



  if (currentPath.startsWith("/sign-up/")) {
    return null
  }


  // competitions
  if (currentPath.slice(0, 14) === '/competitions/') {
    return null;
  }

  if (
    currentPath === "/sign-in" ||
    currentPath === "/sign-up" ||
    currentPath === "/what-is-sandbox" ||
    currentPath === "/test" ||
    currentPath === "/events/organize" ||
    currentPath === "/competitions/organize" ||
    currentPath === "/competitions" ||
    currentPath === "/landing" ||
    currentPath === "/chat" ||
    currentPath.slice(0, 17) == "/events/dashboard"
  ) {
    return null;
  }

  if (isSignedIn === true) {
    if (
      currentPath.slice(1, currentPath.length) === user.username ||
      currentPath === '/edit-profile' ||
      currentPath === '/people' ||
      currentPath === "/settings" ||
      currentPath === "/bookmark"
    ) {
      return (
        <div className="hidden lg:flex flex-col lg:w-[280px] lg:max-w-[280px] lg:min-w-[280px] xl:w-[355px] xl:max-w-[355px] xl:min-w-[355px]  ">
          <ProfileRightSideBarContent />
        </div>
      );
    }
  }

  return (
    <div className={`hidden  lg:flex flex-col lg:w-[280px] lg:max-w-[280px] lg:min-w-[280px] xl:w-[355px] xl:max-w-[355px] xl:min-w-[355px] ${leftborder && "border-l border-darkBorder"} `}>

      {
        isSignedIn ? <DiscussionRightSideBarContent
          onHome={currentPath === "/"}
        /> : <SignUpCard />
      }



    </div>
  );
};
