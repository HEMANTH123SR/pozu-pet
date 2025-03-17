import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, request) => {
  // Check if the route should be public
  const isPublicRoute =
    request.url.includes("/api/discussion") ||
    request.url.includes("/api/webhook") ||
    request.url.includes("/sso-callback") ||
    request.url.includes("/sign-in") ||
    request.url.includes("/sign-up") ||
    request.url.includes("/_next") ||
    request.url.match(
      /\.(jpg|jpeg|png|gif|svg|css|js|ico|webp|woff|woff2|ttf)$/
    );

  // If it's not a public route, protect it
  if (!isPublicRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
