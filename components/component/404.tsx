

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FourZeroFour() {
    return (
        <div className="flex flex-col items-center justify-center h-full  p-6 text-center">
            <div className="max-w-md mx-auto flex flex-col items-center">
                <div className="mb-8 w-64 h-64">
                    <img
                        src="/gone-mad-404.png"
                        alt="Page not found"
                        className="w-full h-full"
                    />
                </div>

                <h1 className="text-4xl font-bold text-[#FDFCFD] mb-3">404</h1>
                <h2 className="text-2xl font-bold text-[#FDFCFD] mb-6">Page Not Found</h2>

                <p className="text-[#666D70] mb-8">
                    {`Oops! Looks like we've gone a bit mad trying to find that page. It seems to have disappeared into the void.`}

                </p>

                <div className="flex flex-col space-y-4 w-full max-w-xs">
                    <Link href="/">
                        <Button
                            className="w-full bg-[#5E04D5] hover:bg-[#4C03AA]"
                        >
                            Back to Home
                        </Button>
                    </Link>

                    <Link href="/events">
                        <Button
                            variant="outline"
                            className="w-full border-[#303130] text-[#FDFCFD] hover:bg-[#262626]"
                        >
                            Explore Events
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="text-sm text-[#666D70] mt-12">
                <p>If you believe this is an error, please contact support</p>
            </div>
        </div>
    );
}