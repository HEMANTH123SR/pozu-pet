import { Suspense } from "react";
import { ShowcaseCard } from "@/app/showcase/lib/showcaseInterface";
import { ShowcaseProjectCard } from "@/app/showcase/components/showcase-card";
export function ShowCaseList({ projects }: { projects: ShowcaseCard[] }) {
  return (
    <div className="grid gap-4 p-4">
      {projects.map((projectCard: ShowcaseCard) => (
        <Suspense
          key={projectCard.id}
          fallback={
            <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          }
        >
          <ShowcaseProjectCard project={projectCard} />
        </Suspense>
      ))}
    </div>
  );
}
