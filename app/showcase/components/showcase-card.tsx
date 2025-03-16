import React from "react";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShowcaseCard } from "@/app/showcase/lib/showcaseInterface";

export const ShowcaseProjectCard = ({ project }: { project: ShowcaseCard }) => {
  const {
    projectName,
    headline,
    creator,
    tags,
    builtUsing,
    coverImage,
    projectUrl,
    views,
    upvotesCount,
    bookmarksCount,
    commentsCount,
    featured,
    createdAt,
  } = project;

  return (
    <Card className="w-full max-w-3xl mx-auto mb-6 hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <CardHeader className="flex flex-row items-start space-x-4 pb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={creator.imageUrl} alt={creator.username} />
          <AvatarFallback>{creator.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{creator.username}</h3>
              <p className="text-sm text-gray-500">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {featured && (
              <Badge className="bg-blue-500 text-white">Featured</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Main Content */}
      <CardContent className="space-y-4">
        {/* Project Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold hover:text-blue-600 cursor-pointer">
              {projectName}
            </h2>
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
          <p className="text-gray-600">{headline}</p>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={coverImage}
            alt={projectName}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Built Using Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Built using</h4>
          <div className="flex flex-wrap gap-2">
            {builtUsing.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="border-blue-200 text-blue-700"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Footer with Stats */}
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full text-gray-500">
          <button className="flex items-center space-x-1 hover:text-red-500">
            <Heart className="h-5 w-5" />
            <span>{upvotesCount}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-500">
            <MessageCircle className="h-5 w-5" />
            <span>{commentsCount}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-yellow-500">
            <Bookmark className="h-5 w-5" />
            <span>{bookmarksCount}</span>
          </button>
          <div className="flex items-center space-x-1 text-gray-400">
            <Eye className="h-5 w-5" />
            <span>{views}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShowcaseProjectCard;
