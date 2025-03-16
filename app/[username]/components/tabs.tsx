"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { hackerMedium } from "@/fonts/font";
import { UserInterface } from "@/app/[username]/lib/interface";
import { DiscussionUser } from "@/app/[username]/components/tabs-component/discussion-user";


export const Tab = ({
  profile,
  owner,
}: {
  profile: UserInterface;
  owner: boolean;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = owner
    ? [
      { label: "Discussions" },
      { label: "Clubs" },
      { label: "Events" },
    ]
    : [
      { label: "Discussions" },
      { label: "Clubs" },
      { label: "Events" },
    ];

  let tabContent;
  switch (activeTab) {
    case 0:
      tabContent = <DiscussionUser userId={profile._id} />;
      break;
    default:
      tabContent = (
        <div className="p-4 h-full flex w-full justify-center items-center text-center text-gray-500">
          <span>This feature is under development. Stay tuned! 🚧</span>
        </div>
      );
  }
  return (
    <Card className="w-full bg-darkBackground">
      <CardHeader>
        <div
          className="flex space-x-7 justify-center items-center border-b w-full"
          style={hackerMedium.style}
        >
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={` text-[0.8rem] py-2  ${tab.label === "Bookmarks" ? "hidden md:block" : ""} uppercase ${activeTab === index
                ? "text-darkTextPrimary border-primary border-b-2"
                : "text-darkTextSecondery hover:text-darkTextPrimary  "
                }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>{tabContent}</CardContent>
    </Card>
  );
};
