import React from "react";
import { hackerMedium } from "@/fonts/font";
import Link from "next/link";
import Image from "next/image";
import { UserInterface } from "@/app/[username]/lib/interface";
import { Tab } from "@/app/[username]/components/tabs";
import { ProfileCard } from "@/app/[username]/components/profile-card";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { FollowBtn } from "@/components/component/follow-btn";
import { useRouter } from "next/navigation";

export const UserProfile = ({ profile }: { profile: UserInterface }) => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col border-r h-screen overflow-y-scroll scroll-hidden">
      {/* user top small screen */}
      <div className="flex lg:hidden min-h-14 max-h-14 h-14 px-5 border-b border-darkBorder justify-start items-center space-x-5 cursor-pointer"
        onClick={() => router.back()}

      >
        <DynamicSvgIcon
          src='/arrow-left.svg'
          isActive={false}
          size={25}
        />


        <div className="h-full flex flex-col justify-center items-center">
          <span className="" style={hackerMedium.style}>{profile.fullName}</span>

        </div>

      </div>

      {/* top screen */}
      <div
        className="w-full hidden lg:flex justify-between items-center px-6 border-b min-h-14"
        style={hackerMedium.style}
      >
        <div className="flex space-x-3 justify-center items-center">
          <div className="relative h-8 w-8">
            <Image
              src={profile.profileImage || "/default-avatar.png"} // Add a default image path
              alt={profile.fullName}
              fill
              sizes="32px"
              className="rounded-full object-cover"
              priority
            />
          </div>
          <span className="capitalize">{profile.fullName}</span>
        </div>
        <div className="flex items-center justify-center space-x-4">

          <Link href={"/chat"} className="bg-darksec p-1.5 rounded-xl">
            <DynamicSvgIcon
              src="/inbox.svg"
              isActive={false}
              size={22}
            />
          </Link>

          <FollowBtn
            profile={profile}
            classname=""
          />
        </div>
      </div>

      {/* profile card */}
      <ProfileCard profile={profile} myProfile={false} />

      <Tab profile={profile} owner={false} />
    </div>
  );
};