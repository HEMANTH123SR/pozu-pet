import { StreamChat } from 'stream-chat';

// Initialize Stream client
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
let clientInstance: StreamChat | null = null;

/**
 * Get a singleton instance of the Stream Chat client
 */
export const getStreamClient = () => {
  if (!clientInstance && apiKey) {
    clientInstance = StreamChat.getInstance(apiKey);
  }
  return clientInstance;
};

/**
 * Creates or gets an existing direct message channel between two users
 * @param currentUserId - The ID of the current user
 * @param otherUserId - The ID of the user to chat with
 * @returns The channel ID
 */
export const createDirectChannel = async (currentUserId: string, otherUserId: string): Promise<string> => {
  try {
    const client = getStreamClient();
    if (!client) {
      throw new Error('Stream chat client is not initialized');
    }
    
    // Create a unique, deterministic channel ID for these two users
    // Sorting ensures the same ID regardless of who initiates
    const memberIds = [currentUserId, otherUserId].sort();
    const channelId = `dm-${memberIds.join('-')}`;
    
    // If client is not connected, we'll need to get a token
    if (!client.tokenManager?.token) {
      const response = await fetch(`/api/chat/token?user_id=${currentUserId}`);
      if (!response.ok) {
        throw new Error('Failed to get chat token');
      }
      
      const { token } = await response.json();
      await client.connectUser(
        {
          id: currentUserId,
          // These are placeholders, we'll get actual user data later
          name: `User ${currentUserId.substring(0, 5)}`,
          image: 'https://i.ibb.co/3yxpdjQV/12.png'
        },
        token
      );
    }
    
    // Create or get the channel
    const channel = client.channel('messaging', channelId, {
      members: memberIds,
      created_by_id: currentUserId,
    });
    
    // Initialize channel if it's new
    await channel.create();
    
    return channelId;
  } catch (error) {
    console.error('Error creating direct channel:', error);
    throw error;
  }
};

/**
 * Disconnects the current user from Stream Chat
 */
export const disconnectUser = async () => {
  const client = getStreamClient();
  if (client) {
    await client.disconnectUser();
  }
};