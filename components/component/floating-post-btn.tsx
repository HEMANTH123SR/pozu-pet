"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";


export const FloatingPostButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/post');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-20 right-4 lg:hidden z-50 rounded-full bg-primary p-4 text-white shadow-lg hover:bg-primary/90 transition-colors"
            aria-label="Create new post"
        >
            <DynamicSvgIcon
                src="/discussion.svg"
                isActive={false}
                size={24}
            />

        </button>
    );
};

