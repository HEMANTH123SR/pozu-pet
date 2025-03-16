"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import type { DiscussionDetailed, User, Comment } from "../lib/interface"

import { CommentCard } from "@/app/discussions/component/discussion-comment-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon"
import { Avatar } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { hackerMedium } from "@/fonts/font"
import { UserCard } from "@/components/component/user-card"
import { PollResults } from "./poll-result-component"

export const DiscussionInteractionsMain = ({
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
    // Auto-adjust height
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <div className="hidden w-full lg:flex flex-col mb-16">


      <div className="flex items-center gap-3 py-2 border-2 border-darkBorder rounded-2xl m-3 my-1.5 mt-4 bg-[#111110] px-2">
        <div className="flex-shrink-0 flex items-center">
          <Avatar className="w-8 h-8">
            <Image
              src={user?.imageUrl || "/api/placeholder/40/40"}
              alt="Your avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
              priority
            />
          </Avatar>
        </div>
        <form onSubmit={handleCommentSubmit} className="flex-1 flex items-center gap-2">
          <div className="flex-1 min-w-0 flex items-center">
            <textarea
              placeholder="Post your reply"
              value={commentContent}
              onChange={handleCommentChange}
              className="w-full py-1.5 resize-none bg-transparent border-none focus:ring-0 text-base placeholder:text-gray-500 outline-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <div className="flex-shrink-0 flex items-center">
            <button
              className={`p-1.5 bg-primary text-darkTextPrimary rounded-full cursor-pointer ${isLoading ? 'opacity-50' : 'hover:scale-105'}`}
              type="submit"
              disabled={isLoading || !commentContent.trim()}
            >
              <DynamicSvgIcon src="/reply.svg" isActive={false} size={22} />
            </button>
          </div>
        </form>
      </div>


      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="w-full flex justify-center items-center border-b">
          <TabsTrigger
            value="comments"
            className="flex items-center gap-3.5 text-[0.8rem] uppercase "
            style={hackerMedium.style}
          >
            Comments ({comments.length})
          </TabsTrigger>

          {discussion.poll && (
            <TabsTrigger
              value="poll"
              className="flex items-center gap-3.5 text-[0.8rem] uppercase"
              style={hackerMedium.style}
            >
              Poll ({discussion.poll.totalVotes})
            </TabsTrigger>
          )}
          <TabsTrigger
            value="upvotes"
            className="flex items-center gap-3.5 text-[0.8rem] uppercase"
            style={hackerMedium.style}
          >
            Upvotes ({discussion.upvotes.length})
          </TabsTrigger>
          {discussion.collab && (
            <TabsTrigger
              value="collab"
              className="flex items-center gap-3.5 text-[0.8rem] uppercase"
              style={hackerMedium.style}
            >
              Collab ({discussion.collab.requests.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="comments" className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
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
          <TabsContent value="poll">
            <PollResults
              options={discussion.poll.options}
              totalVotes={discussion.poll.totalVotes}
              currentUser={currentUser}
            />
          </TabsContent>
        )}

        <TabsContent value="upvotes" className="space-y-3">
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

        <TabsContent value="collab" className="space-y-3">
          {discussion.collab?.requests.map((request) => (
            <UserCard
              key={request._id.toString()}
              user={request}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}