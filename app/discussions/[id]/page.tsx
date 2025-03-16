"use client";
import React, { useEffect, useState } from "react";
import { DiscussionDetailed } from "@/app/discussions/lib/interface";
import { DiscussionCard } from "@/app/discussions/component/disussion-card";
import { DiscussionInteractionsMain } from "@/app/discussions/component/discussion-Interactions-main";
import { DiscussionInteractionsMobile } from "@/app/discussions/component/discussion-interactions-mobile";
import Link from "next/link";
import { SmallLoading } from "@/components/component/small-loading";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { hackerMedium } from "@/fonts/font";

const DiscussionIndividualPage = ({ params }: { params: { id: string } }) => {
  const [discussion, setDiscussion] = useState<DiscussionDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/discussion/${params.id}`,
          {
            cache: "no-cache",
          }
        );
        const result = await response.json();

        if (result.data) {
          setDiscussion(result.data);
        } else {
          setError("Discussion not found");
        }
      } catch (err) {
        console.log(err);
        setError("Error loading discussion");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscussion();
  }, [params.id, reload]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen border-r">
        <SmallLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen border-r">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!discussion) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-y-scroll pb-32 scroll-hidden animate-fade-in border-r border-darkBorder">
      <div className="w-full flex items-center justify-between p-3 border-b border-darkBorder  lg:px-6   z-10 min-h-14 h-14 ">
        <div className="flex items-center justify-start space-x-3.5">
          <Link
            href={"/"}
            className="p-1.5  rounded-full transition-transform duration-200  active:scale-95 hover:shadow-md hover:text-primary hover:scale-110"
          >
            {/* <ArrowLeft className="w-[1.12rem] h-[1.12rem] lg:w-5 lg:h-5" />
             */}
            <DynamicSvgIcon
              isActive={false}
              src='/arrow-left.svg'
              size={25}
            />
          </Link>
        </div>
        <span className="font-semibold animate-slide-in-right"
          style={hackerMedium.style}
        >
          {`Discussion By ${discussion.author.fullName}`}
        </span>
        <button className="p-1.5  rounded-full transition-transform duration-200  active:scale-95 hover:shadow-md  hover:scale-110"

        >

          <DynamicSvgIcon
            isActive={false}
            src='/option.svg'
            size={25}
          />
        </button>
      </div>

      <div className="animate-slide-in-up">
        <DiscussionCard
          discussion={{
            ...discussion,
            upvotes: discussion.upvotes.map((data) => data._id),
            downvotes: discussion.downvotes.map((data) => data._id),
          }}
          isMainContent
        />
      </div>

      <div className="animate-slide-in-up [animation-delay:200ms]">
        <DiscussionInteractionsMain
          discussion={discussion}
          setReload={setReload}
        />


        <DiscussionInteractionsMobile
          discussion={discussion}
          setReload={setReload}
        />
      </div>
    </div>
  );
};

export default DiscussionIndividualPage;
