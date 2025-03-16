// File: app/api/chat/create-dm/route.ts
import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';
import { currentUser } from '@clerk/nextjs/server';

// Initialize Stream client
const apiKey = process.env.STREAM_API_KEY as string;
const apiSecret = process.env.CHAT_API_SECRET as string;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function POST(req: Request) {
  try {
    // Get authenticated user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { targetUserId, targetUserName, targetUserImage } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { message: 'Target user ID is required' },
        { status: 400 }
      );
    }

    // Create a deterministic channel ID
    const channelId = [user.id, targetUserId].sort().join('-');

    // Create or get the channel
    const channel = serverClient.channel('messaging', channelId, {
      members: [user.id, targetUserId],
      created_by_id: user.id,
      name: targetUserName || 'Direct Message',
      image: targetUserImage,
      custom: {
        isDM: true,
        participants: [
          {
            id: user.id,
            name: user.firstName
              ? `${user.firstName} ${user.lastName || ''}`.trim()
              : 'User',
            image: user.imageUrl,
          },
          {
            id: targetUserId,
            name: targetUserName || 'User',
            image: targetUserImage,
          },
        ],
      },
    });

    // Create channel
    const response = await channel.create();

    return NextResponse.json({
      channelId,
      channel: response.channel,
    });
  } catch (error) {
    console.error('Error creating DM channel:', error);
    return NextResponse.json(
      { message: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
