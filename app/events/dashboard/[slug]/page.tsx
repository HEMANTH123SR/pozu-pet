
"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EventInterface } from "@/app/events/lib/interface.dashboard";
import { EventDashboard } from '@/app/events/dashboard/components/dashboard';

export default function EventDetailsPage() {
    const { userId } = useAuth();
    const params = useParams();
    const [event, setEvent] = useState<EventInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchEventData() {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/events/dashboard/${params.slug}`,
                    {
                        headers: {
                            'X-User-Id': userId
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch event data");
                }

                const data = await response.json();
                setEvent(data.data);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                    console.error('Error fetching event:', err);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchEventData();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.slug, userId]);

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!event) {
        return <div className="text-center p-6">Event not found</div>;
    }

    return (
        <div className="w-full mx-auto py-5 border-r">

            <EventDashboard event={event} />
        </div>
    );
}