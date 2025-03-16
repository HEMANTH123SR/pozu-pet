

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import Link from "next/link";
import { hackerMedium, strawberry } from "@/fonts/font";
import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { createImage } from "@/lib/appwrite/appwrite";

export default function VerificationPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [collegeId, setCollegeId] = useState("");
    const [idImage, setIdImage] = useState(null);
    const [selfieImage, setSelfieImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [verificationStatus, setVerificationStatus] = useState(null);

    useEffect(() => {
        // If user is loaded, check if they already have a verification request
        if (isLoaded && user) {
            checkVerificationStatus();
        }
    }, [isLoaded, user]);

    const checkVerificationStatus = async () => {
        try {
            const response = await fetch(`/api/student-verification?username=${user.username}`);

            if (response.ok) {
                const data = await response.json();
                setVerificationStatus(data.status);

                // If they already have a verification, show the submitted screen
                if (data.status) {
                    setSubmitted(true);
                }
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
        }
    };

    const handleIdImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setIdImage(e.target.files[0]);
        }
    };

    const handleSelfieImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelfieImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!isLoaded || !user) {
            setErrorMessage("You must be logged in to submit verification");
            return;
        }

        if (collegeId && idImage && selfieImage) {
            setIsSubmitting(true);

            try {
                // Upload images to Appwrite first
                const idCardRes = await createImage(idImage);
                if (idCardRes.status !== "success") {
                    throw new Error("Failed to upload college ID card");
                }

                const selfieRes = await createImage(selfieImage);
                if (selfieRes.status !== "success") {
                    throw new Error("Failed to upload selfie with ID card");
                }

                // Now send only the image IDs to the backend
                const response = await fetch("/api/student-verification", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: user.username,
                        collegeIdNumber: collegeId,
                        collegeIdCard: idCardRes.id,
                        selfieCard: selfieRes.id
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setSubmitted(true);
                } else {
                    setErrorMessage(data.error || "Failed to submit verification");
                }
            } catch (error) {
                console.error("Error submitting verification:", error);
                setErrorMessage(error.message || "An error occurred while submitting your verification");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5E04D5]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col pt-14 lg:pt-0 items-center justify-center h-full p-6">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-[#FDFCFD] mb-3">Login Required</h1>
                    <p className="text-[#666D70] mb-6">
                        You need to be logged in to verify your student status.
                    </p>
                    <Button
                        onClick={() => router.push('/sign-in')}
                        className="w-full bg-[#5E04D5] hover:bg-[#4C03AA]"
                        style={hackerMedium.style}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    // Check if verification is already approved
    if (verificationStatus === "approved") {
        return (
            <div className="flex pt-14 lg:pt-0 flex-col items-center justify-center h-full p-6">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 w-32 h-32 mx-auto">
                        <DynamicSvgIcon
                            src="/flex-icon-set/checkmark.svg"
                            isActive={true}
                            size={128}
                            classname="text-[#5E04D5]"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-[#FDFCFD] mb-3">Verification Approved</h1>
                    <p className="text-[#666D70] mb-6">
                        Your student status has been verified. You now have access to all exclusive features.
                    </p>
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="w-full border-[#303130] text-[#FDFCFD] hover:bg-[#262626]"
                        >
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-y-scroll scroll-hidden  pt-20 lg:p-6 p-6 w-full">
            <div className="max-w-md mx-auto w-full">
                {!submitted ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-[#FDFCFD] mb-3"
                                style={strawberry.style}
                            >Student Verification</h1>
                            <p className="text-[#666D70]">
                                Verify your student status to unlock exclusive features on Kampus.
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-900/20 border border-red-900/50 rounded-md p-3 mb-6 text-red-400">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#FDFCFD]">
                                    College ID Number
                                </label>
                                <input
                                    type="text"
                                    value={collegeId}
                                    onChange={(e) => setCollegeId(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#262626] border border-[#303130] rounded-md text-[#FDFCFD] focus:outline-none focus:ring-2 focus:ring-[#5E04D5]"
                                    placeholder="Enter your college ID number"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#FDFCFD]">
                                    College ID Card (Front)
                                </label>
                                <div className="border-2 border-dashed border-[#303130] rounded-md p-4 text-center relative">
                                    {idImage ? (
                                        <div className="text-[#FDFCFD]">
                                            {idImage.name}
                                            <button
                                                type="button"
                                                onClick={() => setIdImage(null)}
                                                className="ml-2 text-red-400 hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col lg:flex-row">
                                            <DynamicSvgIcon
                                                src="/flex-icon-set/upload.svg"
                                                isActive={false}
                                                size={32}
                                                classname="mx-auto mb-2"
                                            />
                                            <p className="text-[#666D70] text-sm">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-[#666D70] text-xs mt-1">
                                                PNG, JPG or PDF (max. 5MB)
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleIdImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#FDFCFD]">
                                    Selfie with ID Card
                                </label>
                                <div className="border-2 border-dashed border-[#303130] rounded-md p-4 text-center relative">
                                    {selfieImage ? (
                                        <div className="text-[#FDFCFD]">
                                            {selfieImage.name}
                                            <button
                                                type="button"
                                                onClick={() => setSelfieImage(null)}
                                                className="ml-2 text-red-400 hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col lg:flex-row">

                                            <DynamicSvgIcon
                                                src="/flex-icon-set/camera.svg"
                                                isActive={false}
                                                size={32}
                                                classname="mx-auto mb-2"
                                            />
                                            <p className="text-[#666D70] text-sm">
                                                Take a selfie holding your ID card
                                            </p>
                                            <p className="text-[#666D70] text-xs mt-1">
                                                Make sure both your face and ID are clearly visible
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="user"
                                        onChange={handleSelfieImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#5E04D5] hover:bg-[#4C03AA] disabled:bg-[#3A0285] disabled:cursor-not-allowed"
                                style={hackerMedium.style}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    "Submit for Verification"
                                )}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="mb-8 w-32 h-32 mx-auto">
                            <DynamicSvgIcon
                                src="/flex-icon-set/checkmark.svg"
                                isActive={true}
                                size={128}
                                classname="text-[#5E04D5]"
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-[#FDFCFD] mb-3">Verification Submitted</h1>

                        <div className="bg-[#262626] border border-[#303130] rounded-md p-6 mb-6">
                            <h2 className="text-lg font-medium text-[#FDFCFD] mb-4">What happens next?</h2>

                            <div className="space-y-4 text-left">
                                <div className="flex items-start">
                                    <div className="bg-[#5E04D5] rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-3">
                                        <span className="text-white text-sm">1</span>
                                    </div>
                                    <p className="text-[#FDFCFD]">
                                        Our team will review your student ID and selfie for authenticity
                                    </p>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-[#5E04D5] rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-3">
                                        <span className="text-white text-sm">2</span>
                                    </div>
                                    <p className="text-[#FDFCFD]">
                                        {`                                        We may cross-reference with your institution's database
`}
                                    </p>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-[#5E04D5] rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-3">
                                        <span className="text-white text-sm">3</span>
                                    </div>
                                    <p className="text-[#FDFCFD]">
                                        Verification typically takes 2-3 business days
                                    </p>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-[#5E04D5] rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-3">
                                        <span className="text-white text-sm">4</span>
                                    </div>
                                    <p className="text-[#FDFCFD]">
                                        {`                                        You'll receive an email notification once your verification is complete
`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full border-[#303130] text-[#FDFCFD] hover:bg-[#262626]"
                            >
                                Return to Home
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="text-sm text-[#666D70] mt-12 text-center">
                    <p>Your information is secure and will only be used for verification purposes</p>
                </div>
            </div>
        </div>
    );
}