import { DiscussionSEO } from "@/app/discussions/lib/discussion-seo.interface";

export function DiscussionStructuredData({
  discussion,
}: {
  discussion: DiscussionSEO;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: discussion.title,
    text: discussion.content,
    datePublished: discussion.createdAt,
    author: {
      "@type": "Person",
      name: discussion.author.fullName,
      identifier: discussion.author.username,
    },
    keywords: discussion.tags,
    articleSection: discussion.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
