

"use client";
import { useState } from 'react';
import { DiscussionCard } from "@/app/discussions/component/disussion-card";
import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon';
import { moreSugar } from '@/fonts/font';
import { UserCard } from "@/components/component/user-card";

import Image from 'next/image';



const SearchTabs = ({ activeTab, setActiveTab, counts }) => (
    <div className="flex text-sm justify-center w-full space-x-6 border-b border-[#303130] px-4 mb-4">
        <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 py-3 uppercase ${activeTab === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-darkTextSecondery'
                }`}
        >
            <span>All</span>
        </button>
        <button
            onClick={() => setActiveTab('people')}
            className={`flex items-center space-x-2 py-3 uppercase ${activeTab === 'people'
                ? 'text-primary border-b-2 border-primary'
                : 'text-darkTextSecondery'
                }`}
        >
            <span>People</span>
            {counts.people > 0 && <span className="text-sm">({counts.people})</span>}
        </button>
        <button
            onClick={() => setActiveTab('discussions')}
            className={`flex items-center space-x-2 py-3 uppercase ${activeTab === 'discussions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-darkTextSecondery'
                }`}
        >
            <span>Discussions</span>
            {counts.discussions > 0 && <span className="text-sm">({counts.discussions})</span>}
        </button>
    </div>
);



export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [searchResults, setSearchResults] = useState({ users: [], discussions: [] });
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data.data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-[#0B0B0A] text-[#FDFCFD] w-full border-r border-darkBorder">
            <div className="h-full pt-14 lg:pt-0">
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                    <div className="flex-none pt-4">
                        <form onSubmit={handleSearch} className="px-4 mb-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search Kampus..."
                                    className="w-full bg-[#262626] text-[#FDFCFD] rounded-lg pl-11 pr-4 py-3 border border-[#303130] focus:outline-none focus:border-[#5E04D5] focus:ring-1 focus:ring-[#5E04D5]"
                                />
                                <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                                    <DynamicSvgIcon
                                        src='/explore.svg'
                                        isActive={false}
                                        size={22}
                                        classname='text-[#666D70]'
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {searchQuery ? (
                        <div className="flex-1 overflow-hidden">
                            <SearchTabs
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                counts={{
                                    people: searchResults.users?.length || 0,
                                    discussions: searchResults.discussions?.length || 0
                                }}
                            />
                            <div className="h-full overflow-y-auto scroll-hidden">
                                <div className="divide-y divide-[#303130]">
                                    {isLoading ? (
                                        <div className="text-center py-8 text-[#666D70]">Loading...</div>
                                    ) : (
                                        <>
                                            {(activeTab === 'all' || activeTab === 'people') &&
                                                searchResults.users?.map(user => (
                                                    <UserCard key={user._id} user={user} />
                                                ))
                                            }

                                            {(activeTab === 'all' || activeTab === 'discussions') &&
                                                searchResults.discussions?.map(discussion => (
                                                    <DiscussionCard
                                                        key={discussion._id}
                                                        discussion={discussion}
                                                    />
                                                ))
                                            }
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-6 pb-28 px-4 text-center max-w-lg">
                                <span
                                    className="text-2xl lg:text-3xl"
                                    style={moreSugar.style}
                                >
                                    {`The search isn't going to fill itself, human. Start typing!`}
                                </span>
                                <Image
                                    src='/homie-cat.png'
                                    alt='Homie Cat'
                                    width={500}
                                    height={500}
                                    className='w-full h-auto max-w-md'
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}