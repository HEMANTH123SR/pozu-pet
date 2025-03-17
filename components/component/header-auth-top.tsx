import Link from "next/link";
import Image from "next/image";
import { hackerMedium, strawberry } from "@/fonts/font";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const HeaderAuthTop = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userCount, setUserCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await fetch('/api/user/get-total-user-count');
                const data = await response.json();

                if (data.success) {
                    setUserCount(data.count);
                }
            } catch (error) {
                console.error('Failed to fetch user count:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserCount();
    }, []);

    const UserCountDisplay = ({ className }: { className?: string }) => (
        <div className={`text-text_primary font-medium bg-foreground p-4 border-2 border-darkBorder rounded-xl py-2 ${className}`}
            style={hackerMedium.style}
        >
            {isLoading ? (
                <span className="animate-pulse">Loading...</span>
            ) : (
                `Students on Kampus: ${userCount.toLocaleString()}`
            )}
        </div>
    );

    return (
        <header className="w-full z-40 bg-background border-b border-darkBorder">
            <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 md:px-12">
                {/* Logo */}
                <div className="flex-shrink-0 ">
                    <Link
                        href="/"
                        className="flex space-x-1.5 items-center justify-start transition-transform duration-300 ease-out hover:translate-y-1.5"
                        aria-label="Go to kampus.social Home"
                    >
                        <Image
                            src="/logo.png"
                            alt="Kampus Logo"
                            width={40}
                            height={40}
                            className="rounded-2xl sm:w-12 sm:h-12"
                        />
                        <span
                            className={`${strawberry.className} text-black dark:text-text_primary text-3xl sm:text-3xl`}
                        >
                            kampus
                        </span>
                    </Link>
                </div>


                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 text-text_primary font-medium"
                    style={hackerMedium.style}
                >
                    <Link href="/story" className="hover:text-white transition">
                        Our Story
                    </Link>
                    <Link href="/support" className="hover:text-white transition">
                        Support
                    </Link>
                    <Link href="/stories" className="hover:text-white transition">
                        Student Stories
                    </Link>
                </nav>

                {/* User Count - Desktop */}
                <div className="hidden md:block">
                    <UserCountDisplay />
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-text_primary hover:text-white transition"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background border-t border-darkBorder">
                    <nav className="flex flex-col py-4 px-4 space-y-4"
                        style={hackerMedium.style}
                    >
                        <Link
                            href="/story"
                            className="text-text_primary hover:text-white transition px-4 py-2 rounded-lg hover:bg-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Our Story
                        </Link>
                        <Link
                            href="/support"
                            className="text-text_primary hover:text-white transition px-4 py-2 rounded-lg hover:bg-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Support
                        </Link>
                        <Link
                            href="/stories"
                            className="text-text_primary hover:text-white transition px-4 py-2 rounded-lg hover:bg-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Student Stories
                        </Link>

                        {/* User Count - Mobile */}
                        <UserCountDisplay className="text-sm p-3 mt-4 text-center" />
                    </nav>
                </div>
            )}
        </header>
    );
};