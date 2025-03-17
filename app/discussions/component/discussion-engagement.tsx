"use client";
import { Discussion } from "@/app/discussions/lib/interface";
import { VoteButtons } from "@/app/discussions/component/discussion-vote-buttons";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import ShareDialog from "@/components/component/shareDialog";

export function DiscussionEngagement({
  discussionId,
  upvotes,
  comments,
}: {
  discussionId: string;
  upvotes: string[];
  comments: Discussion["comments"];
  numViews: number;
}) {
  const { user, isSignedIn } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  // Check if the discussion is already bookmarked by the user
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!isSignedIn) return;

      try {
        const response = await fetch(`/api/user/get-bookmarks`);
        const data = await response.json();

        if (response.ok) {
          setIsBookmarked(
            data.bookmarks.some((bookmark: string) => bookmark === discussionId)
          );
        }
      } catch (error) {
        console.error("Failed to fetch bookmark status", error);
      }
    };

    checkBookmarkStatus();
  }, [discussionId, isSignedIn]);

  const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent click propagation

    if (!isSignedIn) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to bookmark discussions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/user/discussion-bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discussionId,
          userId: user.publicMetadata.mongoDbUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsBookmarked(data.data.isBookmarked);
        toast({
          description: data.data.isBookmarked
            ? "Discussion bookmarked"
            : "Bookmark removed",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to toggle bookmark",
        variant: "destructive",
      });
    }
  };

  const commentCount = comments.length;
  const replyCount = comments.reduce(
    (acc, comment) => acc + comment.replies.length,
    0
  );
  const totalEngagements = commentCount + replyCount;

  return (
    <div className="flex w-full max-w-full flex-col animate-fade-in ">
      <div className=" lg:mt-4 flex items-center justify-between  text-text_secondary  py-2">
        <div className="flex items-center justify-center  gap-4">

          <Link
            href={`/discussions/${discussionId}`}
            className="flex items-center gap-1 hover:text-primary transition-colors duration-200 group"
            aria-label={`${totalEngagements} comments`}
          >


            <span className="group-hover:scale-105 transition-transform duration-200">
              {totalEngagements}
            </span>
            <span>replies</span>
          </Link>

          <div

            className="flex items-center gap-1 hover:text-primary transition-colors duration-200 group"
            aria-label={`${upvotes.length} upvotes`}>

            <span className="group-hover:scale-105 transition-transform duration-200">
              {upvotes.length}
            </span>
            <span>likes</span>

          </div>





        </div>

        <div className=" items-center gap-4  flex">

          <VoteButtons
            discussionId={discussionId}
            initialUpvotes={upvotes.length}
            initialHasUpvoted={upvotes.includes(
              isSignedIn ? String(user.publicMetadata.mongoDbUserId) : ""
            )}
            isSignedIn={isSignedIn}
          />



          <button
            className={`p-1.5 rounded-full  transition-all duration-200 hover:scale-125 active:scale-95 ${isBookmarked ? "text-primary" : ""
              }`}
            onClick={handleBookmark}
            aria-label="Bookmark discussion"
            aria-pressed={isBookmarked}
          >

            <DynamicSvgIcon
              isActive={isBookmarked}
              size={22}
              src="/bookmark.svg"
            />
          </button>
          <button
            className="p-1.5 px-0  rounded-full  transition-all duration-200 hover:scale-125 active:scale-95"
            aria-label="Share discussion"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation()


            }}
          >
            <ShareDialog id={discussionId} />
            {/* <DynamicSvgIcon
              isActive={false}
              size={22}
              src="/share.svg"
            /> */}
          </button>
        </div>
      </div>

    </div>
  );
}



