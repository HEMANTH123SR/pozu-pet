"use client";
import React, { useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { UserInterface } from "@/app/[username]/lib/interface";


export const FollowBtn = ({ classname, profile }: { classname: string, profile: UserInterface }) => {
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(
        profile.followers.filter(
            (follower) => follower === user?.publicMetadata.mongoDbUserId
        ).length > 0
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleFollowAction = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/user/follow", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: profile._id,
                    action: isFollowing ? "unfollow" : "follow",
                }),
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
            console.error("Follow action failed:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <button
            onClick={handleFollowAction}
            disabled={isLoading}
            className={`

                ${classname}

              px-4 justify-center flex rounded-xl items-center py-1.5
              transition duration-300 text-sm 
              ${isFollowing
                    ? "bg-foreground border border-darkBorder text-text_primary hover:text-red-500"
                    : "bg-primary text-white border-2 hover:scale-110"
                }
              ${isLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "shadow-lg hover:shadow-xl"
                }
            `}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
                "Following"
            ) : (
                "Follow"
            )}
        </button>
    )
}

