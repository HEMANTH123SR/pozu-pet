"use client"
import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import type { Comment, User } from "../lib/interface"
import { Avatar } from "@/components/ui/avatar"
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon"
import { useToast } from "@/hooks/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react';

interface CommentCardProps {
    comment: Comment
    discussionId: string
    currentUser: User | null
    setReload: React.Dispatch<React.SetStateAction<number>>
}

export const CommentCard = ({
    comment,
    discussionId,
    currentUser,
    setReload,
}: CommentCardProps) => {
    const { toast } = useToast()
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)

    // ... (keeping all the handlers the same)
    const handleReaction = async () => {
        if (!currentUser) {
            toast({
                title: "Error",
                description: "Please sign in to react to comments",
                variant: "destructive",
            })
            return
        }

        try {
            const response = await fetch(
                `/api/discussion/${discussionId}/comment/${comment._id}/reaction`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: currentUser._id }),
                }
            )

            if (!response.ok) {
                throw new Error("Failed to toggle reaction")
            }

            setReload((prev) => prev + 1)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to toggle reaction",
                variant: "destructive",
            })
        }
    }

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentUser || !replyContent.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch(
                `/api/discussion/${discussionId}/comment/${comment._id}/reply`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: replyContent.trim(),
                        userId: currentUser._id,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error("Failed to add reply")
            }

            setReplyContent("")
            setIsReplying(false)
            setReload((prev) => prev + 1)
            setShowReplies(true)

            toast({
                title: "Success",
                description: "Reply added successfully",
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add reply",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = async () => {
        if (!editContent.trim()) return

        try {
            const response = await fetch(
                `/api/discussion/${discussionId}/comment/${comment._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content: editContent.trim() }),
                }
            )

            if (!response.ok) {
                throw new Error("Failed to update comment")
            }

            setIsEditing(false)
            setReload((prev) => prev + 1)

            toast({
                title: "Success",
                description: "Comment updated successfully",
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update comment",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `/api/discussion/${discussionId}/comment/${comment._id}`,
                {
                    method: "DELETE",
                }
            )

            if (!response.ok) {
                throw new Error("Failed to delete comment")
            }

            setReload((prev) => prev + 1)

            toast({
                title: "Success",
                description: "Comment deleted successfully",
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete comment",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4 border-b border-darkBorder">
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <Avatar className="w-10 h-10">
                        <Image
                            src={comment.user.profileImage || "/api/placeholder/40/40"}
                            alt={`${comment.user.fullName}'s avatar`}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    </Avatar>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-text_primary">{comment.user.fullName}</span>
                            <span className="text-sm text-text_secondary">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>

                        {currentUser?._id === comment.user._id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Ellipsis
                                        className="cursor-pointer text-text_primary hover:text-primary"
                                        size={20}
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-foreground border-darkBorder">
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}
                                        className="text-text_primary hover:bg-background">
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        className="text-red-600 hover:bg-background">
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <div className="bg-foreground rounded-xl border border-darkBorder p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-text_secondary text-sm">Editing comment</div>
                                    <div className="text-text_primary text-sm font-medium">{currentUser?.fullName}</div>
                                </div>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="Edit your comment..."
                                    className="w-full bg-transparent border-none text-text_primary placeholder:text-text_secondary focus:ring-0 p-0 text-sm resize-none min-h-[60px] outline-none"
                                />
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-darkBorder">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setEditContent(comment.content)
                                        }}
                                        className="text-text_secondary text-sm hover:text-text_primary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 text-text_primary bg-primary rounded-md px-3 py-1 disabled:opacity-50"
                                        disabled={!editContent.trim()}
                                    >
                                        <span className="text-sm">Save</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 text-text_primary">{comment.content}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                        <button
                            onClick={handleReaction}
                            className="flex items-center gap-1 text-sm text-text_secondary hover:text-primary"
                        >
                            <DynamicSvgIcon
                                src="/heart.svg"
                                isActive={comment.reactions?.some(
                                    (reaction) => reaction.user._id === currentUser?._id
                                )}
                                size={20}
                            />
                            {comment.reactions?.length || 0}
                        </button>

                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1 text-sm text-text_secondary hover:text-primary"
                        >
                            <DynamicSvgIcon src="/reply.svg" isActive={false} size={20} />
                            Reply
                        </button>
                    </div>


                    {isReplying && (
                        <form onSubmit={handleReplySubmit} className="mt-3">
                            <div className="bg-foreground rounded-xl border border-darkBorder p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-text_secondary text-sm">Replying to {comment.user.fullName}</div>
                                    <div className="text-text_primary text-sm font-medium">{currentUser?.fullName}</div>
                                </div>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full bg-transparent border-none text-text_primary placeholder:text-text_secondary focus:ring-0 p-0 text-sm resize-none min-h-[60px] outline-none"
                                    disabled={isLoading}
                                />
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-darkBorder">
                                    <button
                                        type="button"
                                        onClick={() => setIsReplying(false)}
                                        className="text-text_secondary text-sm hover:text-text_primary"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 text-text_primary bg-primary px-3 py-1 rounded-md disabled:opacity-50"
                                        disabled={isLoading || !replyContent.trim()}
                                    >
                                        <span className="text-sm">Reply</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {comment.replies?.length > 0 && (
                        <div className="mt-3">
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-sm text-primary hover:underline"
                            >
                                {showReplies
                                    ? "Hide replies"
                                    : `Show ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
                            </button>

                            {showReplies && (
                                <div className="mt-3 space-y-4">
                                    {comment.replies.map((reply) => (
                                        <div key={reply._id.toString()} className="flex gap-3 ml-6">
                                            <div className="flex-shrink-0">
                                                <Avatar className="w-8 h-8">
                                                    <Image
                                                        src={reply.user.profileImage || "/api/placeholder/32/32"}
                                                        alt={`${reply.user.fullName}'s avatar`}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover"
                                                    />
                                                </Avatar>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-text_primary">
                                                        {reply.user.fullName}
                                                    </span>
                                                    <span className="text-sm text-text_secondary">
                                                        {formatDistanceToNow(new Date(reply.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-text_primary">{reply.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}