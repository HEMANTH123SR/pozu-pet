"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";

interface VoteButtonProps {
  discussionId: string;
  initialUpvotes: number;
  initialHasUpvoted: boolean;
  isSignedIn: boolean;
}

export const VoteButtons: React.FC<VoteButtonProps> = ({
  discussionId,
  initialUpvotes,
  initialHasUpvoted,
  isSignedIn,
}) => {
  const { user } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [upvotes, setUpvotes] = React.useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = React.useState(initialHasUpvoted);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleVote = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const res = await fetch("/api/discussion/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discussionId,
          voteType: "upvote",
          authorMongoId: user.publicMetadata.mongoDbUserId,
        }),
      });

      const data = await res.json();
      if (data.message === "success") {
        setUpvotes(data.data.upvotes);
        setHasUpvoted(data.data.hasUpvoted);
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsLoading(false);
      // Reset animation state after a delay
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="flex items-center ">
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation()
          if (isSignedIn) {
            handleVote();
          }
        }}
        disabled={isLoading}
        className={`group flex items-center  p-1.5 px-0 rounded-full 
          transition-all duration-300 ease-in-out
          hover:scale-110
          ${hasUpvoted ? "text-primary" : "text-gray-500 hover:text-primary"
          }
          ${isAnimating ? "animate-upvote-press" : ""}
          active:scale-95`}
        aria-label={hasUpvoted ? "Remove upvote" : "Upvote discussion"}
      >
        <DynamicSvgIcon
          src="/heart.svg"
          isActive={hasUpvoted}
          size={22}
        />

      </button>
    </div>
  );
};


