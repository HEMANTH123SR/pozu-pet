

"use client";
import React, { useEffect, useState } from "react";
import { Footer } from "@/components/component/fotter";
import Link from "next/link";
import Image from "next/image";
import { hackerMedium } from "@/fonts/font";
import { BaseDiscussion } from "@/app/discussions/lib/interface";
import { SmallLoading } from "@/components/component/small-loading";
import { motion } from "framer-motion";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";


const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

export const DiscussionRightSideBarContent = ({ onHome }: { onHome: boolean }) => {
  console.log("onHome", onHome);
  const [topDiscussions, setTopDiscussions] = useState<BaseDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetch("/api/discussion/top-discussion").then((res) =>
        res.json()
      );
      if (data.message === "success") {
        setTopDiscussions(data.data);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <SmallLoading />
      </div>
    );
  }

  return (
    <div className="w-full border-r dark:text-darkTextPrimary dark:border-darkBorder h-screen overflow-hidden flex flex-col">
      <div className="flex-1 h-full overflow-y-scroll scroll-hidden pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}

        >
          <Link href={"/trending"} className="flex items-center justify-between min-h-14 h-14  group mx-4">
            <h3
              className="font-semibold flex items-center group-hover:underline "
              style={hackerMedium.style}
            >
              Trending Discussions
            </h3>

            <div className="bg-darksec border-darkBorder p-1 cursor-pointer rounded-lg border group">

              <DynamicSvgIcon
                isActive={false}
                src='/arrows-right.svg'
                size={20}
              />
            </div>

          </Link>
          <div className="space-y-3">
            {topDiscussions.slice(0, 4).map((discussion, index) => (
              <Link
                href={`/discussions/${discussion._id}`}
                key={String(discussion._id)}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative p-4   hover:bg-darksec/40 transition-all duration-300 group overflow-hidden"
                >
                  <div className="flex gap-4 relative z-10">
                    <div className="relative w-12 h-12">
                      <Image
                        src={
                          discussion.author.profileImage ||
                          "/default-avatar.png"
                        }
                        alt={`${discussion.author.fullName}'s profile picture`}
                        className="rounded-full object-cover border-2 border-darkBorder"
                        fill
                        priority={false}
                        itemProp="image"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm capitalize">
                          {discussion.author.fullName}
                        </span>
                        <span className="text-darkTextSecondery text-xs">
                          {getTimeAgo(discussion.createdAt as Date)}
                        </span>
                      </div>
                      <p
                        className="text-sm font-medium mb-2"
                        style={hackerMedium.style}
                      >
                        {discussion.title.charAt(0).toUpperCase() + discussion.title.slice(1)}
                      </p>
                      {discussion.comments.length > 0 && (
                        <div className="flex items-center gap-2 animate-slide-in-up">
                          <div className="flex -space-x-2">
                            {discussion.comments
                              .slice(0, 3)
                              .map((comment, i) => (
                                <div
                                  key={i}
                                  className="relative w-6 h-6 transition-transform duration-200 hover:scale-110 hover:z-10"
                                >
                                  <Image
                                    src={
                                      comment.user.profileImage ||
                                      "/default-avatar.png"
                                    }
                                    alt="Commenter avatar"
                                    fill
                                    sizes="24px"
                                    className="rounded-full border-2 border-darkBackground object-cover"
                                  />
                                </div>
                              ))}
                          </div>
                          <span className="text-darkTextSecondery text-xs">
                            Joined the discussion
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out blur-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
        <Footer />
      </div>
    </div>
  );
};


