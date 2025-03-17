"use client";
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VenueProps {
    type: "offline" | "online" | "hybrid";
    location: string;
    meetLink: string;
    onVenueChange: (venue: { type: "offline" | "online" | "hybrid", location: string, meetLink: string }) => void;
}

export const Venue: React.FC<VenueProps> = ({
    type,
    location,
    meetLink,
    onVenueChange,
}) => {
    const handleTypeChange = (value: string) => {
        onVenueChange({
            type: value as "offline" | "online" | "hybrid",
            location: type === "online" ? "" : location,
            meetLink: type === "offline" ? "" : meetLink
        });
    };

    const handleLocationChange = (value: string) => {
        onVenueChange({
            type,
            location: value,
            meetLink
        });
    };

    const handleMeetLinkChange = (value: string) => {
        onVenueChange({
            type,
            location,
            meetLink: value
        });
    };

    return (
        <div className="w-full  min-h-48 p-4 rounded-xl border-foreground border">
            <div className="flex flex-col space-y-6">
                <div className="space-y-3">
                    <Label className="text-lg text-text_primary">Venue Type</Label>
                    <RadioGroup
                        value={type}
                        onValueChange={handleTypeChange}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="offline" id="offline" />
                            <Label htmlFor="offline">Offline</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online" id="online" />
                            <Label htmlFor="online">Online</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hybrid" id="hybrid" />
                            <Label htmlFor="hybrid">Hybrid</Label>
                        </div>
                    </RadioGroup>
                </div>

                {(type === "offline" || type === "hybrid") && (
                    <div className="space-y-3">
                        <Label className="text-base text-zinc-400">Location</Label>
                        <Input
                            type="url"
                            placeholder="Google Maps Link"
                            value={location}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            className="bg-zinc-800/90 border-darkBorder"
                        />
                    </div>
                )}

                {(type === "online" || type === "hybrid") && (
                    <div className="space-y-3">
                        <Label className="text-base text-zinc-400">Meeting Link</Label>
                        <Input
                            type="url"
                            placeholder="Video Conference Link"
                            value={meetLink}
                            onChange={(e) => handleMeetLinkChange(e.target.value)}
                            className="bg-zinc-800/90 border-darkBorder"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

