// "use client"
// import React, { useEffect, useState } from 'react';
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { useUser, useAuth, SignOutButton } from "@clerk/nextjs";
// import Link from "next/link";
// import { hackerMedium } from '@/fonts/font';
// import { DynamicSvgIcon } from './dynamic-svg-icon';



// export const UserSideMenu = () => {
//     const { user } = useUser();
//     const { sessionId } = useAuth();
//     const [userData, setUserData] = useState({
//         followers: 0,
//         following: 0,
//         fullName: "",
//         profileImage: "",
//         username: "",
//     });

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (user?.username) {
//                 try {
//                     const response = await fetch(`/api/user/get-user/${user.username}`);
//                     const data = await response.json();

//                     if (data.success) {
//                         setUserData({
//                             followers: data.data.followers?.length || 0,
//                             following: data.data.following?.length || 0,
//                             fullName: data.data.fullName,
//                             profileImage: data.data.profileImage,
//                             username: data.data.username
//                         });
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             }
//         };

//         fetchUserData();
//     }, [user?.username]);

//     const menuItems = [
//         {
//             icon: "/profile.svg",
//             label: 'Profile',
//             description: 'View and edit your profile',
//             href: `/${user?.username}`
//         },
//         {
//             icon: "/setting.svg",
//             label: 'Settings',
//             description: 'Edit profile, account, notifications, +2 more',
//             href: '/settings'
//         },
//         {
//             icon: "/bookmark.svg",
//             label: 'Bookmarks',
//             description: 'Saved projects and posts to visit later',
//             href: '/bookmark'
//         },
//         {
//             icon: "/star.svg",
//             label: 'Verification',
//             description: 'Manage identity and other verifications',
//             href: '/verify'
//         },
//         {
//             icon: "/invite.svg",
//             label: 'Invite Friends',
//             description: 'See who joined using your invite link',
//             href: '/invite'
//         },
//     ];

//     return (
//         <Sheet>
//             <SheetTrigger asChild>
//                 <button className="focus:outline-none">
//                     <Avatar className="h-10 w-10 border-2 border-darkBorder hover:border-primarytransition-colors">
//                         <AvatarImage src={userData.profileImage} alt={userData.fullName || 'User'} />
//                         <AvatarFallback>
//                             {user?.firstName?.charAt(0) || 'U'}
//                         </AvatarFallback>
//                     </Avatar>
//                 </button>
//             </SheetTrigger>

//             <SheetContent side="left" className="w-80 bg-background border-r border-darkBorder p-0">
//                 <div className="flex flex-col h-full">
//                     {/* User Profile Section */}
//                     <div className="p-4">
//                         <Avatar className="h-14 w-14 mb-3">
//                             <AvatarImage src={userData.profileImage} alt={userData.fullName || 'User'} />
//                             <AvatarFallback>{userData.fullName.charAt(0) || 'U'}</AvatarFallback>
//                         </Avatar>

//                         <h3 className="text-text_primary font-semibold text-lg">
//                             {userData.fullName || 'User Name'}
//                         </h3>
//                         <p className="text-text_secondary text-sm">@{userData.username}</p>

//                         <div className="flex gap-4 mt-3"
//                             style={hackerMedium.style}
//                         >
//                             <div className="text-text_primary">
//                                 <span className="font-semibold">{userData.following}</span>
//                                 <span className="text-sm ml-1">Following</span>
//                             </div>
//                             <div className="text-text_primary">
//                                 <span className="font-semibold">{userData.followers}</span>
//                                 <span className=" text-sm ml-1">Followers</span>
//                             </div>
//                         </div>
//                     </div>

//                     <Separator className="bg-[#303130]" />

//                     {/* Menu Items */}
//                     <nav className="flex-1 overflow-y-auto py-2">
//                         {menuItems.map((item, index) => (
//                             <Link
//                                 key={index}
//                                 href={item.href}
//                                 className="flex space-x-3 items-center gap-1 px-4 py-3 text-text_primary hover:bg-[#262626] transition-colors"
//                             >
//                                 <DynamicSvgIcon
//                                     src={item.icon}
//                                     isActive={false}
//                                     size={24}
//                                 />


//                                 <div className='flex flex-col '>
//                                     <span style={hackerMedium.style}>{item.label}</span>
//                                     <p className="text-text_secondary  text-sm ">
//                                         {item.description}
//                                     </p>
//                                 </div>

//                             </Link>
//                         ))}
//                     </nav>

//                     {/* Logout Button */}
//                     <div className="p-4 mt-auto">
//                         {sessionId && (
//                             <SignOutButton signOutOptions={{ sessionId }}>
//                                 <button className="flex items-center gap-3 text-text_primary hover:text-red-500 transition-colors w-full">
//                                     <DynamicSvgIcon
//                                         src='/logout.svg'
//                                         isActive={false}
//                                         size={24}
//                                     />
//                                     <span>Log out</span>
//                                 </button>
//                             </SignOutButton>
//                         )}
//                     </div>
//                 </div>
//             </SheetContent>
//         </Sheet>
//     );
// };



// "use client"
// import React, { useEffect, useState } from 'react';
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { useUser, useAuth, SignOutButton } from "@clerk/nextjs";
// import Link from "next/link";
// import { hackerMedium } from '@/fonts/font';
// import { DynamicSvgIcon } from './dynamic-svg-icon';

// export const UserSideMenu = () => {
//     const { user } = useUser();
//     const { sessionId } = useAuth();
//     const [open, setOpen] = useState(false);
//     const [userData, setUserData] = useState({
//         followers: 0,
//         following: 0,
//         fullName: "",
//         profileImage: "",
//         username: "",
//     });

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (user?.username) {
//                 try {
//                     const response = await fetch(`/api/user/get-user/${user.username}`);
//                     const data = await response.json();

//                     if (data.success) {
//                         setUserData({
//                             followers: data.data.followers?.length || 0,
//                             following: data.data.following?.length || 0,
//                             fullName: data.data.fullName,
//                             profileImage: data.data.profileImage,
//                             username: data.data.username
//                         });
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             }
//         };

//         fetchUserData();
//     }, [user?.username]);

//     const menuItems = [
//         {
//             icon: "/profile.svg",
//             label: 'Profile',
//             description: 'View and edit your profile',
//             href: `/${user?.username}`
//         },
//         {
//             icon: "/setting.svg",
//             label: 'Settings',
//             description: 'Edit profile, account, notifications, +2 more',
//             href: '/settings'
//         },
//         {
//             icon: "/bookmark.svg",
//             label: 'Bookmarks',
//             description: 'Saved projects and posts to visit later',
//             href: '/bookmark'
//         },
//         {
//             icon: "/star.svg",
//             label: 'Verification',
//             description: 'Manage identity and other verifications',
//             href: '/verify'
//         },
//         {
//             icon: "/invite.svg",
//             label: 'Invite Friends',
//             description: 'See who joined using your invite link',
//             href: '/invite'
//         },
//     ];

//     // Function to handle link clicks
//     const handleLinkClick = () => {
//         setOpen(false);
//     };

//     return (
//         <Sheet open={open} onOpenChange={setOpen}>
//             <SheetTrigger asChild>
//                 <button className="focus:outline-none">
//                     <Avatar className="h-10 w-10 border-2 border-darkBorder hover:border-primarytransition-colors">
//                         <AvatarImage src={userData.profileImage} alt={userData.fullName || 'User'} />
//                         <AvatarFallback>
//                             {user?.firstName?.charAt(0) || 'U'}
//                         </AvatarFallback>
//                     </Avatar>
//                 </button>
//             </SheetTrigger>

//             <SheetContent side="left" className="w-80 bg-background border-r border-darkBorder p-0">
//                 <div className="flex flex-col h-full">
//                     {/* User Profile Section */}
//                     <div className="p-4">
//                         <Avatar className="h-14 w-14 mb-3">
//                             <AvatarImage src={userData.profileImage} alt={userData.fullName || 'User'} />
//                             <AvatarFallback>{userData.fullName.charAt(0) || 'U'}</AvatarFallback>
//                         </Avatar>

//                         <h3 className="text-text_primary font-semibold text-lg">
//                             {userData.fullName || 'User Name'}
//                         </h3>
//                         <p className="text-text_secondary text-sm">@{userData.username}</p>

//                         <div className="flex gap-4 mt-3"
//                             style={hackerMedium.style}
//                         >
//                             <div className="text-text_primary">
//                                 <span className="font-semibold">{userData.following}</span>
//                                 <span className="text-sm ml-1">Following</span>
//                             </div>
//                             <div className="text-text_primary">
//                                 <span className="font-semibold">{userData.followers}</span>
//                                 <span className=" text-sm ml-1">Followers</span>
//                             </div>
//                         </div>
//                     </div>

//                     <Separator className="bg-[#303130]" />

//                     {/* Menu Items */}
//                     <nav className="flex-1 overflow-y-auto py-2">
//                         {menuItems.map((item, index) => (
//                             <Link
//                                 key={index}
//                                 href={item.href}
//                                 className="flex space-x-3 items-center gap-1 px-4 py-3 text-text_primary hover:bg-[#262626] transition-colors"
//                                 onClick={handleLinkClick}
//                             >
//                                 <DynamicSvgIcon
//                                     src={item.icon}
//                                     isActive={false}
//                                     size={24}
//                                 />

//                                 <div className='flex flex-col '>
//                                     <span style={hackerMedium.style}>{item.label}</span>
//                                     <p className="text-text_secondary  text-sm ">
//                                         {item.description}
//                                     </p>
//                                 </div>
//                             </Link>
//                         ))}
//                     </nav>

//                     {/* Logout Button */}
//                     <div className="p-4 mt-auto">
//                         {sessionId && (
//                             <SignOutButton signOutOptions={{ sessionId }}>
//                                 <button
//                                     className="flex items-center gap-3 text-text_primary hover:text-red-500 transition-colors w-full"
//                                     onClick={handleLinkClick}
//                                 >
//                                     <DynamicSvgIcon
//                                         src='/logout.svg'
//                                         isActive={false}
//                                         size={24}
//                                     />
//                                     <span>Log out</span>
//                                 </button>
//                             </SignOutButton>
//                         )}
//                     </div>
//                 </div>
//             </SheetContent>
//         </Sheet>
//     );
// };


"use client"
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUser, useAuth, } from "@clerk/nextjs";
import Link from "next/link";
import { hackerMedium } from '@/fonts/font';
import { DynamicSvgIcon } from './dynamic-svg-icon';

export const UserSideMenu = () => {
    const { user } = useUser();
    const { sessionId } = useAuth();
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState({
        followers: 0,
        following: 0,
        fullName: "",
        profileImage: "",
        username: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.username) {
                try {
                    const response = await fetch(`/api/user/get-user/${user.username}`);
                    const data = await response.json();

                    if (data.success) {
                        setUserData({
                            followers: data.data.followers?.length || 0,
                            following: data.data.following?.length || 0,
                            fullName: data.data.fullName,
                            profileImage: data.data.profileImage,
                            username: data.data.username
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [user?.username]);

    const menuItems = [
        {
            icon: "/profile.svg",
            label: 'Profile',
            description: 'View and edit your profile',
            href: `/${user?.username}`
        },
        {
            icon: "/setting.svg",
            label: 'Manage Profile',
            description: 'Edit profile, account, notifications, +2 more',
            href: '/edit-profile'
        },
        {
            icon: "/bookmark.svg",
            label: 'Bookmarks',
            description: 'Saved projects and posts to visit later',
            href: '/bookmark'
        },
        {
            icon: "/star.svg",
            label: 'Verification',
            description: 'Manage identity and other verifications',
            href: '/verify'
        },
        {
            icon: "/invite.svg",
            label: 'Invite Friends',
            description: 'See who joined using your invite link',
            href: '/invite'
        },
    ];

    // Function to handle link clicks with a tiny delay
    const handleLinkClick = () => {
        // Add a very tiny delay (50ms) before closing the menu
        setTimeout(() => {
            setOpen(false);
        }, 50);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="focus:outline-none">
                    <Avatar className="h-10 w-10 border-2 border-darkBorder hover:border-primarytransition-colors">
                        <AvatarImage src={userData.profileImage} alt={userData.fullName || 'User'} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-80 bg-background border-r border-darkBorder p-0">
                <div className="flex flex-col h-full">
                    {/* User Profile Section */}
                    <div className="p-4">
                        <Avatar className="h-14 w-14 mb-3">
                            <AvatarImage src={userData.profileImage} alt={userData.fullName || 'User'} />
                            <AvatarFallback>{userData.fullName.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>

                        <h3 className="text-text_primary font-semibold text-lg">
                            {userData.fullName || 'User Name'}
                        </h3>
                        <p className="text-text_secondary text-sm">@{userData.username}</p>

                        <div className="flex gap-4 mt-3"
                            style={hackerMedium.style}
                        >
                            <div className="text-text_primary">
                                <span className="font-semibold">{userData.following}</span>
                                <span className="text-sm ml-1">Following</span>
                            </div>
                            <div className="text-text_primary">
                                <span className="font-semibold">{userData.followers}</span>
                                <span className=" text-sm ml-1">Followers</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-[#303130]" />

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto py-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="flex space-x-3 items-center gap-1 px-4 py-3 text-text_primary hover:bg-[#262626] transition-colors"
                                onClick={handleLinkClick}
                            >
                                <DynamicSvgIcon
                                    src={item.icon}
                                    isActive={false}
                                    size={24}
                                />

                                <div className='flex flex-col '>
                                    <span style={hackerMedium.style}>{item.label}</span>
                                    <p className="text-text_secondary  text-sm ">
                                        {item.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 mt-auto">
                        {sessionId && (
                            <Link href={"/settings"}
                                className="flex items-center gap-3 text-text_primary hover:text-red-500 transition-colors w-full"
                                onClick={handleLinkClick}
                            >
                                <DynamicSvgIcon
                                    src='/logout.svg'
                                    isActive={false}
                                    size={24}
                                />
                                <span>Log out</span>
                            </Link>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};