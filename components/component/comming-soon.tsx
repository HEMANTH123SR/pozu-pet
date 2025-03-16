


"use client";

import React, { useState, } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ComingSoon() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // In a real application, you would send this to your backend
            console.log("Email submitted:", email);
            setSubmitted(true);
            setEmail("");

            // Reset the submitted state after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 3000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center   p-6 text-center">
            <div className="max-w-md mx-auto flex flex-col items-center">
                <div className="mb-8 w-64 h-64">
                    <img
                        src="/chill-comming-soon.png"
                        alt="Coming soon"
                        className="w-full h-full"
                    />
                </div>

                <h1 className="text-3xl font-bold text-[#FDFCFD] mb-3">Coming Soon</h1>

                <p className="text-[#666D70] mb-8">
                    {
                        `
                   We're working on something awesome! This feature will be available soon. 
          Stay chill and check back later, or subscribe to get notified when we launch.
                `
                    }

                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-xs mb-6">
                    <div className="flex flex-col space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="px-4 py-2 bg-[#262626] border border-[#303130] rounded-md text-[#FDFCFD] focus:outline-none focus:ring-2 focus:ring-[#5E04D5]"
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full bg-[#5E04D5] hover:bg-[#4C03AA]"
                        >
                            Notify Me
                        </Button>

                        {submitted && (
                            <p className="text-green-400 text-sm">
                                {`                Thanks! We'll notify you when we launch.
`}
                            </p>
                        )}
                    </div>
                </form>

                <Link href="/">
                    <Button
                        variant="outline"
                        className="w-full max-w-xs border-[#303130] text-[#FDFCFD] hover:bg-[#262626]"
                    >
                        Back to Home
                    </Button>
                </Link>
            </div>

        </div>
    );
}