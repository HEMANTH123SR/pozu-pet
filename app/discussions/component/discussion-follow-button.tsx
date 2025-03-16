// "use client";
// import React, { useState } from "react";
// import { Plus, Check, Loader2 } from "lucide-react";

// export function FollowButton() {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFollow = async () => {
//     setIsLoading(true);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     setIsFollowing(!isFollowing);
//     setIsLoading(false);
//   };

//   return (
//     <button
//       onClick={handleFollow}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//       disabled={isLoading}
//       className={`
//         relative flex items-center justify-center gap-1.5
//         px-4 py-1.5 rounded-full font-medium text-sm
//         transition-all duration-200
//         ${
//           isLoading
//             ? "cursor-not-allowed opacity-70"
//             : "hover:scale-105 active:scale-95"
//         }
//         ${
//           isFollowing
//             ? isHovering
//               ? "bg-red-50 text-red-600 border border-red-200"
//               : "bg-gray-100 text-gray-700 border border-gray-200"
//             : "bg-primary text-white border border-blue-600 hover:bg-blue-600"
//         }
//       `}
//       aria-label={isFollowing ? "Unfollow" : "Follow"}
//     >
//       {isLoading ? (
//         <Loader2 size={16} className="animate-spin" />
//       ) : (
//         <>
//           {isFollowing ? (
//             isHovering ? (
//               <span className="flex items-center gap-1.5">
//                 <Plus size={16} className="rotate-45" />
//                 Unfollow
//               </span>
//             ) : (
//               <span className="flex items-center gap-1.5">
//                 <Check size={16} />
//                 Following
//               </span>
//             )
//           ) : (
//             <span className="flex items-center gap-1.5">
//               <Plus size={16} />
//               Follow
//             </span>
//           )}
//         </>
//       )}

//       {/* Pulse Effect when not following */}
//       {!isFollowing && !isLoading && (
//         <span className="absolute inset-0 rounded-full animate-pulse bg-blue-200 opacity-20" />
//       )}
//     </button>
//   );
// }
import { hackerMedium } from "@/fonts/font";
import { Plus } from "lucide-react";
export const FollowButton = () => {
  return (
    <button
      className="flex lg:text-sm xl:text-base items-center text-primary gap-1"
      style={hackerMedium.style}
    >
      <Plus size={18} strokeWidth={2.5} />
      Follow
    </button>
  );
};
