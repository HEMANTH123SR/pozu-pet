"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/ac";
import { hackerMedium, strawberry } from "@/fonts/font";

export function Faq() {
  return (
    <div
      className="w-full flex flex-col justify-center items-center mt-40 "
      style={{ lineHeight: 1 }}
    >
      <div className="w-full flex flex-col justify-center items-center px-2.5">
        <h3
          className="text-6xl text-center capitalize "
          style={strawberry.style}
        >
          Questions → Answers
        </h3>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full mt-6 "
        style={hackerMedium.style}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            What is Kampus?
          </AccordionTrigger>
          <AccordionContent>
            Kampus is a community platform designed to help students learn,
            grow, and connect. We solve the challenge of finding the right
            people and opportunities in your academic ecosystem.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">
            What key features does Kampus offer?
          </AccordionTrigger>
          <AccordionContent>
            Kampus provides multiple features including Discussions, Clubs,
            Institutes, Events, Competitions, Launch Pad, and a Student Store.
            Each feature is designed to enhance student networking, learning,
            and opportunities.
          </AccordionContent>
        </AccordionItem>

        {/* <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">
            What makes the Clubs feature unique?
          </AccordionTrigger>
          <AccordionContent>
            We solve club discovery challenges by providing a centralized
            platform where students can find both campus and external clubs,
            track their activities, and connect with like-minded peers.
          </AccordionContent>
        </AccordionItem> */}
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">
            How does the Launch Pad work?
          </AccordionTrigger>
          <AccordionContent>
            Launch Pad is a dedicated space to showcase your startup, project,
            or idea. Get community feedback, find interested collaborators, and
            gain initial traction for your innovative concepts.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left">
            What can I find in the Student Store?
          </AccordionTrigger>
          <AccordionContent>
            Our store offers products specifically curated for students, from
            electronic gadgets for projects to specialized merchandise. We also
            encourage students to sell their own products.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
