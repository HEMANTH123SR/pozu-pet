"use client";

import { hackerMedium } from "@/fonts/font";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { createImage } from "@/lib/appwrite/appwrite";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { PollCreator } from "@/app/discussions/component/poll-create";
import { CollabCreator } from "@/app/discussions/component/discussion-collab-create";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MobileDiscussionCreateFooter } from "../discussions/component/discussion-create-fotter-mobile";

enum Category {
    General = "General",
    Competitions = "Competitions",
    Events = "Events",
    Feedback = "Feedback",
    Other = "Other",
}

interface CreateDiscussionInterface {
    title: string;
    content: string;
    images: File[];
    category: Category;
    poll?: {
        options: string[];
    };
    collab?: {
        category: string;
        numPeopleNeeded: number;
    };
}

export default function PostPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user, isSignedIn } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [showCollabCreator, setShowCollabCreator] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const initialFormData: CreateDiscussionInterface = {
        title: "",
        content: "",
        images: [],
        category: Category.General,
        poll: undefined,
    };

    const [formData, setFormData] = useState<CreateDiscussionInterface>(initialFormData);

    const onEmojiClick = (emojiObject) => {
        const { emoji } = emojiObject;
        const textarea = document.querySelector('textarea');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = formData.content;
            const newText = text.substring(0, start) + emoji + text.substring(end);
            setFormData(prev => ({ ...prev, content: newText }));
        }
        setShowEmojiPicker(false);
    };

    const handleCollabCreate = (collabData: { category: string; numPeopleNeeded: number }) => {
        setFormData(prev => ({
            ...prev,
            collab: collabData
        }));
        setShowCollabCreator(false);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setFormData((prev) => ({ ...prev, content: text }));
        setWordCount(text.length);
    };

    const setMultipleImage = useCallback((images: File[]) => {
        setFormData((prev) => ({ ...prev, images }));
    }, []);

    const getImages = async () => {
        const ids: string[] = [];
        for (const file of formData.images) {
            const res = await createImage(file);
            if (res.status === "success") {
                ids.push(res.id);
            } else {
                toast({
                    title: "Error Uploading Image",
                    description: "Something went wrong while uploading the image",
                });
            }
        }
        return ids;
    };

    const handlePollCreate = (options: string[]) => {
        setFormData(prev => ({
            ...prev,
            poll: {
                options
            }
        }));
        setShowPollCreator(false);
    };

    const CreateDiscussion = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (formData.content.length > 1000) {
                toast({
                    title: "Error Creating Discussion",
                    description: "Content is too long",
                });
                return;
            }
            if (formData.content.length < 4) {
                toast({
                    title: "Error Creating Discussion",
                    description: "Content is too short",
                });
                return;
            }
            if (formData.title.length > 100) {
                toast({
                    title: "Error Creating Discussion",
                    description: "Title is too long",
                });
                return;
            }
            if (formData.images.length > 4) {
                toast({
                    title: "Error Creating Discussion",
                    description: "Too many images; max 4 images",
                });
                return;
            }

            const res = await fetch(`/api/discussion/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    formData,
                    images: await getImages(),
                    clerkUserId: user.id,
                    authorMongoId: user.publicMetadata.mongoDbUserId,
                }),
            });

            const data = await res.json();

            if (data.message === "success") {
                toast({
                    color: "#0056FE",
                    title: "Discussion Created",
                    description: "Your discussion has been created",
                });
                router.push('/');
            } else {
                toast({
                    title: "Error Creating Discussion",
                    description: "Something went wrong while creating the discussion",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSignedIn) return null;

    return (
        <div className="min-h-screen bg-darkBackground">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 border-b border-darkBorder bg-darkBackground z-50">
                <div className="flex items-center justify-between p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-darkTextPrimary"
                        onClick={() => router.back()}
                    >
                        <X className="w-6 h-6" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <button
                            className="px-4 py-1.5 flex items-center gap-2 border-2 border-darkBorder bg-darksec text-white rounded-full text-sm transition-colors"
                            onClick={() => setShowCollabCreator(prev => !prev)}
                            style={hackerMedium.style}
                        >
                            <span>Collab</span>
                            <DynamicSvgIcon
                                isActive={false}
                                src="/collabs.svg"
                                size={17}
                            />
                        </button>

                        <button
                            className="px-6 py-1.5 border-2 border-darkBorder bg-primary text-white rounded-full text-sm transition-colors disabled:opacity-50"
                            style={hackerMedium.style}
                            disabled={!formData.content.trim() || isLoading}
                            onClick={CreateDiscussion}
                        >
                            {isLoading ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-20 px-4 pb-4">
                <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-10 h-10 border-2 border-darkBorder">
                        <Image
                            src={user.imageUrl}
                            alt="User"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                            priority
                        />
                    </Avatar>
                    <div className="flex-1">
                        <input
                            placeholder="Title (optional)"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full text-lg placeholder-gray-400 focus:outline-none bg-transparent mb-2"
                            style={hackerMedium.style}
                        />
                        <textarea
                            placeholder="What are you working on?"
                            value={formData.content}
                            onChange={handleContentChange}
                            className="w-full row-span-3 text-base bg-transparent placeholder-gray-400 resize-none focus:outline-none"
                        />
                    </div>
                </div>

                {showCollabCreator && (
                    <div className="mb-4">
                        <CollabCreator
                            onCollabCreate={handleCollabCreate}
                            onCancel={() => setShowCollabCreator(false)}
                        />
                    </div>
                )}

                {showPollCreator && (
                    <div className="mb-4">
                        <PollCreator
                            onPollCreate={handlePollCreate}
                            onCancel={() => setShowPollCreator(false)}
                        />
                    </div>
                )}

                <div className="fixed bottom-0 left-0  right-0 bg-darkBackground">
                    <MobileDiscussionCreateFooter
                        multipleImage={true}
                        setImage={null}
                        setMultipleImage={setMultipleImage}
                        wordCount={wordCount}
                        handlePollSwitch={() => setShowPollCreator(!showPollCreator)}
                        onEmojiClick={onEmojiClick}
                        showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker}
                    />
                </div>
            </div>
        </div>
    );
}