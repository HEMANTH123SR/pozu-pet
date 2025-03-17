import type { Metadata } from "next";
import "./globals.css";
import { HackerNormal } from "@/fonts/font";
import { SideMenu } from "@/components/component/side-menu";
import { RightSideBar } from "@/components/component/right-side-menu";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { SandboxLoading } from "@/components/component/loading";
import { MobileNav } from "@/components/component/mobile-doc";
import { MobileHeader } from "@/components/component/mobile-header";
import { dark } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Kampus – Know What's Happening on Your Campus",
  description:
    "Stay connected with everything happening on your campus. Join Kampus to discover events, clubs, and discussions from your college community. Never miss out on campus activities, competitions, or opportunities again.",
  keywords:
    "campus events, college activities, university clubs, student community, campus news, college discussions, student events, university life, campus updates, college competitions",
  openGraph: {
    title: "Kampus – Know What's Happening on Your Campus",
    description:
      "Your go-to platform for staying updated with campus life. Join clubs, engage in discussions, discover events, and share your achievements with your college community.",
    url: "https://kampus.social",
    siteName: "Kampus",
    images: [
      {
        url: "https://kampus.social/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kampus - Your Campus Community Hub",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@KampusSocial",
    title: "Kampus – Know What's Happening on Your Campus",
    description:
      "Never miss a beat on campus! Stay updated with events, join club discussions, and showcase your work on your university's premier social platform.",
    images: [
      {
        url: "https://kampus.social/twitter-image.png",
        alt: "Kampus - Know What's Happening on Your Campus",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" >
        <body
          className={`antialiased ${HackerNormal.className} bg-[#F3F5F7]  h-screen max-h-screen overflow-y-hidden  `}
        >
          <ClerkLoading>
            <SandboxLoading />
          </ClerkLoading>
          <ClerkLoaded>
            <div className="flex flex-col lg:flex-row  w-full min-h-screen mx-auto ">
              <SideMenu />
              <MobileHeader />
              {children}
              <MobileNav />
              <RightSideBar />
            </div>
          </ClerkLoaded>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}