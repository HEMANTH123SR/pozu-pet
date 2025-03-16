"use client";
import React, { useEffect, useState } from "react";
import { Discussion } from "@/app/discussions/lib/interface";
import { DiscussionCard } from "@/app/discussions/component/disussion-card";
import { SmallLoading } from "@/components/component/small-loading";
const BookmarkUser = () => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/user/get-bookmarks-discussion-in-detail`
            );
            const data = await response.json();
            console.log(data.data);
            setDiscussions(data.data);
        })();
        setIsLoading(false);
    }, []);
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
    //h-screen overflow-y-scroll scroll-hidden
    return (
        // <div className="h-screen overflow-y-scroll scroll-hidden border-r border-darkBorder ">
        <div className="h-screen overflow-y-scroll pb-32 scroll-hidden w-full border-r border-darkBorder ">

            <div className="h-14 mt-16 lg:mt-0 w-full flex justify-center items-center border-b">
                Saved Discussion
            </div>

            {discussions.map((discussion) => (
                <div key={String(discussion._id)}>
                    <DiscussionCard discussion={discussion} isMainContent={false} />
                </div>
            ))}
        </div>
    );
};


export default BookmarkUser;