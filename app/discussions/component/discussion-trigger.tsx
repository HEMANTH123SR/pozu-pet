"use client";
import React from 'react'
import { motion } from "framer-motion";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { Avatar } from "@/components/ui/avatar";
import Image from 'next/image';
import { hackerMedium } from '@/fonts/font';


export const DiscussionTriggger = ({ profileImage }: { profileImage: string }) => {
    return (

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group z-30 w-full border-b border-darkBorder bg-darksec/20 hover:bg-darksec/40 transition-all duration-300 cursor-pointer hidden  lg:block"
        >
            <div className="flex items-start gap-4 p-4">
                <Avatar className="w-12 h-12 border-2 border-darkBorder  ring-offset-2 ring-offset-darkBackground">
                    <Image
                        src={profileImage}
                        alt="User"
                        width={46}
                        height={46}
                        className="rounded-full object-cover"
                        priority
                    />
                </Avatar>
                <div className="flex-1 space-y-4">
                    <div className="relative">
                        <div className="w-full cursor-pointer bg-transparent text-darkTextSecondery placeholder:text-darkTextSecondery/60 text-lg z-10 focus:outline-none py-2 font-medium">
                            Share your thoughts...
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center -ml-2 gap-x-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className=" text-darkTextSecondery hover:text-darkTextPrimary hover:bg-darksec rounded-lg transition-colors duration-200"
                            >

                                <DynamicSvgIcon
                                    isActive={false}
                                    src='/image.svg'
                                    size={20}
                                />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className=" text-darkTextSecondery hover:text-darkTextPrimary hover:bg-darksec rounded-lg transition-colors duration-200"
                            >
                                <DynamicSvgIcon
                                    src='/link.svg'
                                    isActive={false}
                                    size={20}

                                />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className=" text-darkTextSecondery hover:text-darkTextPrimary hover:bg-darksec rounded-lg transition-colors duration-200"
                            >
                                <DynamicSvgIcon
                                    src='/smile-emoji.svg'
                                    isActive={false}
                                    size={20}

                                />
                            </motion.div>

                        </div>

                        <div className='flex space-x-3 justify-center items-center'>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={hackerMedium.style}
                                className="px-4 py-1 flex justify-center items-center space-x-2 border-darkBorder border-2 bg-darksec hover:scale-125 text-white rounded-full text-sm  font-medium transition-colors relative "

                            >
                                <span>Collab</span>

                                <DynamicSvgIcon
                                    isActive={false}
                                    src="/collabs.svg"
                                    size={17}
                                />
                            </motion.button>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={hackerMedium.style}
                                className="px-3 py-1 bg-primary hover:bg-primary/90 text-white rounded-2xl border-[3px] border-purple-900 font-medium shadow-lg shadow-primary/20 transition-all duration-200 text-sm"
                            >
                                Post
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
        </motion.div>

    )
}

