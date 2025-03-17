

"use client";
import React from 'react';
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimelineProps {
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    timeSlots: string[];
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
}

const TimePoint = ({
    isStart,
    date,
    time,
    onDateChange,
    onTimeChange,
    timeSlots,
    isCurrentTime,
    isAfterStart
}: {
    isStart: boolean;
    date: Date;
    time: string;
    onDateChange: (date: Date | undefined) => void;
    onTimeChange: (time: string) => void;
    timeSlots: string[];
    isCurrentTime: boolean;
    isAfterStart: boolean;
}) => {
    // Format date to show full month name, day and year
    const formattedDate = format(date, "MMMM d, yyyy");

    // Determine background styling based on conditions
    const getTimeButtonStyle = () => {
        if (isStart) {
            return isCurrentTime
                ? "border border-zinc-700 bg-transparent"
                : "bg-zinc-800/90";
        }
        return isAfterStart ? "bg-zinc-800/90" : "border border-zinc-700 bg-transparent";
    };

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isStart
                    ? 'bg-primary'
                    : 'border-2 border-primary bg-transparent'
                    }`} />
                <span className="text-base text-zinc-400">{isStart ? ' Start Date' : ' End Date'}</span>
            </div>

            <div className="flex gap-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={`flex items-center h-10 px-4 border border-darkBorder rounded-lg ${getTimeButtonStyle()}`}>
                            {formattedDate}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={onDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Select value={time} onValueChange={onTimeChange}>
                    <SelectTrigger className={`w-32 h-10 rounded-lg border-darkBorder border ${getTimeButtonStyle()}`}>
                        <SelectValue>{time}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                                {slot}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export const Timeline: React.FC<TimelineProps> = ({
    startDate,
    endDate,
    startTime,
    endTime,
    timeSlots,
    onStartDateChange,
    onEndDateChange,
    onStartTimeChange,
    onEndTimeChange,
}) => {
    const currentTime = format(new Date(), "h:mm a");
    const isStartCurrentTime = startTime === currentTime;

    const parseTimeString = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(
            period.toLowerCase() === 'pm' && hours !== '12'
                ? parseInt(hours) + 12
                : period.toLowerCase() === 'am' && hours === '12'
                    ? 0
                    : parseInt(hours),
            parseInt(minutes)
        );
        return date;
    };

    const isEndTimeAfterStart = parseTimeString(endTime).getTime() > parseTimeString(startTime).getTime();

    return (
        <div className="w-full">
            <div className="w-full p-4 rounded-xl border-foreground border">
                <div className="flex flex-col space-y-4 w-full">
                    <TimePoint
                        isStart={true}
                        date={startDate}
                        time={startTime}
                        onDateChange={onStartDateChange}
                        onTimeChange={onStartTimeChange}
                        timeSlots={timeSlots}
                        isCurrentTime={isStartCurrentTime}
                        isAfterStart={false}
                    />

                    <TimePoint
                        isStart={false}
                        date={endDate}
                        time={endTime}
                        onDateChange={onEndDateChange}
                        onTimeChange={onEndTimeChange}
                        timeSlots={timeSlots}
                        isCurrentTime={false}
                        isAfterStart={isEndTimeAfterStart}
                    />
                </div>
            </div>
        </div>
    );
};

export default Timeline;