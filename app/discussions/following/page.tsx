

import { TopMenu } from "@/components/component/top-header";
import { DiscussionsList } from "@/app/discussions/component/discussions-list";
import { DiscussionResponse } from "@/app/discussions/lib/interface";
import { currentUser } from '@clerk/nextjs/server'
import { FloatingPostButton } from "@/components/component/floating-post-btn";


export default async function Following() {

    const { username } = await currentUser();

    const discussionFetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/discussion/following?username=${username}`,
        {
            cache: "no-store",
            next: { revalidate: 0 },
        }
    );
    const discussionsJson: DiscussionResponse = await discussionFetchResponse.json();

    return (
        <main className="flex w-full text-black h-screen overflow-y-hidden border-r dark:border-darkBorder">
            <div className="flex flex-col w-full h-full overflow-hidden relative">
                <TopMenu />
                <div className="mt-1 flex"> {/* Add margin to account for fixed header */}

                    <DiscussionsList
                        initialDiscussions={discussionsJson.data}
                        initialPagination={discussionsJson.pagination}
                    />
                </div>
                <FloatingPostButton />
            </div>
        </main>
    );
}