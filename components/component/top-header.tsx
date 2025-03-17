


// // TopMenu.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { hackerMedium } from "@/fonts/font";
// import Link from "next/link";
// import { useUser } from "@clerk/nextjs"

// export const TopMenu = () => {
//   const { isSignedIn } = useUser();
//   const currentPath = usePathname();
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
//       const containerScrollTop = scrollContainer?.scrollTop || 0;

//       // Use container scroll position if available, otherwise use window scroll
//       const scrollPosition = scrollContainer ? containerScrollTop : currentScrollY;

//       if (scrollPosition < lastScrollY) {
//         // Scrolling up
//         setIsVisible(true);
//       } else if (scrollPosition > 50 && scrollPosition > lastScrollY) {
//         // Scrolling down and past the 50px mark
//         setIsVisible(false);
//       }
//       setLastScrollY(scrollPosition);
//     };

//     const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
//     if (scrollContainer) {
//       scrollContainer.addEventListener('scroll', handleScroll);
//     } else {
//       window.addEventListener('scroll', handleScroll);
//     }

//     return () => {
//       if (scrollContainer) {
//         scrollContainer.removeEventListener('scroll', handleScroll);
//       } else {
//         window.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, [lastScrollY]);

//   const navigationItems = [
//     { title: "For You", href: "/" },
//   ]


//   if (isSignedIn) {
//     navigationItems.push({
//       title: "Campus",
//       href: "/discussions/campus"
//     })
//     navigationItems.push({
//       title: "Following",
//       href: "/discussions/following"
//     })


//   } else {
//     navigationItems.push({
//       title: "Trending",
//       href: "/discussions/trending"
//     })
//   }



//   return (

//     <div
//       className={`  fixed  top-0 mt-14  lg:mt-0 lg:static left-0 right-0 flex ${hackerMedium.className} z-50
//         bg-background  shadow-sm
//         items-center justify-between min-h-14 min-w-12 md:min-h-14 md:h-14

//         transition-all duration-300 transform
//         ${isVisible ? 'translate-y-0' : '   -translate-y-full lg:translate-y-0'}
//       `}
//     >
//       <div className="flex w-full items-center ">
//         {navigationItems.map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={`px-2 sm:px-4 flex flex-col h-10 md:h-14 ${isSignedIn ? "w-1/3" : "w-1/2"} 
//               transition-all duration-300
//               hover:scale-105 active:scale-95 hover:bg-gray-100 dark:hover:bg-[#181818]
//               ${currentPath === item.href
//                 ? "text-sand-black-700 shadow-sm hover:shadow-md dark:text-text_primary"
//                 : "text-gray-600 dark:text-text_secondary hover:border-b-[2px] hover:border-darkBorder"
//               }`}
//           >
//             <div className="h-full flex justify-center items-center">
//               <span className="text-base md:text-[0.85rem] whitespace-nowrap lg:uppercase"

//               >
//                 {item.title}
//               </span>
//             </div>
//             <div className={`justify-center items-center ${currentPath === item.href ? "flex" : "hidden"}`}>
//               <div className="h-1 rounded-full bg-primary w-12 sm:w-16"></div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>

//   );
// };





"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { hackerMedium } from "@/fonts/font";
import Link from "next/link";
import { Home, Users2, Calendar, ShoppingBag } from "lucide-react";

export const TopMenu = () => {
  const currentPath = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
      const containerScrollTop = scrollContainer?.scrollTop || 0;

      // Use container scroll position if available, otherwise use window scroll
      const scrollPosition = scrollContainer ? containerScrollTop : currentScrollY;

      if (scrollPosition < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (scrollPosition > 50 && scrollPosition > lastScrollY) {
        // Scrolling down and past the 50px mark
        setIsVisible(false);
      }
      setLastScrollY(scrollPosition);
    };

    const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lastScrollY]);

  // Navigation items with icons
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      icon: <Home size={24} />
    },
    {
      title: "Clubs",
      href: "/clubs",
      icon: <Users2 size={24} />
    },
    {
      title: "Events",
      href: "/events",
      icon: <Calendar size={24} />
    },
    {
      title: "Shopping",
      href: "/shopping",
      icon: <ShoppingBag size={24} />
    }
  ];

  return (
    <div
      className={`fixed top-0 mt-14 lg:mt-0 lg:static left-0 right-0 flex ${hackerMedium.className} z-50
        bg-white dark:bg-[#18191a] border-b border-gray-200 dark:border-[#3a3b3c]
        items-center justify-between h-14 min-w-12 md:h-14
        transition-all duration-300 transform
        ${isVisible ? 'translate-y-0' : '-translate-y-full lg:translate-y-0'}`}
    >
      <div className="flex w-full items-center justify-center">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center h-14 flex-1
              transition-all duration-300
              ${currentPath === item.href
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]"
              }`}
            aria-label={item.title}
          >
            <div className="flex justify-center items-center">
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};