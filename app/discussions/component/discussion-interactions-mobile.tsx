"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { hackerMedium } from "@/fonts/font"
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon"
import { UserCard } from "@/components/component/user-card"
import { PollResults } from "./poll-result-component"
import type { DiscussionDetailed, User, Comment } from "../lib/interface"
import { MobileCommentCard } from "@/app/discussions/component/discussion-comment-card-mobile"

export const DiscussionInteractionsMobile = ({
  discussion,
  setReload,
}: {
  discussion: DiscussionDetailed
  setReload: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { toast } = useToast()
  const { user } = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [commentContent, setCommentContent] = useState("")
  const [comments, setComments] = useState<Comment[]>(discussion.comments || [])

  useEffect(() => {
    setComments(discussion.comments || [])
  }, [discussion.comments])

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user/get-user/${user.username}`)
          if (response.ok) {
            const userData = await response.json()
            setCurrentUser(userData.data)
          }
        } catch (error) {
          console.error("Error fetching current user:", error)
        }
      }
    }

    fetchCurrentUser()
  }, [user])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentContent.trim() || !currentUser) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/discussion/${discussion._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent.trim(),
          userId: currentUser._id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      const data = await response.json()
      setComments([...comments, data.comment])
      setCommentContent("")
      setReload((prev) => prev + 1)

      toast({
        title: "Success",
        description: "Comment posted successfully",
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <div className="lg:hidden w-full">



      <div className="mb-16">
        <div className="flex gap-3 py-4 border-b px-4">
          <Avatar className="w-8 h-8">
            <Image
              src={user?.imageUrl || "/api/placeholder/32/32"}
              alt="Your avatar"
              width={32}
              height={32}
              className="rounded-full object-cover"
              priority
            />
          </Avatar>
          <form onSubmit={handleCommentSubmit} className="flex-1 flex items-center gap-2">
            <textarea
              placeholder="Post your reply"
              value={commentContent}
              onChange={handleCommentChange}
              className="w-full py-2 resize-none bg-transparent border-none focus:ring-0 text-base placeholder:text-gray-500 outline-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              className={`p-1 rounded-md ${isLoading ? 'opacity-50' : 'hover:bg-gray-100'}`}
              type="submit"
              disabled={isLoading || !commentContent.trim()}
            >
              <DynamicSvgIcon src="/reply.svg" isActive={false} size={24} />
            </button>
          </form>
        </div>

        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="w-full flex justify-between items-center border-b">
            <TabsTrigger
              value="comments"
              className="flex-1 text-xs uppercase"
              style={hackerMedium.style}
            >
              Comments ({comments.length})
            </TabsTrigger>

            {discussion.poll && (
              <TabsTrigger
                value="poll"
                className="flex-1 text-xs uppercase"
                style={hackerMedium.style}
              >
                Poll ({discussion.poll.totalVotes})
              </TabsTrigger>
            )}
            <TabsTrigger
              value="upvotes"
              className="flex-1 text-xs uppercase"
              style={hackerMedium.style}
            >
              Upvotes ({discussion.upvotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="space-y-4 overflow-y-auto max-h-[50vh]">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <MobileCommentCard
                  key={comment._id.toString()}
                  comment={comment}
                  discussionId={discussion._id.toString()}
                  currentUser={currentUser}
                  setReload={setReload}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </TabsContent>

          {discussion.poll && (
            <TabsContent value="poll" className="overflow-y-auto max-h-[50vh]">
              <PollResults
                options={discussion.poll.options}
                totalVotes={discussion.poll.totalVotes}
                currentUser={currentUser}
              />
            </TabsContent>
          )}

          <TabsContent value="upvotes" className="space-y-3 overflow-y-auto max-h-[50vh]">
            {discussion.upvotes.map((upvote) => (
              <UserCard
                key={upvote._id.toString()}
                user={upvote}
              />
            ))}
            {discussion.upvotes.length === 0 && (
              <p className="text-center text-gray-500">No upvotes yet</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}



