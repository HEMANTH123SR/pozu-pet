import React from 'react';
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";



interface EventSettingsProps {
    requireApproval: boolean;
    maxCapacity: number;
    onApprovalChange: (value: boolean) => void;
    onCapacityChange: (value: number) => void;
}


export const EventSettings: React.FC<EventSettingsProps> = ({
    requireApproval,
    maxCapacity,
    onApprovalChange,
    onCapacityChange,
}) => {
    return (
        <div className="w-full h-48 min-h-48 max-h-48 p-4 rounded-xl border-foreground border">
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-base text-text_primary">Require Approval</Label>
                        <p className="text-sm text-zinc-500">Toggle if you want to manually approve participants</p>
                    </div>
                    <Switch
                        checked={requireApproval}
                        onCheckedChange={onApprovalChange}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-base text-zinc-400">Maximum Capacity</Label>
                    <Input
                        type="number"
                        min={1}
                        value={maxCapacity}
                        onChange={(e) => onCapacityChange(parseInt(e.target.value) || 0)}
                        placeholder="Enter maximum number of participants"
                        className="bg-zinc-800/90 border-darkBorder"
                    />
                </div>
            </div>
        </div>
    );
};