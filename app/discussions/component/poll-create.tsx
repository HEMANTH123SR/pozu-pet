

// PollCreator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
//   import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon';

interface PollCreatorProps {
    onPollCreate: (options: string[]) => void;
    onCancel: () => void;
}

export function PollCreator({ onPollCreate, onCancel }: PollCreatorProps) {
    const [options, setOptions] = useState(['', '']);

    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, '']);
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        const validOptions = options.filter(option => option.trim() !== '');
        if (validOptions.length >= 2) {
            onPollCreate(validOptions);
        }
    };

    return (
        <div className="space-y-4 p-4 border border-darkBorder rounded-2xl">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Create Poll</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-300"
                >
                    Cancel
                </Button>
            </div>

            <div className="space-y-2">
                {options.map((option, index) => (
                    <Input
                        key={index}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="bg-darksec "
                    />
                ))}
            </div>

            <div className="flex items-center gap-2">
                {options.length < 4 && (
                    <Button
                        type="button"
                        onClick={addOption}
                        variant="outline"
                        className="text-primary rounded-2xl"
                    >
                        Add Option
                    </Button>
                )}
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-primary text-white rounded-2xl"
                    disabled={options.filter(o => o.trim() !== '').length < 2}
                >
                    Create Poll
                </Button>

            </div>
        </div>
    );
}