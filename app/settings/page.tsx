"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { useUser, useAuth, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LogoutPage() {
    const { user } = useUser();
    const { sessionId } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center overflow-y-auto scroll-hidden  h-screen  p-6  py-40 text-center w-full border-r border-darkBorder">
            <div className="max-w-md mx-auto flex flex-col items-center">
                <div className="mb-8 w-48 h-48">
                    <img
                        src="/pls-dont-sign-out.png"
                        alt="Please don't sign out"
                        className="w-full h-full"
                    />
                </div>

                <h1 className="text-2xl font-bold text-[#FDFCFD] mb-3">Are you sure you want to sign out?</h1>

                <p className="text-[#666D70] mb-8">
                    {
                        ` We'll miss you! Remember, staying signed in means you won't miss any updates or notifications.`
                    }

                </p>

                <div className="flex flex-col space-y-4 w-full max-w-xs">
                    {sessionId && (
                        <SignOutButton signOutOptions={{ sessionId }}>
                            <Button
                                className="w-full bg-[#5E04D5] hover:bg-[#4C03AA] flex items-center justify-center"
                            >
                                <DynamicSvgIcon
                                    src="/logout.svg"
                                    isActive={false}
                                    size={18}
                                    classname="mr-2"
                                />
                                Sign Out
                            </Button>
                        </SignOutButton>
                    )}

                    <Link href="/">
                        <Button
                            variant="outline"
                            className="w-full border-[#303130] text-[#FDFCFD] hover:bg-[#262626]"
                        >
                            Stay Signed In
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="text-sm text-[#666D70] mt-12">
                <p>{user?.firstName ? `${user.firstName}, we` : "We"} hope to see you again soon!</p>
            </div>
        </div>
    );
}