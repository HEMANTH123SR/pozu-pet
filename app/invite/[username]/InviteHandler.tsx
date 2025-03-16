'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SmallLoading } from '@/components/component/small-loading'

export function InviteHandler({ inviterUsername }: { inviterUsername: string }) {
    const router = useRouter()

    useEffect(() => {
        const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        const expirationTime = new Date().getTime() + oneDayInMs;

        // Store inviter's username with expiration timestamp
        localStorage.setItem('inviterData', JSON.stringify({
            username: inviterUsername,
            expiresAt: expirationTime
        }));

        // Redirect to sign-up
        router.push('/sign-up')
    }, [inviterUsername, router])

    return <div className='h-screen w-full flex justify-center items-center'>
        <SmallLoading />
    </div>
}

// then modify add invite invite page