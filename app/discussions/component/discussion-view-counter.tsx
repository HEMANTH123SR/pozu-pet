"use client";
import { useEffect } from "react";

export const DiscussionViewCounter = ({
  discussionId,
}: {
  discussionId: string;
}) => {
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch("/api/discussion/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discussionId }),
        });
      } catch (error) {
        console.error("Error incrementing view:", error);
      }
    };

    incrementView();
  }, [discussionId]);

  return <div></div>;
};
