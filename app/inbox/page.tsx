'use client';

import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import RealTimeChat from '@/components/rtmComp/chat';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Define an interface for the user data structure
interface UserData {
  id: string;
  name: string | null;
  image: string | null;
}

export default function InboxPage() {
  const searchParams = useSearchParams();
  const channelId = searchParams.get('channel');
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setUserData({
        id: user.id,
        name: user.fullName || null,
        image: user.imageUrl || null
      });
    }
  }, [isLoaded, user]);

  // Show loading state while user data is being fetched
  if (!isLoaded || !userData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <RealTimeChat 
      userData={userData}
      initialChannel={channelId}
    />
  );
}