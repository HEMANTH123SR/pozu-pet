
import React from 'react'
import { ComingSoon } from "@/components/component/comming-soon"
import Link from 'next/link'
import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon'
import { hackerMedium } from '@/fonts/font'
const Clubs = () => {
    return (
        <div className='flex flex-col h-screen overflow-y-auto scroll-hidden w-full  border-r'>
            <div className="w-full flex items-center justify-between p-3 border-b border-darkBorder  lg:px-6   z-10 min-h-14 h-14 ">
                <div className="flex items-center justify-start space-x-3.5">
                    <Link
                        href={"/"}
                        className="p-1.5  rounded-full transition-transform duration-200  active:scale-95 hover:shadow-md hover:text-primary hover:scale-110"
                    >

                        <DynamicSvgIcon
                            isActive={false}
                            src='/arrow-left.svg'
                            size={25}
                        />
                    </Link>

                    <span style={hackerMedium.style} className='text-lg'>Go Back</span>
                </div>


            </div>

            <div className='flex w-full h-full justify-center items-center'>

                <ComingSoon />

            </div>

        </div>
    )
}

export default Clubs