// app/invite/[username]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { InviteHandler } from './InviteHandler'

export default async function InvitePage({
    params
}: {
    params: { username: string }
}) {
    const { userId } = await auth()

    // If user is already signed in, redirect to home
    if (userId) {
        redirect('/')
    }

    return <InviteHandler inviterUsername={params.username} />
}