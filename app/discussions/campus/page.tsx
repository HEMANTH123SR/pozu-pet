

import { TopMenu } from "@/components/component/top-header";
import { DiscussionsList } from "@/app/discussions/component/discussions-list";
// import { DiscussionResponse } from "@/app/discussions/lib/interface";
import { currentUser } from '@clerk/nextjs/server'
import { FloatingPostButton } from "@/components/component/floating-post-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { CreateDiscussionModal } from "../component/discussion-create";
import { redirect } from "next/navigation";
import { UniversityInputForm } from "@/app/discussions/component/university-input-form"; // Import the client component

export default async function YourCampus() {
    const user = await currentUser();

    if (!user) {
        // Handle unauthenticated users
        redirect('/sign-in');
    }

    // Fetch campus discussions
    const discussionFetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/discussion/your-campus/${user.username}`,
        {
            cache: "no-store"
        }
    );

    const discussionsJson = await discussionFetchResponse.json();

    // If the response indicates the user doesn't have a university set
    if (!discussionsJson.success && discussionsJson.message?.includes("university")) {
        return (
            <main className="flex w-full text-black h-screen overflow-y-hidden border-r dark:border-darkBorder">
                <div className="flex flex-col w-full h-full overflow-hidden relative">
                    <TopMenu />
                    <div className="flex h-full w-full justify-center items-center px-7">
                        <div className="flex justify-center items-center lg:w-10/12">
                            <UniversityInputForm
                                username={user.username}
                                firstName={user.firstName || ''}
                            />
                        </div>
                    </div>
                    <FloatingPostButton />
                </div>
            </main>
        );
    }

    // If no discussions, show empty state
    if (discussionsJson.data?.length === 0) {
        return (
            <main className="flex w-full text-black h-screen overflow-y-hidden border-r dark:border-darkBorder">
                <div className="flex flex-col w-full h-full overflow-hidden relative">
                    <TopMenu />
                    <div className="flex flex-col w-full">
                        <CreateDiscussionModal />
                        <Card className="w-full max-w-2xl mx-auto mt-8 bg-darkBackground">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <AlertCircle className="w-6 h-6" />
                                    No Campus Discussions Yet
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="mb-6">Be the first to start a discussion from your university!</p>
                            </CardContent>
                        </Card>
                    </div>
                    <FloatingPostButton />
                </div>
            </main>
        );
    }

    // Normal state with discussions
    return (
        <main className="flex w-full text-black h-screen overflow-y-hidden border-r dark:border-darkBorder">
            <div className="flex flex-col w-full h-full overflow-hidden relative">
                <TopMenu />
                <div className="mt-1 flex flex-col h-full">
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




