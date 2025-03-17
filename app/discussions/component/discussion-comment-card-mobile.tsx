"use client"
import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import type { Comment, User } from "../lib/interface"
import { Avatar } from "@/components/ui/avatar"
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon"
import { useToast } from "@/hooks/use-toast"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react'

interface MobileCommentCardProps {
    comment: Comment
    discussionId: string
    currentUser: User | null
    setReload: React.Dispatch<React.SetStateAction<number>>
}

export const MobileCommentCard = ({
    comment,
    discussionId,
    currentUser,
    setReload,
}: MobileCommentCardProps) => {
    const { toast } = useToast()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)

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
        <div className="flex flex-col gap-3 p-3 border-b border-darkBorder">
            <div className="flex gap-2">
                <Avatar className="w-8 h-8">
                    <Image
                        src={comment.user.profileImage || "/api/placeholder/32/32"}
                        alt={`${comment.user.fullName}'s avatar`}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                    />
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm text-text_primary">{comment.user.fullName}</span>
                            <span className="text-xs text-text_secondary">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>

                        {currentUser?._id === comment.user._id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Ellipsis className="w-4 h-4 text-text_secondary" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-foreground border-darkBorder">
                                    <DropdownMenuItem
                                        onClick={() => setIsEditing(true)}
                                        className="text-text_primary hover:bg-background"
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        className="text-red-600 hover:bg-background"
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 text-sm bg-foreground border border-darkBorder rounded-lg resize-none focus:ring-1 focus:ring-primary min-h-[60px]"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditContent(comment.content)
                                    }}
                                    className="px-3 py-1 text-xs text-text_secondary hover:text-text_primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="px-3 py-1 text-xs bg-primary text-white rounded-md disabled:opacity-50"
                                    disabled={!editContent.trim()}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 text-sm text-text_primary">{comment.content}</p>
                    )}

                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={handleReaction}
                            className="flex items-center gap-1 text-xs text-text_secondary"
                        >
                            <DynamicSvgIcon
                                src="/heart.svg"
                                isActive={comment.reactions?.some(
                                    (reaction) => reaction.user._id === currentUser?._id
                                )}
                                size={16}
                            />
                            {comment.reactions?.length || 0}
                        </button>

                        <Sheet>
                            <SheetTrigger className="flex items-center gap-1 text-xs text-text_secondary">
                                <DynamicSvgIcon src="/reply.svg" isActive={false} size={16} />
                                Reply
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[40vh] bg-foreground border-t border-darkBorder">
                                <SheetHeader>
                                    <SheetTitle className="text-text_primary">Reply to {comment.user.fullName}</SheetTitle>
                                </SheetHeader>
                                <form onSubmit={handleReplySubmit} className="mt-4">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Write your reply..."
                                        className="w-full p-3 bg-background border border-darkBorder rounded-lg resize-none focus:ring-1 focus:ring-primary min-h-[100px] text-text_primary placeholder:text-text_secondary"
                                        disabled={isLoading}
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                                            disabled={isLoading || !replyContent.trim()}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </form>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {comment.replies?.length > 0 && (
                        <div className="mt-2">
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-xs text-primary"
                            >
                                {showReplies
                                    ? "Hide replies"
                                    : `Show ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"
                                    }`}
                            </button>

                            {showReplies && (
                                <div className="mt-3 space-y-3 pl-4">
                                    {comment.replies.map((reply) => (
                                        <div key={reply._id.toString()} className="flex gap-2">
                                            <Avatar className="w-6 h-6">
                                                <Image
                                                    src={reply.user.profileImage || "/api/placeholder/24/24"}
                                                    alt={`${reply.user.fullName}'s avatar`}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full object-cover"
                                                />
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-xs text-text_primary">
                                                        {reply.user.fullName}
                                                    </span>
                                                    <span className="text-xs text-text_secondary">
                                                        {formatDistanceToNow(new Date(reply.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-text_primary">{reply.content}</p>
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