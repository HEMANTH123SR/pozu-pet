import { Suspense } from 'react';
import { TopMenu } from "@/components/component/top-header";
import { DiscussionsList } from "@/app/discussions/component/discussions-list";
import { DiscussionResponse } from "@/app/discussions/lib/interface";
import ErrorBoundary from '@/components/error-boundary';
import DiscussionsLoading from '@/components/discussions-loading';
import { FloatingPostButton } from "@/components/component/floating-post-btn";

async function DiscussionsContent() {
  try {
    const discussionFetchResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/discussion`,
      {
        next: {
          revalidate: 60,
          tags: ['discussions']
        }
      }
    );

    if (!discussionFetchResponse.ok) {
      throw new Error('Failed to fetch discussions');
    }

    const discussionsJson: DiscussionResponse = await discussionFetchResponse.json();

    return (
      <DiscussionsList
        initialDiscussions={discussionsJson.data}
        initialPagination={discussionsJson.pagination}
      />
    );
  } catch (error) {
    throw error;
  }
}

export default function Page() {
  return (
    <main className="flex w-full text-black h-screen overflow-y-hidden border-r ">
      <div className="flex flex-col w-full h-full overflow-hidden relative">
        <TopMenu />
        <div className="mt-1 flex">
          <ErrorBoundary fallback={<div>Failed to load discussions</div>}>
            <Suspense fallback={<DiscussionsLoading />}>
              <DiscussionsContent />
            </Suspense>
          </ErrorBoundary>
          <FloatingPostButton />

        </div>
      </div>
    </main>
  );
}

export const revalidate = 60;