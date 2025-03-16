import React, { useEffect, useState } from "react";
import { Discussion } from "@/app/discussions/lib/interface";
import { DiscussionCard } from "@/app/discussions/component/disussion-card";
import { SmallLoading } from "@/components/component/small-loading";
export const DiscussionUser = ({ userId }: { userId: string }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/discussion/all-discussion-of-the-user/${userId}`
      );
      const data = await response.json();
      setDiscussions(data.data);
    })();
    setIsLoading(false);
  }, [userId]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen border-r w-full">
        <SmallLoading />
      </div>
    );
  }
  if (discussions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen border-r w-full">
        <p className="text-xl font-semibold">No Discussion Found</p>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-scroll scroll-hidden">
      {discussions.map((discussion) => (
        <div key={String(discussion._id)}>
          <DiscussionCard discussion={discussion} isMainContent={false} />
        </div>
      ))}
    </div>
  );
};
