

"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getImage } from '@/lib/appwrite/appwrite';
import { hackerMedium } from '@/fonts/font';
import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon';
import Link from 'next/link';

export const EventDetailsCard = ({ event }) => {
    const [imageUrl, setImageUrl] = useState(undefined);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const loadEventImage = async () => {
            if (event?.coverImage) {
                try {
                    setLoadingImage(true);
                    const url = await getImage(event.coverImage);
                    setImageUrl(url);
                } catch (error) {
                    console.error('Error loading image:', error);
                    setImageUrl(undefined);
                } finally {
                    setLoadingImage(false);
                }
            } else {
                setLoadingImage(false);
            }
        };

        loadEventImage();
    }, [event?.coverImage]);

    if (!event) return null;

    return (
        <div className="flex flex-col gap-6 col-span-3 border border-darkBorder rounded-2xl p-4">
            <Card className=" bg-darkBackground border-b-0 w-full">
                <div className="flex  gap-6 w-full">
                    {/* Left side - Image */}
                    <div className="relative w-1/2 h-72 ">
                        {loadingImage ? (
                            <div className="w-full h-full bg-secondary animate-pulse rounded-lg" />
                        ) : imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={event.title || "Event cover"}
                                className="object-cover rounded-xl border-2"
                                fill
                                sizes="(max-width: 768px) 100vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-secondary rounded-xl" />
                        )}
                    </div>

                    {/* Right side - Event Details */}
                    <div className="flex flex-col flex-1 gap-4 pt-4">


                        <div>



                            <div className="flex flex-col gap-5">

                                <h3 className='text-2xl' style={hackerMedium.style}>When & Where</h3>
                                <div className="flex items-center  space-x-3.5 text-darkTextPrimary">
                                    <div className='p-2 bg-darksec border-2 border-darkBorder  rounded-xl'>
                                        <DynamicSvgIcon
                                            isActive={false}
                                            src='/flex-icon-set/cal.svg'
                                            classname=''
                                            size={25}
                                        />
                                    </div>
                                    <div>
                                        <p className=" text-lg" style={hackerMedium.style}>
                                            {format(new Date(event.startDate), 'MMM d')} - {format(new Date(event.endDate), 'MMM d, yyyy')}
                                        </p>

                                    </div>
                                </div>

                                {event.venue && (
                                    <div className="flex items-start space-x-3.5 text-darkTextPrimary">
                                        <div className='p-2 bg-darksec border-2 border-darkBorder  rounded-xl'>
                                            <DynamicSvgIcon
                                                isActive={false}
                                                src='/flex-icon-set/map.svg'
                                                classname=''
                                                size={25}
                                            />
                                        </div>
                                        <div>

                                            {event.venue.type === 'online' ? (
                                                <div className='flex flex-col items-start'>
                                                    <p className=" text-lg" style={hackerMedium.style}>Online Event</p>
                                                    <p className="text-sm text-zinc-400">
                                                        {event.venue.online}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col items-start'>
                                                    <p className="text-lg" style={hackerMedium.style}>Offline Event</p>
                                                    <Button variant='link' className="text-sm text-zinc-400 px-0 mx-0">
                                                        <Link href={``}>
                                                            View on Maps
                                                        </Link>

                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className='flex space-x-5 w-full'>

                                    <Button variant='secondary' className='w-full text-base'>Change  Image </Button>
                                    <Button variant='secondary' className='w-full text-base'>Edit Event</Button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
};