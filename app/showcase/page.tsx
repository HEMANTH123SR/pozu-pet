"use client";
import { Suspense } from "react";
import { showcaseData } from "@/app/showcase/lib/showcase.data";
import { ShowCaseHeader } from "@/app/showcase/components/showcase-header";
import { SearchShowcase } from "@/app/showcase/components/showcase-search";
import { ShowCaseList } from "@/app/showcase/components/showcase-list";

export default function ShowCasePage() {
  return (
    <main className="flex w-full text-black h-screen max-h-screen">
      {/* Main content area */}

      <div className="flex flex-col w-full">
        <ShowCaseHeader />

        <div className="w-full h-full overflow-y-auto flex flex-col scrollbarHide">
          {/* Search component - will be client-side */}
          <SearchShowcase />

          {/* Competitions list with suspense boundary */}
          <Suspense
            fallback={<div className="p-4">Loading competitions...</div>}
          >
            <ShowCaseList projects={showcaseData} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
