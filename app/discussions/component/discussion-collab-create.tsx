"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { hackerMedium } from "@/fonts/font";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const COLLAB_CATEGORIES = [
    "Hackathon",
    "Study Group",
    "Startup",
    "Open Source",
    "Content Creation",
    "Event Team",
    "Research",
    "Other"
] as const;

interface CollabCreatorProps {
    onCollabCreate: (collabData: { category: string; numPeopleNeeded: number }) => void;
    onCancel: () => void;
}

export const CollabCreator = ({ onCollabCreate, onCancel }: CollabCreatorProps) => {
    const [category, setCategory] = useState<string>("");
    const [numPeopleNeeded, setNumPeopleNeeded] = useState<number>(1);
    const [error, setError] = useState<string>("");

    const handleSubmit = () => {
        if (!category) {
            setError("Please select a category");
            return;
        }

        if (numPeopleNeeded < 1) {
            setError("Number of people must be at least 1");
            return;
        }

        onCollabCreate({
            category,
            numPeopleNeeded
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-4 rounded-2xl border border-darkBorder bg-darksec/20"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium" style={hackerMedium.style}>
                    Create Collaboration
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-300"
                >
                    Cancel
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full border-darkBorder bg-darksec/30">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {COLLAB_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Number of People Needed</label>
                    <Input
                        type="number"
                        min={1}
                        max={20}
                        value={numPeopleNeeded}
                        onChange={(e) => setNumPeopleNeeded(parseInt(e.target.value) || 1)}
                        className="border-darkBorder bg-darksec/30"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl"
                        style={hackerMedium.style}
                    >
                        Create Collab
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

