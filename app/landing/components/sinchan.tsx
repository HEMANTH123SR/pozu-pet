import React from "react";
import Image from "next/image";
import Link from "next/link";
import { hackerMedium } from "@/fonts/font";

interface FeatureCardProps {
  title: string;
  description: string;
  lightImage: string;
  ctaText: string;
  sectionName: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  ctaText,
  description,
  lightImage,
  sectionName,
  title,
}) => {
  return (
    <div className="flex flex-col gap-10 sm:gap-6 mt-40">
      <div className="flex flex-col gap-3 sm:gap-6">
        <div className="flex gap-2 items-start sm:items-center">
          <div className="flex flex-col flex-1 sm:flex-grow gap-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <Image
                  src="/kampus.png"
                  alt="Sandbox Logo"
                  width={50}
                  height={50}
                />
                <p className="text-2xl" style={hackerMedium.style}>
                  {sectionName}
                </p>
              </div>
            </div>
            {/* <h3 className="text-gray-1k font-semibold text-xl">{title}</h3> */}
          </div>

          <div
            className="bg-primary  border-blue-800 border-b-4 border-2 capitalize text-white 
          rounded-sm px-2 py-1 
          animate-bounce-soft hover:animate-none 
          transition-all duration-300 
          cursor-pointer 
          hover:bg-blue-600 
          hover:border-blue-900
          group"
            style={hackerMedium.style}
          >
            <span className="block group-hover:animate-ping-once">
              {ctaText}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <h5 className="text-xl" style={hackerMedium.style}>
            {title}
          </h5>
          <p className="text-gray-700 fobasent-normal text-lg">{description}</p>
        </div>
      </div>

      <div className="relative group">
        <Link target="_blank" href={"/"}>
          <div className="block">
            <Image
              src={lightImage}
              alt="Project Spotlight"
              width={1200}
              height={630}
              className="w-full rounded-2xl border-4 shadow-md"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
