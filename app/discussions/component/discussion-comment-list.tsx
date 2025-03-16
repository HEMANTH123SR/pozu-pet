import React, { useState, useEffect } from "react"
import { formatCompactTime } from "@/lib/date"
import type { Comment, Reply, User } from "../lib/interface"
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const ReplyCard = ({
  reply,
  onReplySubmit,
  onDeleteReply,
  parentUsername,
  currentUser,
}: {
  reply: Reply
  onReplySubmit: (content: string, parentId: string) => Promise<void>
  onDeleteReply: (replyId: string) => Promise<void>
  parentUsername: string
  currentUser: User | null
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const { toast } = useToast()

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return
    await onReplySubmit(replyContent, reply._id?.toString() || "")
    setReplyContent("")
    setShowReplyInput(false)
  }

  const handleDeleteReply = async () => {
    if (!currentUser || currentUser._id.toString() !== reply.user._id.toString()) {
      toast({
        description: "You can only delete your own replies",
        variant: "destructive",
      })
      return
    }

    await onDeleteReply(reply._id?.toString() || "")
  }

  return (
    <div className="flex gap-3 mt-4 pl-8 border-l border-gray-200">
      <Avatar className="h-6 w-6">
        <AvatarImage src={reply.user?.profileImage || "/placeholder-avatar.png"} />
        <AvatarFallback>{reply.user?.fullName?.[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/${reply.user?.username}`} className="font-medium text-sm hover:underline">
            {reply.user?.fullName || "Anonymous"}
          </Link>
          <Link href={`/${reply.user?.username}`} className="text-sm text-gray-500 hover:underline">
            @{reply.user?.username || "anonymous"}
          </Link>
          <span className="text-lg font-semibold text-gray-500" aria-hidden="true">
            ·
          </span>
          <time className="text-sm text-gray-500">
            {reply.createdAt ? formatCompactTime(new Date(reply.createdAt)) : "Just now"}
          </time>
        </div>
        <p className="text-sm mt-1">
          <Link href={`/${parentUsername}`} className="text-blue-500 hover:underline">
            @{parentUsername}
          </Link>{" "}
          {reply.content}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>Like</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>Reply</span>
            </div>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => navigator.clipboard.writeText(window.location.href)}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              {currentUser && currentUser._id.toString() === reply.user._id.toString() && (
                <DropdownMenuItem onSelect={handleDeleteReply}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {showReplyInput && (
          <div className="mt-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to @${parentUsername}...`}
              className="mb-2 p-2 border outline-primary rounded-full text-sm px-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowReplyInput(false)
                  setReplyContent("")
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
                className="text-white rounded-2xl"
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const CommentCard = ({
  comment,
  onReplySubmit,
  onDeleteComment,
  currentUser,
}: {
  comment: Comment
  onReplySubmit: (content: string, parentId: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
  currentUser: User | null
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState<Reply[]>(comment.replies || [])
  const { toast } = useToast()

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return
    await onReplySubmit(replyContent, comment._id?.toString() || "")
    setReplyContent("")
    setShowReplyInput(false)
  }

  const handleDeleteComment = async () => {
    if (!currentUser || currentUser._id.toString() !== comment.user._id.toString()) {
      toast({
        description: "You can only delete your own comments",
        variant: "destructive",
      })
      return
    }

    await onDeleteComment(comment._id?.toString() || "")
  }

  const handleDeleteReply = async (replyId: string) => {
    try {
      const response = await fetch(`/api/discussions/reply/${replyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete reply")
      }

      setReplies(replies.filter((reply) => reply._id?.toString() !== replyId))
      toast({
        description: "Reply deleted successfully",
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        description: "Failed to delete reply",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    setReplies(comment.replies || [])
  }, [comment.replies])

  return (
    <div className="w-full m-4 my-6">
      <div className="flex gap-3 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user?.profileImage || "/placeholder-avatar.png"} />
          <AvatarFallback>{comment.user?.fullName?.[0] || "?"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 w-full">
          <div className="flex items-center gap-2">
            <Link href={`/${comment.user?.username}`} className="font-medium text-sm hover:underline">
              {comment.user?.fullName || "Anonymous"}
            </Link>
            <Link href={`/${comment.user?.username}`} className="text-sm text-gray-500 hover:underline">
              @{comment.user?.username || "anonymous"}
            </Link>
            <span className="text-lg font-semibold text-gray-500" aria-hidden="true">
              ·
            </span>
            <time className="text-gray-500 text-sm">
              {comment.createdAt ? formatCompactTime(new Date(comment.createdAt)) : "Just now"}
            </time>
          </div>

          <p className="text-sm mt-1.5 my-3">{comment.content}</p>

          <div className="flex items-center gap-4 mt-2">
            <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                <span>Like</span>
                <span>• 2</span>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>Reply</span>
              </div>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigator.clipboard.writeText(window.location.href)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                {currentUser && currentUser._id.toString() === comment.user._id.toString() && (
                  <DropdownMenuItem onSelect={handleDeleteComment}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {showReplyInput && (
            <div className="mt-4">
              <input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to @${comment.user?.username || "anonymous"}...`}
                className="mb-2 p-2 border outline-primary rounded-full text-sm px-4 w-full"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowReplyInput(false)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim()}
                  className="text-white rounded-2xl"
                >
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Display Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {replies.map((reply) => (
                <ReplyCard
                  key={reply._id ? reply._id.toString() : `reply-${reply.createdAt}`}
                  reply={reply}
                  onReplySubmit={onReplySubmit}
                  onDeleteReply={handleDeleteReply}
                  parentUsername={comment.user?.username || "anonymous"}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

