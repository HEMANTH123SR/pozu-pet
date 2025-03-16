// "use client";
// import React from 'react';
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { hackerMedium } from '@/fonts/font';
// import { Skeleton } from '@/components/ui/skeleton';
// import { User } from '@/app/discussions/lib/interface';

// interface PollResultsProps {
//     options: {
//         text: string;
//         votes: User[];
//     }[];
//     totalVotes: number;
//     currentUser?: User | null;
//     onVote?: (optionText: string) => void;
//     isLoading?: boolean;
// }

// export const PollResults = ({
//     options,
//     totalVotes,
//     currentUser,
//     onVote,
//     isLoading = false
// }: PollResultsProps) => {
//     const maxVotes = Math.max(...options.map(option => option.votes.length));

//     if (isLoading) {
//         return (
//             <div className="space-y-6 p-4">
//                 <Skeleton className="h-6 w-48" />
//                 {[1, 2, 3].map((i) => (
//                     <div key={i} className="space-y-2">
//                         <Skeleton className="h-4 w-full" />
//                         <Skeleton className="h-10 w-full" />
//                     </div>
//                 ))}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-4 px-4">
//             <div className="flex items-center justify-between">
//                 <h3
//                     className="text-base font-semibold text-muted-foreground"
//                     style={hackerMedium.style}
//                 >
//                     Poll Results
//                 </h3>
//                 <span className="text-sm text-muted-foreground">
//                     {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
//                 </span>
//             </div>

//             <div className="space-y-4">
//                 {options.map((option) => {
//                     const percentage = totalVotes > 0
//                         ? (option.votes.length / totalVotes) * 100
//                         : 0;
//                     const hasVoted = option.votes.some(vote => vote._id === currentUser?._id);
//                     const isLeading = option.votes.length === maxVotes && maxVotes > 0;

//                     return (
//                         <div key={option.text} className="space-y-2">
//                             <div className="flex justify-between items-center text-sm">
//                                 <span className="text-foreground">{option.text}</span>
//                                 <span className={cn(
//                                     "font-medium",
//                                     isLeading ? "text-primary" : "text-muted-foreground"
//                                 )}>
//                                     {percentage.toFixed(1)}%
//                                 </span>
//                             </div>

//                             <button
//                                 onClick={() => onVote?.(option.text)}
//                                 disabled={!onVote}
//                                 className={cn(
//                                     "relative w-full group transition-all duration-200",
//                                     onVote && "hover:ring-2 hover:ring-primary/20 rounded-lg"
//                                 )}
//                             >
//                                 <div className="relative h-10 bg-secondary rounded-lg overflow-hidden">
//                                     <div
//                                         className={cn(
//                                             "absolute h-full transition-all duration-500",
//                                             hasVoted ? "bg-primary/80" : "bg-primary/20",
//                                             isLeading && "bg-primary/40"
//                                         )}
//                                         style={{ width: `${percentage}%` }}
//                                     />

//                                     <div className="absolute inset-0 px-3 flex items-center justify-between">
//                                         <div className="flex -space-x-2 transition-transform group-hover:scale-105">
//                                             {option.votes.slice(0, 3).map((user) => (
//                                                 <Avatar
//                                                     key={user._id}
//                                                     className="w-7 h-7 border-2 border-background"
//                                                 >
//                                                     <Image
//                                                         src={user.profileImage}
//                                                         alt={user.fullName}
//                                                         width={24}
//                                                         height={24}
//                                                         className="rounded-full object-cover"
//                                                     />
//                                                     <AvatarFallback>
//                                                         {user.fullName.charAt(0)}
//                                                     </AvatarFallback>
//                                                 </Avatar>
//                                             ))}
//                                             {option.votes.length > 3 && (
//                                                 <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
//                                                     +{option.votes.length - 3}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {hasVoted && (
//                                             <span className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/10">
//                                                 Your vote
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </button>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };



import React from 'react';
import { cn } from '@/lib/utils';
import { hackerMedium } from '@/fonts/font';
import { UserCard } from '@/components/component/user-card';
import { User } from '@/app/discussions/lib/interface';

interface PollResultsProps {
    options: {
        text: string;
        votes: User[];
    }[];
    totalVotes: number;
    currentUser?: User | null;
    onVote?: (optionText: string) => void;
}

export const PollResults = ({
    options,
    totalVotes,
    currentUser,
    onVote
}: PollResultsProps) => {
    const [selectedOption, setSelectedOption] = React.useState(options[0]?.text);

    return (
        <div className="grid grid-cols-12 gap-4 p-4">
            {/* Left side - Poll statistics */}
            <div className="col-span-5 space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <h3
                        className="text-base font-semibold text-muted-foreground"
                        style={hackerMedium.style}
                    >
                        Poll Results
                    </h3>
                    <span className="text-sm text-muted-foreground">
                        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                    </span>
                </div>

                <div className="space-y-4">
                    {options.map((option) => {
                        const percentage = totalVotes > 0
                            ? (option.votes.length / totalVotes) * 100
                            : 0;
                        const hasVoted = option.votes.some(vote => vote._id === currentUser?._id);
                        const isSelected = selectedOption === option.text;

                        return (
                            <button
                                key={option.text}
                                onClick={() => {
                                    setSelectedOption(option.text);
                                    onVote?.(option.text);
                                }}
                                className={cn(
                                    "w-full text-left space-y-2 p-3 rounded-lg transition-all",
                                    isSelected ? "bg-primary/10" : "hover:bg-primary/5",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                                )}
                            >
                                <div className="flex justify-between items-center text-sm">
                                    <span className={cn(
                                        "font-medium",
                                        isSelected && "text-primary"
                                    )}>
                                        {option.text}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-sm",
                                            hasVoted && "text-primary"
                                        )}>
                                            {option.votes.length} {option.votes.length === 1 ? 'vote' : 'votes'}
                                        </span>
                                        <span className="text-muted-foreground">
                                            ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "absolute h-full transition-all duration-500",
                                            hasVoted ? "bg-primary" : "bg-primary/40"
                                        )}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right side - User cards */}
            <div className="col-span-7 border-l border-border">
                <div className="px-4 pb-2 border-b border-border">
                    <h4
                        className="text-sm text-muted-foreground"
                        style={hackerMedium.style}
                    >
                        Voted for: {selectedOption}
                    </h4>
                </div>
                <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                    {options
                        .find(option => option.text === selectedOption)
                        ?.votes.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                            />
                        ))}
                    {(options.find(option => option.text === selectedOption)?.votes.length ?? 0) === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                            No votes yet for this option
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};