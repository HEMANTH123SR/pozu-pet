


"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@clerk/nextjs';

export const DiscussionPoll = ({ pollData, discussionId }) => {
    const [poll, setPoll] = useState(pollData);
    const [isVoting, setIsVoting] = useState(false);
    const [error, setError] = useState('');
    const { isSignedIn, user } = useUser();

    // Handle cases where poll data is not yet loaded
    if (!poll || !poll.options) {
        return null;
    }

    const hasVoted = poll.options.some(option => {
        if (isSignedIn && user?.publicMetadata?.mongoDbUserId) {
            return option.votes.includes(user.publicMetadata.mongoDbUserId);
        }
        return false;
    });

    const handleVote = async (optionIndex) => {
        try {
            if (!isSignedIn) {
                setError('Please sign in to vote');
                return;
            }

            setIsVoting(true);
            setError('');

            const response = await fetch(`/api/discussion/${discussionId}/poll/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ optionIndex }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to submit vote');
            }

            setPoll(result.data);
        } catch (err) {
            setError(err.message || 'Failed to submit your vote. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    const calculatePercentage = (votes) => {
        if (!poll.totalVotes) return 0;
        return Math.round((votes.length / poll.totalVotes) * 100);
    };

    return (
        <Card className="w-full max-w-full mx-auto my-4 bg-darkBackground border-none">
            <CardContent className="p-6">
                <div className="space-y-4">
                    {poll.options.map((option, index) => {
                        const percentage = calculatePercentage(option.votes);

                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{option.text}</span>
                                    <span className="text-sm text-gray-500">
                                        {option.votes.length} votes ({percentage}%)
                                    </span>
                                </div>

                                <div className="relative">
                                    <Progress value={percentage} className="h-8 rounded-xl" />

                                    {!hasVoted && (
                                        <Button
                                            onClick={() => handleVote(index)}
                                            disabled={isVoting || !isSignedIn}
                                            className="absolute top-1 left-2 h-6 bg-transparent hover:bg-white/10"
                                        >
                                            {isSignedIn ? 'Vote' : 'Sign in to vote'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <p className="text-sm text-gray-500 mt-4">
                        Total votes: {poll.totalVotes || 0}
                    </p>

                    {!isSignedIn && (
                        <p className="text-sm text-gray-500">
                            Please sign in to participate in the poll.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

