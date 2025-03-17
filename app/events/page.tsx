

"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy } from "lucide-react";
import { useRouter } from "next/navigation"

interface Event {
    id: string;
    name: string;
    description: string;
    cover_img?: string;
    url: string;
    slug: string;
    starts_at: string;
    ends_at: string;
    themes?: string[];
    platform: string;
}

interface FilterState {
    platform: string;
    theme: string;
    search: string;
}

export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        platform: "",
        theme: "",
        search: "",
    });


    const fetchEvents = async (params: FilterState) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.search) queryParams.set("search", params.search);
            if (params.platform) queryParams.set("platform", params.platform);
            if (params.theme) queryParams.set("theme", params.theme);

            const response = await fetch(`/api/event-aggregator/events?${queryParams}`);
            const data = await response.json();
            setEvents(Array.isArray(data.events) ? data.events : []);


        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(filters);
    }, [filters]);

    const handleSearch = (value: string) => {
        setFilters(prev => ({ ...prev, search: value }));
    };


    return (
        <div className="py-6 px-4  h-screen min-h-screen w-full">


            <div className="mb-6 pt-14 lg:pt-0">
                <div className="relative">
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search events..."
                        className="w-full bg-[#262626] text-[#FDFCFD] rounded-lg pl-11 pr-4 py-3 border border-[#303130] focus:outline-none focus:border-[#5E04D5] focus:ring-1 focus:ring-[#5E04D5]"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <DynamicSvgIcon
                            src="/explore.svg"
                            isActive={false}
                            size={22}
                            classname="text-[#666D70]"
                        />
                    </div>
                </div>
            </div>
            <div className="h-full overflow-y-auto scroll-hidden ">

                <div className="space-y-4 ">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-40 rounded-xl bg-[#262626]" />
                        ))
                    ) : events.length > 0 ? (
                        events.map((event) => (
                            <Card key={event.id} className="bg-background border border-darkBorder hover:border-[#5E04D5] transition-all rounded-lg cursor-pointer "
                                onClick={() => {
                                    if (event.url.includes("devfolio.co")) {
                                        router.push(`https://${event.url}`)
                                        return
                                    }
                                    router.push(event.url)
                                }}
                            >
                                <CardContent className="p-3 lg:p-6 ">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {event.cover_img && (
                                            <div className="w-full md:w-48 md:min-w-48 min-h-32 h-32">
                                                <img
                                                    src={event.cover_img}
                                                    alt={event.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <Badge className="bg-[#5E04D5]">{event.platform}</Badge>
                                                {event.themes?.map((theme) => (
                                                    <Badge key={theme} variant="outline" className="bg-[#303130] text-[#FDFCFD] border-none">
                                                        {theme}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <h2 className="text-xl font-semibold text-[#FDFCFD] mb-2">{event.name}</h2>
                                            <p className="text-sm text-[#666D70] mb-4 hidden lg:block">{event.description.slice(0, 60)}...</p>
                                            <p className="text-sm text-[#666D70] mb-4  lg:hidden">{event.description.slice(0, 120)}...</p>
                                            <div className="flex items-center gap-6 text-sm text-[#666D70]">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {event.starts_at}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Trophy size={16} />
                                                    ${Math.floor(Math.random() * 10000)} in prizes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[#666D70]">No events found</p>
                        </div>
                    )}
                </div>
                <div className="h-60 min-h-60"></div>

            </div>

        </div>


    );
}

