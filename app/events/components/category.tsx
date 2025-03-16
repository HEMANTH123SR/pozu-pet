import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Category Component
interface CategoryProps {
    value: string;
    onChange: (value: string) => void;
}

export const Category: React.FC<CategoryProps> = ({ value, onChange }) => {
    const categories = [
        { value: "academic", label: "Academic & Studies" },
        { value: "career", label: "Career & Professional Development" },
        { value: "cultural", label: "Cultural & Diversity" },
        { value: "tech", label: "Technology & Innovation" },
        { value: "sports", label: "Sports & Fitness" },
        { value: "arts", label: "Arts & Creative" },
        { value: "social", label: "Social & Networking" },
        { value: "community", label: "Community Service" },
        { value: "workshop", label: "Workshops & Training" },
        { value: "competition", label: "Competitions & Hackathons" }
    ];

    return (
        <div className="w-full h-32 min-h-32 max-h-32 p-4 rounded-xl border-darksec border">
            <div className="space-y-3 ">
                <div className='flex flex-col space-y-1'>
                    <Label className="text-base text-darkTextPrimary">Event Category</Label>
                    <p className='text-sm text-zinc-500'>Pick a event category</p>
                </div>
                {/* <span>pick  a event category</span> */}
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full bg-zinc-800/90 border-darkBorder">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}