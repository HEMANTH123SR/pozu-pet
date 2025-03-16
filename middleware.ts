import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtecteddRoute = createRouteMatcher([
  "/client",
  "/dashboard",
  "/discussions/:id",
  "/landing",
  "/invite",
  "/chat",
  "/events/dashboard/:id",
]);

export default clerkMiddleware(async (auth, request) => {
  if (request.url.includes("/sso-callback")) {
    return; // Allow access to the callback route
  }
  if (isProtecteddRoute(request)) {
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
