"use client";

import { useState } from "react";
import { DiscussionCard } from "@/app/discussions/component/disussion-card";
import { useInfiniteScroll } from "@/app/discussions/lib/hooks/infinitescrollhooks";
import {
  DiscussionsListProps,
  DiscussionResponse,
} from "@/app/discussions/lib/interface";

import { ErrorMessage } from "@/app/discussions/component/small-ui-components/error-message";
import { EmptyState } from "@/app/discussions/component/small-ui-components/empty-state";
import { SmallLoading } from "@/components/component/small-loading";
import { CreateDiscussionModal } from "./discussion-create";

export const DiscussionsList = ({
  initialDiscussions,
  initialPagination,
}: DiscussionsListProps) => {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreDiscussions = async () => {
    if (loading || !pagination.hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/discussion?page=${pagination.currentPage + 1
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more discussions");
      }

      const data: DiscussionResponse = await response.json();

      setDiscussions((prev) => [...prev, ...data.data]);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more discussions"
      );
    } finally {
      setLoading(false);
    }
  };

  const lastDiscussionRef = useInfiniteScroll(loadMoreDiscussions);

  return (
    <div className="h-screen pb-32 overflow-y-scroll scroll-hidden w-full">

      <CreateDiscussionModal />
      {discussions.map((discussion, index) => (
        <div
          key={String(discussion._id)}
          ref={index === discussions.length - 1 ? lastDiscussionRef : null}
          className={`${index === 0 && "mt-28 lg:mt-0"}`}
        >
          <DiscussionCard discussion={discussion} isMainContent={false} />
        </div>
      ))}

      {loading && (
        <div className=" flex justify-center p-4">
          <SmallLoading />
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={loadMoreDiscussions} />}

      {!pagination.hasMore && discussions.length > 0 && (
        <div className="text-center p-4 text-gray-500">
          {` You've reached the end! No more discussions to load.`}
        </div>
      )}

      {discussions.length === 0 && !loading && <EmptyState />}
    </div>
  );
};

