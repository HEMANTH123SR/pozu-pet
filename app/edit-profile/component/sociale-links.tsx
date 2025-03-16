

"use client";

import { IconType } from "react-icons";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaDribbble,
  FaYoutube,
  FaGithub,
  FaGlobe,
  FaDiscord,
  FaSpotify,
} from "react-icons/fa";

import { hackerMedium } from "@/fonts/font";

interface SocialLink {
  platformName: string;
  link: string;
}

interface SocialPlatform {
  name: string;
  Icon: IconType;
  baseUrl: string;
  description: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { name: "Instagram", Icon: FaInstagram, baseUrl: "instagram.com/", description: "Add your Instagram username" },
  { name: "LinkedIn", Icon: FaLinkedin, baseUrl: "linkedin.com/in/", description: "Add your LinkedIn username" },
  { name: "Twitter", Icon: FaTwitter, baseUrl: "https://x.com/", description: "Add your X/Twitter username" },
  { name: "Dribbble", Icon: FaDribbble, baseUrl: "dribbble.com/", description: "Add your Dribbble username" },
  { name: "YouTube", Icon: FaYoutube, baseUrl: "youtube.com/@", description: "Add your YouTube handle" },
  { name: "GitHub", Icon: FaGithub, baseUrl: "github.com/", description: "Add your GitHub username" },
  { name: "Website", Icon: FaGlobe, baseUrl: "https://", description: "Add your full website URL" },
  { name: "Discord", Icon: FaDiscord, baseUrl: "discord.com/users/", description: "Add your Discord user ID" },
  { name: "Spotify", Icon: FaSpotify, baseUrl: "open.spotify.com/user/", description: "Add your Spotify username" },
];

export const SocialLinkComponent = ({
  socialLinks,
  setSocialLinks,
}: {
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
}) => {
  // Helper function to extract username from full URL
  const extractUsername = (platformName: string, fullUrl: string): string => {
    if (!fullUrl) return '';

    const platform = SOCIAL_PLATFORMS.find(p => p.name === platformName);
    if (!platform) return fullUrl;

    // If it's the website field, return the full URL
    if (platformName === "Website") return fullUrl;

    // For other platforms, extract the username part
    if (fullUrl.includes(platform.baseUrl)) {
      return fullUrl.split(platform.baseUrl)[1];
    }

    return fullUrl; // Return as is if can't extract
  };

  const handleLinkChange = (platformName: string, link: string) => {
    const existingLinkIndex = socialLinks.findIndex(
      (sl) => sl.platformName === platformName
    );

    if (existingLinkIndex !== -1) {
      // Update existing link
      const updatedLinks = [...socialLinks];
      updatedLinks[existingLinkIndex] = { platformName, link };
      setSocialLinks(updatedLinks);
    } else {
      // Add new link
      setSocialLinks([...socialLinks, { platformName, link }]);
    }
  };

  return (
    <div className="flex flex-col space-y-8 pb-12 ">
      <div className="flex flex-col justify-center items-center pt-5">
        <div
          className="flex justify-center items-center w-full text-lg "
          style={hackerMedium.style}
        >
          Social Links
        </div>
        <p className="text-sm text-gray-400 text-center mb-4 lg:w-10/12">
          {`   Just enter your username for each platform (not the full URL).
        For example, enter "johndoe" instead of "github.com/johndoe".`}

        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {SOCIAL_PLATFORMS.map((platform) => {
          // Find the link for this platform
          const fullUrl = socialLinks.find((sl) => sl.platformName === platform.name)?.link || "";

          // Extract just the username portion
          const displayValue = extractUsername(platform.name, fullUrl);

          return (
            <div
              key={platform.name}
              className="w-full px-3 outline-none rounded-lg border py-1 transition-all duration-100 
               text-gray-1k hover:border-gray-300 
              focus-within:border-gray-300 shadow-input hover:shadow-input-hover 
              focus-within:shadow-input flex items-center text-base font-light overflow-hidden"
            >
              <label
                htmlFor={platform.name}
                className="select-none text-gray placeholder-gray-400"
              >
                <div className="flex items-center">
                  <platform.Icon className="mr-2" size={19} />
                </div>
              </label>
              <div className="flex flex-1 items-center">
                <span className="text-darkTextPrimary">{platform.baseUrl}</span>
                <input
                  type="text"
                  id={platform.name}
                  className="outline-none py-1.5 px-1 rounded-md font-medium w-full 
                  text-white bg-darkBackground border-gray-300"
                  placeholder={platform.description}
                  value={displayValue}
                  onChange={(e) =>
                    handleLinkChange(platform.name, e.target.value)
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

