
import { MapPin, GraduationCap } from "lucide-react";
import Link from "next/link";
import { hackerMedium } from "@/fonts/font";
import React from "react";
import { UserInterface } from "@/app/[username]/lib/interface";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { FaPenAlt } from "react-icons/fa";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { FollowBtn } from "@/components/component/follow-btn";

export const ProfileCard = ({
  profile,
  myProfile,
}: {
  profile: UserInterface;
  myProfile: boolean;
}) => {
  const getDynamicIcon = (name: string) => {
    const normalized = name.toLowerCase().replace(/\s+/g, "-");
    return `mdi:${normalized}`;
  };

  return (
    <div className="flex flex-col lg:items-center p-4 pt-6 sm:p-6">
      {/* Profile Image */}
      <div className="flex justify-between">
        <div className="relative h-20  w-20 mb-3">
          <Image
            src={profile.profileImage}
            alt={`${profile.fullName}'s profile picture`}
            fill
            className="rounded-full object-cover border-2 border-darkBorder"
            sizes="(max-width: 640px) 64px, 80px"
            priority
          />
        </div>
        <div className="flex lg:hidden justify-center items-start">

          {
            myProfile ? <Link
              href={`/edit-profile`}
              className="border flex justify-center items-center space-x-2 px-2.5 py-1.5 rounded-xl shadow-sm"
            >
              <FaPenAlt size={14} strokeWidth={2} />
              <span className="">Edit Profile</span>
            </Link> : <div className="flex space-x-4 justify-center items-center">
              <Link href={"/chat"} className="bg-darksec p-1.5 rounded-xl">
                <DynamicSvgIcon
                  src="/inbox.svg"
                  isActive={false}
                  size={25}
                />
              </Link>

              <FollowBtn
                classname=""
                profile={profile}
              />

            </div>
          }

        </div>

      </div>


      {/* Profile Info */}
      <div className="flex flex-col lg:items-center justify-center w-full space-y-2.5">
        <span style={hackerMedium.style} className="text-lg sm:text-xl font-medium">
          {profile.fullName}
        </span>

        <div className={`${profile.university ? "flex" : "hidden"}`}>
          {profile.university && (
            <div className="text-white capitalize flex justify-center items-center bg-primary px-2.5 py-0.5 text-sm rounded-full">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-1 fill-white" />
              <span
                style={hackerMedium.style}
              >{profile.university.toLowerCase()}</span>
            </div>
          )}

        </div>


        <p className="text-left lg:text-center text-base text-gray-200 mt-0.5">
          {profile.bio}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center lg:justify-center space-x-4 sm:space-x-6 mt-3 lg:text-sm">
        <div className="flex items-center space-x-1">
          <span style={hackerMedium.style}>{profile.followers.length}</span>
          <span className="font-normal">followers</span>
        </div>
        {myProfile && (
          <div className="flex items-center space-x-1">
            <span style={hackerMedium.style}>{profile.following.length}</span>
            <span className="font-normal">following</span>
          </div>
        )}
        {profile.location && (
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.8} />
            <span className="font-normal">{profile.location}</span>
          </div>
        )}
      </div>

      {/* Scrollable Skills, Interests, and Social Links */}
      <div className="w-full mt-4 lg:px-4">
        <div className="flex  gap-2 pb-2 ">
          <div className="flex gap-2 flex-wrap justify-center items-center">
            {profile.skills?.map((skill, index) => (
              <button
                key={index}
                className="text-sm lg:text-xs whitespace-nowrap font-medium leading-4 bg-darksec text-darkTextPrimary border border-primaryBorder rounded-lg inline-flex items-center justify-center gap-x-1 px-2 py-1 h-6 hover:shadow-tag-hover transition-all ease-in-out select-none group/tag"
              >
                <Icon icon={getDynamicIcon(skill)} className="w-3 h-3 flex-shrink-0" />
                <span>{skill}</span>
              </button>
            ))}


            {profile.interests?.map((interest, index) => (
              <button
                key={index}
                className="text-xs whitespace-nowrap font-medium leading-4 bg-darksec text-darkTextPrimary border border-primaryBorder rounded-lg inline-flex items-center justify-center gap-x-1 px-2 py-1 h-6 hover:shadow-tag-hover transition-all ease-in-out select-none group/tag"
              >
                <Icon icon={getDynamicIcon(interest)} className="w-3 h-3 flex-shrink-0" />
                <span>{interest}</span>
              </button>
            ))}

            {profile.socialLinks?.map((link, index) => {
              let addHttpAtStart: boolean = true;
              if (link.platformName === "Website") {
                addHttpAtStart = false;
              }
              if (link.platformName === "Twitter") {
                addHttpAtStart = false;
              }
              return <Link
                href={addHttpAtStart ? `https://${link.link}` : link.link}
                key={index}
                className="text-xs whitespace-nowrap font-medium leading-4 bg-darksec text-darkTextPrimary border border-primaryBorder rounded-lg inline-flex items-center justify-center gap-x-1 px-2 py-1 h-6 hover:shadow-tag-hover transition-all ease-in-out select-none group/tag"
              >
                <Icon icon={getDynamicIcon(link.platformName)} className="w-3 h-3 flex-shrink-0" />
                <span>{link.platformName}</span>
              </Link>
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfileCard;