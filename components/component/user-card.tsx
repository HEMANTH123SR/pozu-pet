import { hackerMedium, } from '@/fonts/font';
import { GraduationCap } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export const UserCard = ({ user }) => (
    <Link href={`/${user.username}`} className="flex p-2.5 sm:p-4 space-x-3 hover:bg-[#262626] transition-colors border-b border-[#303130]">
        <div className="relative w-12 h-12 shrink-0">
            <Image
                src={user.profileImage || "/default-avatar.png"}
                alt={`${user.fullName}'s profile`}
                className="rounded-full object-cover border-2 border-[#303130]"
                fill
                sizes="(max-width: 768px) 48px, 48px"
            />
        </div>

        <div className="flex-grow flex-col">
            <div className='flex justify-between items-start'>
                <div className='flex flex-col'>
                    <h3 className="text-[#FDFCFD] font-medium"
                        style={hackerMedium.style}
                    >{user.fullName}</h3>
                    <h4 className='text-text_secondary'>@{user.username}</h4>
                </div>
                {
                    user.university && <div className='flex items-center'>
                        <div className="text-white capitalize flex justify-center items-center bg-primary px-2.5 py-0.5 text-sm rounded-full">
                            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-1 fill-white" />
                            <span
                                style={hackerMedium.style}
                                className=' lg:text-nowrap'
                            >{user.university.toLowerCase()}</span>
                        </div>
                    </div>
                }
            </div>

            <p className="text-[#666D70] text-sm">{user.bio}</p>
        </div>
    </Link>
);