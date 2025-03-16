// app/add-invite/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateUserInvites } from '@/actions/user-update-invite.actions'
import { useUser } from '@clerk/nextjs'

export default function AddInvitePage() {
    const router = useRouter()
    const { user, isLoaded } = useUser()

    useEffect(() => {
        const handleInvite = async () => {
            if (!isLoaded || !user) {
                router.push('/sign-in')
                return
            }

            const inviterData = localStorage.getItem('inviterData')
            if (inviterData) {
                try {
                    const { username: inviterUsername, expiresAt } = JSON.parse(inviterData)
                    const currentTime = new Date().getTime()

                    if (currentTime < expiresAt) {


                        // const mongoUserId = await user.publicMetadata.mongoDbUserId as string

                        const success = await updateUserInvites(inviterUsername, user.username)

                        if (success) {
                            console.log('Invites updated successfully')
                            localStorage.removeItem('inviterData')
                            router.push('/')
                        } else {
                            console.error('Failed to update invites')
                            router.push('/')
                        }
                    } else {
                        console.log('Inviter data expired, redirecting to home')
                        localStorage.removeItem('inviterData')
                        router.push('/')
                    }
                } catch (error) {
                    console.error('Error updating invites:', error)
                    router.push('/')
                }
            } else {
                console.log('No inviter data found in localStorage, redirecting to home')
                router.push('/')
            }
        }

        handleInvite()
    }, [router, user, isLoaded])

    return <div className='h-screen w-full flex justify-center items-center'>
        <div className='flex flex-col space-y-2'>
            <h1 className='text-2xl font-bold'>Updating invites...</h1>
            <p className='text-sm'>Please wait...</p>
        </div>
    </div>
}



