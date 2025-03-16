


"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';
import { Clock, AlertCircle } from 'lucide-react';
import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon';
import { hackerMedium } from '@/fonts/font';
import Image from 'next/image';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CollabUser {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
}

interface CollabProps {
    discussionId: string;
    collab: {
        category: string;
        numPeopleNeeded: number;
        requests: CollabUser[];
    };
}

export const DiscussionCollab = ({ discussionId, collab }: CollabProps) => {
    const { user, isSignedIn } = useUser();
    const { toast } = useToast();
    const [isRequesting, setIsRequesting] = useState(false);
    const [requests, setRequests] = useState(collab.requests);

    const hasRequested = user && requests.some(
        req => req._id === user.publicMetadata.mongoDbUserId
    );

    const spotsLeft = collab.numPeopleNeeded - requests.length;
    const isFull = spotsLeft <= 0;

    // Determine which users to show and if we need a +N indicator
    const MAX_VISIBLE_USERS = 4;
    const visibleUsers = requests.slice(0, MAX_VISIBLE_USERS);
    const remainingUsers = requests.length - MAX_VISIBLE_USERS;
    const showRemainingIndicator = remainingUsers > 0;

    const handleRequest = async () => {
        if (!isSignedIn) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to join collaborations",
            });
            return;
        }

        if (isFull) {
            toast({
                title: "Collab Full",
                description: "This collaboration has reached its member limit",
            });
            return;
        }

        try {
            setIsRequesting(true);
            const response = await fetch(`/api/discussion/${discussionId}/collab/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setRequests(data.data.requests);
            toast({
                title: data.message,
                description: hasRequested
                    ? "Your request has been withdrawn"
                    : "Your request has been sent",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to process your request",
            });
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className="mt-4 p-3 sm:p-4 rounded-2xl border border-darkBorder bg-darksec/20 w-full max-w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-darkBorder pb-2 gap-2 w-full max-w-full">
                <div className="flex items-center gap-2 text-darkTextPrimary">
                    <DynamicSvgIcon
                        isActive={false}
                        src="/collabs.svg"
                        size={17}
                    />
                    <span className="font-medium text-sm" style={hackerMedium.style}>
                        {collab.category} Collaboration
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-4 max-w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <TooltipProvider>
                            <div className="flex -space-x-3">
                                {visibleUsers.map((request) => (
                                    <Tooltip key={request._id}>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-darkBorder overflow-hidden transition-transform hover:scale-110 hover:z-10">
                                                    <Image
                                                        src={request.profileImage || "/default-avatar.png"}
                                                        alt={`${request.fullName}'s profile`}
                                                        fill
                                                        className="object-cover rounded-full"
                                                        sizes="(max-width: 640px) 32px, 40px"
                                                    />
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-medium">{request.fullName}</p>
                                            <p className="text-sm text-gray-400">@{request.username}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}


                                {/* Additional users indicator */}
                                {showRemainingIndicator && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-darkBorder bg-primary flex items-center justify-center text-xs sm:text-sm font-medium text-white transition-transform hover:scale-110 hover:z-10">
                                                    +{remainingUsers}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{remainingUsers} more {remainingUsers === 1 ? 'member' : 'members'}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </TooltipProvider>
                        <span className="text-sm text-gray-400">
                            {requests.length} {requests.length === 1 ? 'member' : 'members'}
                        </span>
                    </div>

                    {isFull ? (
                        <div className="flex items-center gap-2 text-yellow-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Full</span>
                        </div>
                    ) : (
                        <Button
                            onClick={handleRequest}
                            disabled={isRequesting}
                            variant={hasRequested ? "destructive" : "default"}
                            className="w-full sm:w-auto px-4 py-1 text-sm rounded-2xl border-2 border-darkBorder text-darkTextPrimary"
                        >
                            {isRequesting ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : hasRequested ? (
                                "Withdraw Request"
                            ) : (
                                "Request to Join"
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};