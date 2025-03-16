"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";

export default function NotificationsPage() {
    return (
        <div className="flex flex-col w-full items-center justify-center min-h-screen  p-6 text-center">
            <div className="max-w-md mx-auto flex flex-col items-center">
                <div className="mb-8 w-48 h-48">
                    <img
                        src="/no-notification-img-t.png"
                        alt="No notifications"
                        className="w-full h-full"
                    />
                </div>

                <h1 className="text-2xl font-bold text-[#FDFCFD] mb-3">
                    {` You don't have any notifications`}
                </h1>

                <p className="text-[#666D70] mb-8">
                    {`  We'll notify you when there's new activity or updates related to your interests, events, or connections. `}
                </p>

                <div className="flex flex-col space-y-4 w-full max-w-xs">
                    <Button
                        className="w-full bg-[#5E04D5] hover:bg-[#4C03AA]"
                        onClick={() => window.location.href = "/events"}
                    >
                        <DynamicSvgIcon
                            src="/explore.svg"
                            isActive={false}
                            size={18}
                            classname="mr-2"
                        />
                        Explore Events
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full border-[#303130] text-[#FDFCFD] hover:bg-[#262626]"
                        onClick={() => window.location.href = "/"}
                    >
                        Go Home
                    </Button>
                </div>
            </div>

            <div className="text-sm text-[#666D70] mt-12">
                <p>Check back later for updates and new notifications</p>
            </div>
        </div>
    );
}