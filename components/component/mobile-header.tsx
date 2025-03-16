"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { hackerMedium, strawberry } from "@/fonts/font";
import { usePathname } from "next/navigation";
import { DynamicSvgIcon } from "./dynamic-svg-icon";
import { useState, useEffect } from "react";
import { UserSideMenu } from "./user-side-menu";


//events


// MobileHeader.tsx
export function MobileHeader() {
  const currentPath = usePathname();
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
      const containerScrollTop = scrollContainer?.scrollTop || 0;
      const windowScrollY = window.scrollY;

      // Use container scroll position if available, otherwise use window scroll
      const currentScrollY = scrollContainer ? containerScrollTop : windowScrollY;

      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        // Scrolling down and past the 50px mark
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
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

  if (currentPath === "/" || currentPath === "/search" || currentPath == "/discussions/trending" || currentPath === "/discussions/following" || currentPath === "/discussions/campus" || currentPath === "/events" || currentPath === "/notification" || currentPath === "/settings" || currentPath == "/bookmark" ||
    currentPath === "/dashboard" || currentPath === "/verify" || currentPath === "/invite"
  ) {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 lg:hidden  bg-darkBackground 
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'}
        ${currentPath === "/notification" && "border-b border-darkBorder"}
        ${currentPath === "/settings" && "border-b border-darkBorder"}
        ${currentPath === "/bookmark" && "border-b border-darkBorder"}
        ${currentPath === "/dashboard" && "border-b border-darkBorder"}
        ${currentPath === "/verify" && "border-b border-darkBorder"}
        ${currentPath === "/invite" && "border-b border-darkBorder"}
        `}
      >

        <div className="p-4 pt-2 pb-2 flex items-center justify-between">
          {/* left side  */}
          <Link href={"/"} className="flex items-center justify-center space-x-3">

            <h1
              style={strawberry.style}
              className="text-[2rem] lowercase"
            >
              KAMPUS
            </h1>
          </Link>




          {
            user ? (
              <div className="flex items-center justify-center space-x-4">
                <Link href={"/notification"}>
                  <DynamicSvgIcon
                    src="/bell.svg"
                    isActive={false}
                    size={25}
                  />
                </Link>
                <UserSideMenu />
              </div>
            ) : <Link href={"/sign-up"}
              style={hackerMedium.style}
              className="border-darkBorder rounded-lg bg-darksec text-darkTextPrimary px-3 py-1">Sign Up</Link>
          }

        </div>
      </header >
    );
  }

  return null;

};





// "use client";
// import Link from "next/link";
// import { useUser } from "@clerk/nextjs";
// import { hackerMedium, strawberry } from "@/fonts/font";
// import { usePathname } from "next/navigation";
// import { DynamicSvgIcon } from "./dynamic-svg-icon";
// import { useState, useEffect } from "react";
// import { UserSideMenu } from "./user-side-menu";

// export function MobileHeader() {
//   const currentPath = usePathname();
//   const { user } = useUser();
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   useEffect(() => {
//     // Debounce the scroll handler to prevent rapid firing
//     let timeoutId = null;

//     const handleScroll = () => {
//       if (timeoutId) clearTimeout(timeoutId);

//       timeoutId = setTimeout(() => {
//         const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
//         const containerScrollTop = scrollContainer?.scrollTop || 0;
//         const windowScrollY = window.scrollY;

//         const currentScrollY = scrollContainer ? containerScrollTop : windowScrollY;

//         if (currentScrollY < lastScrollY) {
//           setIsVisible(true);
//         } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
//           setIsVisible(false);
//         }
//         setLastScrollY(currentScrollY);
//       }, 10); // Small timeout to debounce
//     };

//     // Wait for DOM to be fully ready
//     const setupListeners = () => {
//       const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
//       if (scrollContainer) {
//         scrollContainer.addEventListener('scroll', handleScroll);
//       } else {
//         window.addEventListener('scroll', handleScroll);
//       }
//     };

//     // Small delay to ensure DOM is ready
//     const initTimeout = setTimeout(setupListeners, 100);

//     return () => {
//       clearTimeout(initTimeout);
//       clearTimeout(timeoutId);
//       const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
//       if (scrollContainer) {
//         scrollContainer.removeEventListener('scroll', handleScroll);
//       } else {
//         window.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, [lastScrollY]);

//   // Create an array of paths where header should appear
//   const headerPaths = [
//     "/", "/search", "/discussions/trending", "/discussions/following",
//     "/discussions/campus", "/events", "/notification", "/settings",
//     "/bookmark", "/dashboard", "/verify", "/invite"
//   ];

//   // Check if current path is in the array
//   const shouldShowHeader = headerPaths.includes(currentPath);

//   if (!shouldShowHeader) return null;

//   // Border paths that need the border style
//   const borderPaths = [
//     "/notification", "/settings", "/bookmark",
//     "/dashboard", "/verify", "/invite"
//   ];

//   const needsBorder = borderPaths.includes(currentPath);

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 lg:hidden bg-darkBackground 
//       transition-transform duration-300 ease-in-out

//       ${needsBorder ? "border-b border-darkBorder" : ""}
//       `}
//     >
//       <div className="p-4 pt-2 pb-2 flex items-center justify-between">
//         {/* left side  */}
//         <Link href={"/"} className="flex items-center justify-center space-x-3">
//           <h1
//             style={strawberry.style}
//             className="text-[2rem] lowercase"
//           >
//             KAMPUS
//           </h1>
//         </Link>

//         {
//           user ? (
//             <div className="flex items-center justify-center space-x-4">
//               <Link href={"/notification"}>
//                 <DynamicSvgIcon
//                   src="/bell.svg"
//                   isActive={false}
//                   size={25}
//                 />
//               </Link>
//               <UserSideMenu />
//             </div>
//           ) : <Link href={"/sign-up"}
//             style={hackerMedium.style}
//             className="border-darkBorder rounded-lg bg-darksec text-darkTextPrimary px-3 py-1">Sign Up</Link>
//         }
//       </div>
//     </header>
//   );
// }


