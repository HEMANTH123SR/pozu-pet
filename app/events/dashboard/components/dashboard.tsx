"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Users,
    Settings,
    Calendar,
    Gift,
    HelpCircle,
    BarChart3,
} from 'lucide-react';
import { hackerMedium } from '@/fonts/font';
import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon';

// Import the correct component
import { EventDetailsCard } from "@/app/events/dashboard/components/tabs/overview/events-detail-card";

export const EventDashboard = ({ event }) => {
    console.log("event data ", event);
    if (!event) return null;

    return (
        <div className="min-h-screen  text-text_primary">
            {/* Header Section */}
            <div className="border-b border-zinc-800 p-4  w-full">
                <div className="flex px-6 items-center justify-between">
                    <div>
                        <h1 className="text-6xl font-bold" style={hackerMedium.style}>{event?.title || 'Event Dashboard'}</h1>
                    </div>
                    <Button
                        variant="outline"
                        className="text-zinc-400 hover:text-white"
                        onClick={() => window.open(`/event/${event?.slug}`, '_blank')}
                        style={hackerMedium.style}
                    >
                        <span className='text-base'>Event Page </span>
                        <DynamicSvgIcon
                            size={20}
                            isActive={false}
                            src='/flex-icon-set/arrow.svg'
                            classname='rotate-90'
                        />
                    </Button>
                </div>
            </div>

            {/* Quick Actions */}


            <div className="max-w-7xl mx-auto p-4 px-0">

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="border-b px-10 border-zinc-800 w-full justify-start bg-transparent">
                        <TabsTrigger value="overview" className="text-lg">Overview</TabsTrigger>
                        <TabsTrigger value="guests" className="text-lg">Guests</TabsTrigger>
                        <TabsTrigger value="registration" className="text-lg">Registration</TabsTrigger>
                        <TabsTrigger value="insights" className="text-lg">Insights</TabsTrigger>
                        <TabsTrigger value="settings" className="text-lg">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 mx-10">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Event Details Card */}
                            <EventDetailsCard event={event} />

                            {/* Quick Stats Card */}
                            <Card className="bg-foreground border-zinc-800">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-zinc-400 text-sm">Registered</p>
                                            <p className="text-2xl font-bold">{event?.registrationStats?.totalRegistered || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400 text-sm">Capacity</p>
                                            <p className="text-2xl font-bold">{event?.registration?.maxAttendees || 0}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature Cards */}
                            <Card className="bg-foreground border-zinc-800">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Schedule</h3>
                                    <Button variant="outline" className="w-full">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Manage Schedule
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-foreground border-zinc-800">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Prizes</h3>
                                    <Button variant="outline" className="w-full">
                                        <Gift className="h-4 w-4 mr-2" />
                                        Add Prizes
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-foreground border-zinc-800">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Support</h3>
                                    <Button variant="outline" className="w-full">
                                        <HelpCircle className="h-4 w-4 mr-2" />
                                        Configure Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="guests">
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                            <h3 className="text-lg font-medium">Guest Management Coming Soon</h3>
                            <p className="text-zinc-400 mt-2">Manage attendees, send communications, and track RSVPs</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="registration">
                        <div className="text-center py-12">
                            <Calendar className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                            <h3 className="text-lg font-medium">Registration Management Coming Soon</h3>
                            <p className="text-zinc-400 mt-2">Customize forms, manage waitlists, and handle surveys</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="insights">
                        <div className="text-center py-12">
                            <BarChart3 className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                            <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
                            <p className="text-zinc-400 mt-2">Track attendance, engagement, and other metrics</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="text-center py-12">
                            <Settings className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                            <h3 className="text-lg font-medium">Settings Coming Soon</h3>
                            <p className="text-zinc-400 mt-2">Manage event visibility, notifications, and more</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>


        </div>
    );
};