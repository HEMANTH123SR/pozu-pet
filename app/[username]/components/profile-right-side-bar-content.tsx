"use client";
import React from 'react';
import { Bookmark } from 'lucide-react';
import { FaPenAlt } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { hackerMedium, moreSugar } from '@/fonts/font';
import { usePathname } from "next/navigation";
import { Button } from '@/components/ui/button';
import { PiUsersFourFill } from "react-icons/pi";
import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon';

interface SocialShareData {
  title: string;
  text: string;
  url: string;
}

export const ProfileRightSideBarContent = () => {
  const path = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();

  const menuItems = [
    {
      icon: <FaPenAlt className='fill-darkTextPrimary' size={15} />,
      title: "Edit Profile",
      description: "Update your personal information",
      link: "/edit-profile",
      ariaLabel: "Navigate to edit profile page"
    },
    {
      icon: <RiSettings3Fill size={20} className='fill-darkTextPrimary' />,
      title: "Settings",
      description: "Manage account and privacy",
      link: "/settings",
      ariaLabel: "Navigate to settings page"
    },
    {
      icon: <MdVerified size={20} className='fill-darkTextPrimary' />,
      title: "Verification",
      description: "Verify your student status",
      link: "/verify",
      ariaLabel: "Navigate to verification page"
    },
    {
      icon: <Bookmark size={20} className='fill-darkTextPrimary' />,
      title: "Bookmarks",
      description: "View saved posts and events",
      link: "/bookmark",
      ariaLabel: "Navigate to bookmarks page"
    },
    {
      icon: <MdSpaceDashboard size={20} className='fill-darkTextPrimary' />,
      title: "Dashboard",
      description: "Track events and competitions",
      link: "/dashboard",
      ariaLabel: "Navigate to dashboard page"
    },
    {
      icon: <PiUsersFourFill size={20} />,
      title: "Invite Friends",
      description: "Grow your campus network",
      link: "/invite",
      ariaLabel: "Navigate to invite friends page"
    },
  ];

  const handleShare = async () => {
    const shareData: SocialShareData = {
      title: 'Join me on Kampus!',
      text: `Hey! I'm using Kampus to discover campus events and connect with other students. Join me!`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${user?.username}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <aside
      className="w-full bg-[#0B0B0A] border-r border-[#303130] h-screen right-0 top-0 overflow-hidden"
      role="complementary"
      aria-label="User profile navigation"
    >
      <div className="h-full p-4 overflow-y-auto scroll-hidden">
        <div className="space-y-4">
          <div className="pb-4 border-b border-[#303130]">
            <div className="flex flex-col space-y-3">
              <h1 className='capitalize text-xl font-light' style={moreSugar.style}>
                Oi {user.firstName} Your friends are missing out on the good stuff - help them find Kampus! 🔥
              </h1>
              <Button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                aria-label="Share Kampus with friends"
              >
                <DynamicSvgIcon
                  size={18}
                  isActive={false}
                  src='/share.svg'
                />
                <span style={hackerMedium.style}>Share Kampus</span>
              </Button>
            </div>
          </div>

          <nav className="space-y-4" role="navigation" aria-label="User menu">
            <Link
              href={`/${user.username}`}
              className={`flex items-center space-x-3 p-3 py-1.5 rounded-lg hover:bg-darksec transition-colors duration-200 ${user.username === path.slice(1, path.length) && "bg-darksec"}`}
              aria-current={user.username === path.slice(1, path.length) ? "page" : undefined}
            >
              <div className="text-darkTextPrimary mt-1 relative h-7 w-7">
                <Image
                  src={user.imageUrl}
                  alt={`${user.fullName}'s profile picture`}
                  fill
                  sizes="28px"
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <div>
                <h3 className="text-darkTextPrimary font-medium" style={hackerMedium.style}>
                  {user.fullName}
                </h3>
                <p className="text-darkTextSecondery text-sm">
                  View your profile and activity
                </p>
              </div>
            </Link>

            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={`flex items-center space-x-3 p-3 py-1.5 rounded-lg hover:bg-darksec transition-colors duration-200 ${item.link === path && "bg-darksec"}`}
                aria-label={item.ariaLabel}
                aria-current={item.link === path ? "page" : undefined}
              >
                <div className="text-darkTextPrimary mt-1">{item.icon}</div>
                <div>
                  <h3 className="text-darkTextPrimary font-medium">{item.title}</h3>
                  <p className="text-darkTextSecondery text-sm">{item.description}</p>
                </div>
              </Link>
            ))}
          </nav>

          <footer className="pt-4 border-t border-[#303130] mt-6"
            style={moreSugar.style}
          >
            <div className="text-[#666D70] text-sm text-center">
              <p className="mb-2">
                {`Know What's Happening on Your Campus `}

              </p>
            </div>
          </footer>
        </div>
      </div>
    </aside>
  );
};