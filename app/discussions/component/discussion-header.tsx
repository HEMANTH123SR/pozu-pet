


"use client";
import React, { useState } from "react";
import { formatCompactTime } from "@/lib/date";
import { Discussion } from "@/app/discussions/lib/interface";
import { Ellipsis, Trash, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function DiscussionHeader({
  author,
  createdAt,
  followBtn = false,
  discussionId,

}: {
  author: Discussion["author"];
  createdAt: string;
  followBtn: boolean;
  discussionId: string;
  interactions?: {
    likes: number;
    comments: number;
    shares: number;
  };
}) {
  const { user } = useUser();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/discussion/${discussionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to delete discussion",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Discussion deleted successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error("Error deleting discussion:", error);
      toast({
        title: "Error",
        description: "Failed to delete discussion",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = () => {
    toast({
      title: "Report Functionality",
      description: "Report feature will be implemented soon",
    });
  };

  const isAuthor = user?.publicMetadata?.mongoDbUserId === author._id;

  return (
    <div className="flex flex-col w-full max-w-full space-y-2">
      {/* Header Section */}
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col sm:flex-row sm:items-center  sm:space-y-0 sm:space-x-3 w-full">
          <div onClick={(e) => {
            e.stopPropagation();
            router.push(`/${author.username}`);
          }} className="flex items-center space-x-2">
            <span
              itemProp="author"
              className="font-medium dark:text-text_primary text-sm capitalize hover:underline truncate max-w-[150px]"
            >
              {author.fullName}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-text_secondary text-xs sm:text-sm">
            <span className="truncate max-w-[100px]" aria-label="username">
              @{author.username}
            </span>
            <span aria-hidden="true">·</span>
            <time
              dateTime={createdAt}
              itemProp="datePublished"
              className="truncate"
            >
              {formatCompactTime(new Date(createdAt))}
            </time>
          </div>
        </div>

        {/* Dropdown Menu */}
        {followBtn && (
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="group rounded-full p-1 hover:bg-blue-200 hover:bg-opacity-10 cursor-pointer focus:outline-none"
              >
                <Ellipsis className="w-4 h-4 dark:text-text_secondary group-hover:text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {isAuthor && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                    disabled={isDeleting}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleReport}
                  className="cursor-pointer"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>


    </div>
  );
}