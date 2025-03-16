"use client";
import { Discussion } from "@/app/discussions/lib/interface";
import { DiscussionHeader } from "@/app/discussions/component/discussion-header";
import { DiscussionContent } from "@/app/discussions/component/discussion-content";
import { DiscussionPoll } from "@/app/discussions/component/discussion-poll";
import { DiscussionEngagement } from "@/app/discussions/component/discussion-engagement";
import { DiscussionStructuredData } from "@/app/discussions/component/discussion-card-structured-data";
import { DiscussionViewCounter } from "@/app/discussions/component/discussion-view-counter";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DiscussionCollab } from "./discussion-collab";

export function DiscussionCard({
  discussion,
  isMainContent = false,
}: {
  discussion: Discussion;
  isMainContent?: boolean;
}) {
  const router = useRouter();
  const MainTag = isMainContent ? "article" : "div";

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on engagement section
    if ((e.target as HTMLElement).closest('.engagement-section')) {
      return;
    }
    router.push(`/discussions/${discussion._id}`);
  };

  return (
    <div className="w-full max-w-full">
      <DiscussionViewCounter discussionId={String(discussion._id)} />
      <DiscussionStructuredData
        discussion={{
          ...discussion,
          createdAt: String(discussion.createdAt),
        }}
      />

      <MainTag
        className="w-full max-w-full p-4 md:p-5 border-b border-darkBorder transition-colors flex flex-col space-y-3 cursor-pointer "
        itemScope
        itemType="https://schema.org/DiscussionForumPosting"
        onClick={handleCardClick}
      >
        <div className="flex flex-row space-x-3">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0 "
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${discussion.author.username}`);
              }}
            >
              <Image
                src={discussion.author.profileImage || "/default-avatar.png"}
                alt={`${discussion.author.fullName}'s profile picture`}
                className="border-2 border-darkBorder rounded-full object-cover"
                fill
                sizes="(max-width: 768px) 48px, 52px"
                priority={false}
                itemProp="image"
              />
            </div>

            {discussion.comments.length > 0 && (
              <div className="flex flex-col items-center w-full h-full mb-2">
                <div className="h-full bg-darkBorder w-[1.6px]"></div>
                <div className="flex items-center animate-slide-in-up">
                  <div className="flex -space-x-2">
                    {discussion.comments.slice(0, 2).map((comment, i) => (
                      <div
                        key={i}
                        className="relative w-7 h-7 transition-transform duration-200 hover:scale-125 hover:z-10"
                      >
                        <Image
                          src={comment.user.profileImage || "/default-avatar.png"}
                          alt="Commenter avatar"
                          fill
                          sizes="24px"
                          className="rounded-full border-2 border-darkTextSecondery dark:border-none object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col w-full max-w-full">
            <DiscussionHeader
              followBtn={!isMainContent}
              author={discussion.author}
              createdAt={String(discussion.createdAt)}
              discussionId={String(discussion._id)}
            />

            <DiscussionContent
              title={discussion.title}
              content={discussion.content}
              images={discussion.images}
              link={discussion.link}
              tags={discussion.tags}
            />
            {discussion.collab && (
              <DiscussionCollab
                discussionId={String(discussion._id)}
                collab={{
                  ...discussion.collab,

                }}
              />
            )}

            {
              discussion.poll && (
                <DiscussionPoll
                  discussionId={String(discussion._id)}
                  pollData={discussion.poll}
                />
              )
            }



            <div className="engagement-section">
              <DiscussionEngagement
                discussionId={String(discussion._id)}
                upvotes={discussion.upvotes.map((data) => String(data))}
                comments={discussion.comments}
                numViews={discussion.numViews}
              />
            </div>
          </div>
        </div>
      </MainTag>
    </div>
  );
}