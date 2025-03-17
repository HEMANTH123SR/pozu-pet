

"use client"
import React from 'react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hackerMedium } from '@/fonts/font';
import { OutputData } from '@editorjs/editorjs';
import { createImage } from "@/lib/appwrite/appwrite";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'


import { Button } from "@/components/ui/button";

// components
import RichTextEditor from "@/app/events/components/rich-text-editor"
import { CoverImage } from "@/app/events/components/cover-image";
import { Timeline } from '../components/time-line-component';
import { Venue } from "@/app/events/components/venue";
import { Category } from "@/app/events/components/category";
import { EventSettings } from "@/app/events/components/organize-event-setting";
import { useUser } from "@clerk/nextjs";

// interface
import { FormDataInterface, VenueType } from "@/app/events/lib/interface.organize";

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute} ${ampm}`;
});



export default function CreateEvent() {
  const { user, isLoaded, isSignedIn } = useUser();

  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(null)



  const [formData, setFormData] = useState<FormDataInterface>({
    title: "",
    coverImage: null,
    coverImageName: "",
    description: {
      time: new Date().getTime(),
      blocks: [
        {
          type: "header",
          data: {
            text: "Welcome to the Editor",
            level: 1
          }
        },
        {
          type: "paragraph",
          data: {
            text: "Start typing or press / for commands..."
          }
        }
      ]
    },
    startDate: new Date(),
    endDate: new Date(),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    venue: {
      type: "offline" as VenueType,
      location: "",
      meetLink: "",
    },
    category: "",
    requireApproval: false,
    maxCapacity: 50
  });

  const eventFormSchema = z.object({
    title: z.string().min(4, "Event name must be at least 4 characters long"),
    coverImage: z.any().nullable(),
    coverImageName: z.string(),
    description: z.any(),
    startDate: z.date(),
    endDate: z.date(),
    startTime: z.string(),
    endTime: z.string(),
    venue: z.object({
      type: z.enum(["offline", "online", "hybrid"]),
      location: z.string().refine(
        (val) => {
          if (["offline", "hybrid"].includes(formData.venue.type)) {
            return val.includes("google.com/maps");
          }
          return true;
        },
        { message: "Please provide a valid Google Maps location link" }
      ),
      meetLink: z.string().refine(
        (val) => {
          if (["online", "hybrid"].includes(formData.venue.type)) {
            return z.string().url().parse(val);
          }
          return true;
        },
        { message: "Please provide a valid meeting URL" }
      ),
    }),
    category: z.string().min(1, "Please select a category"),
    requireApproval: z.boolean(),
    maxCapacity: z.number().min(2, "Capacity must be at least 2 participants"),
  }).refine(
    (data) => {
      const startDateTime = new Date(
        `${data.startDate.toDateString()} ${data.startTime}`
      );
      return startDateTime > new Date();
    },
    { message: "Start time must be in the future" }
  ).refine(
    (data) => {
      const startDateTime = new Date(
        `${data.startDate.toDateString()} ${data.startTime}`
      );
      const endDateTime = new Date(
        `${data.endDate.toDateString()} ${data.endTime}`
      );
      return endDateTime > startDateTime;
    },
    { message: "End time must be after start time" }
  );





  const handleDescriptionChange = (data: OutputData) => {
    setFormData(prev => ({
      ...prev,
      description: data
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file,
        coverImageName: file.name
      }));

      const result = await createImage(file);
      if (result.status === "success") {
        setImageUrl(result.id);
        console.log("Image uploaded successfully", result.id);
      } else {
        toast({
          title: "Image Error",
          description: "Failed To Upload Image",
          variant: "destructive",
        });
      }
    }
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Cover image is required",
          variant: "destructive",
        });
        return;
      }

      const validatedData = eventFormSchema.parse({
        ...formData,
        coverImage: imageUrl ? imageUrl : "https://kampus.social/kampus-event-cover-image.png",
      });

      // Add user ID to the request
      const requestData = {
        ...validatedData,
        userId: user.id // Include Clerk user ID in the request
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      toast({
        title: "Success!",
        description: "Event created successfully",
      });

      // Redirect to the dashboard
      router.push(`/event/dashboard/${data.data.slug}`);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format validation errors
        const errorMessages = error.errors.map(err => err.message).join('\n');

        toast({
          title: "Validation Error",
          description: errorMessages,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong while creating the event",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Add authentication check
  if (!isSignedIn) {
    return <div>Please sign in to create an event</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col border-r border-darkBorder w-full h-screen overflow-y-scroll scroll-hidden text-text_primary p-10 space-y-8">
      {/* First Row: Cover Image and Event Name */}
      <div className="flex space-x-6 items-center">
        <div className="w-96 ">
          <CoverImage
            coverImage={formData.coverImage}
            coverImageName={formData.coverImageName}
            onImageUpload={handleImageUpload}
          />
        </div>
        <div className="flex-1  flex items-center">
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Your Event Name "
            className="text-6xl h-auto font-bold bg-transparent text-nowrap border-none placeholder:text-zinc-600 focus-visible:ring-0 p-0"
            style={hackerMedium.style}
          />
        </div>
      </div>

      {/* Second Row: Category and Timeline */}
      <div className="flex space-x-6">
        <div className="w-96 h-32 max-h-32 min-h-32 ">
          <Category
            value={formData.category}
            onChange={(category) => setFormData(prev => ({ ...prev, category }))}
          />
        </div>
        <div className="flex-1 h-32 max-h-32 min-h-32">
          <Timeline
            startDate={formData.startDate}
            endDate={formData.endDate}
            startTime={formData.startTime}
            endTime={formData.endTime}
            timeSlots={timeSlots}
            onStartDateChange={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
            onEndDateChange={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
            onStartTimeChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
            onEndTimeChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
          />
        </div>
      </div>

      {/* Third Row: Event Settings and Venue */}
      <div className="flex space-x-6">
        <div className="w-96 ">
          <EventSettings
            requireApproval={formData.requireApproval}
            maxCapacity={formData.maxCapacity}
            onApprovalChange={(requireApproval) => setFormData(prev => ({ ...prev, requireApproval }))}
            onCapacityChange={(maxCapacity) => setFormData(prev => ({ ...prev, maxCapacity }))}
          />
        </div>
        <div className="flex-1 ">
          <Venue
            type={formData.venue.type}
            location={formData.venue.location}
            meetLink={formData.venue.meetLink}
            onVenueChange={(venue) => setFormData(prev => ({ ...prev, venue }))}
          />
        </div>
      </div>

      {/* Fourth Row: Rich Text Editor */}
      <div className="w-full rounded-xl border p-4">
        <Label className="text-base text-text_primary mb-4 block">Description</Label>
        <RichTextEditor
          value={formData.description}
          onChange={handleDescriptionChange}
        />
      </div>


      <div className="flex justify-center  ">
        <Button
          type="submit"
          className="h-12 w-full text-lg"
          style={hackerMedium.style}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </div>

    </form>
  );
}

