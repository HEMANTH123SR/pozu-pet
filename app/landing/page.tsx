"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { hackerMedium, strawberry } from "@/fonts/font";

// components
import { HeroTextContent } from "@/app/landing/components/hero";
import { GetEarlyAccess } from "@/app/landing/components/waitlist";
import { FeatureCard } from "@/app/landing/components/sinchan";
import { Faq } from "@/app/landing/components/faq";
import { KampusFooter } from "./components/fotter";

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex flex-col lg:max-w-[800px] w-full h-screen overflow-y-scroll scroll-hidden   mx-auto">
      <header className="flex items-center justify-between mt-5">
        <div
          className={`flex justify-between items-center transition-all duration-700 delay-100 transform
        ${mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
        >
          <Link
            href="/"
            className="flex space-x-1.5 items-center justify-start 
            hover:scale-105 active:scale-95 transition-transform duration-300 ease-out 
            group cursor-pointer"
            aria-label="Go to Sandbox Home"
          >
            <Image
              src="/kampus.png"
              alt="Sandbox Logo"
              width={60}
              height={60}
              className="group-hover:rotate-6 transition-transform duration-300"
            />
            <span
              className={`${strawberry.className} uppercase font-semibold text-[#09090B] text-4xl group-hover:text-blue-600 transition-colors duration-300 `}
            >
              Kampus
            </span>
          </Link>
        </div>

        <div className="flex justify-center items-center space-x-10">
          {["discussion", "clubs", "academy"].map((item, index) => (
            <button
              key={index}
              className={`text-black capitalize transition-all text-[1.05rem] duration-300 
              ${
                hoveredItem === item
                  ? "scale-110 text-blue-600"
                  : "scale-100 text-black"
              } hover:underline`}
              style={hackerMedium.style}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item}
            </button>
          ))}
        </div>

        <div
          className="bg-primary  border-blue-800 border-b-4 border-2 capitalize text-white 
          rounded-xl px-4 py-1.5 
          animate-bounce-soft hover:animate-none 
          transition-all duration-300 
          cursor-pointer 
          hover:bg-blue-600 
          hover:border-blue-900
          group"
          style={hackerMedium.style}
        >
          <span className="block group-hover:animate-ping-once text-lg">
            launching in jan
          </span>
        </div>
      </header>
      <HeroTextContent />
      <GetEarlyAccess />
      <div className="py-5"></div>
      <div className="relative mx-auto max-w-4xl">
        <div className="bg-gradient-to-b from-[#0056FE] to-blue-600 border-4 border-blue-800 p-3 rounded-t-2xl shadow-2xl">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <img
            src="/kampus-website.png"
            alt="Sandbox Platform Interface"
            className="w-full shadow-lg"
          />
        </div>
      </div>
      <FeatureCard
        sectionName="Discussion Feed"
        ctaText="View Feed"
        description="A space for students to engage in meaningful conversations, share ideas, and collaborate. Similar to tweets, but we call them discussions to encourage deeper interactions. It’s designed to inspire active participation, helping students connect and grow within the community."
        title="Start a Discussion, Build Connections"
        lightImage="/discussion.png"
      />

      <FeatureCard
        sectionName="Clubs "
        ctaText="View Clubs"
        description="Discover a wide variety of clubs tailored to your interests. Kampus solves the problem of inactive and undiscovered clubs by providing a platform where students can easily connect and engage with their communities."
        title="Connect Through Campus Clubs"
        lightImage="/clubs.png"
      />
      <FeatureCard
        sectionName="Academy"
        ctaText="View Academy"
        description="Discover institutions across India and connect with students, ambassadors, and alumni. From hackathons to competitions, Kampus provides insights into an institution’s vibrant activities, helping you make informed decisions and build your network."
        title="Explore Institutions, Connect with Peers"
        lightImage="/academy.png"
      />
      <FeatureCard
        sectionName="Competitions , Events"
        ctaText="Organize"
        description="kampus makes organizing competitions and events effortless with powerful tools for seamless management. Participants can discover exciting opportunities like hackathons, meetups, and conferences in one place. Whether you're an organizer or an attendee, Kampus streamlines the entire experience. Connect, engage, and grow with ease!."
        title="Organizing Competitions and Events Made Easy"
        lightImage="/compete.png"
      />
      <FeatureCard
        sectionName="Launch Pad"
        ctaText="launch"
        description="Launch Pad is a space where students can bring their ideas, projects, or startups to life. Share your vision, connect with like-minded individuals, and gather feedback from the community. Whether you're seeking collaborators or showcasing your innovations, Launch Pad helps you gain visibility and grow your project. Turn ideas into impact with support from the Kampus community!"
        title="Kickstart Your Ideas with Launch Pad"
        lightImage="/user-profile.png"
      />
      <Faq />
      <KampusFooter />
    </main>
  );
};

export default Landing;

// task to do
// add faq
// fotter
// make it responsive
// improve the accessibility
