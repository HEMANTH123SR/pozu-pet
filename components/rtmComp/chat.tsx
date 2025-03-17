'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { createToken } from '@/lib/actions';
import {
  Chat,
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useCreateChatClient,
  ChannelPreviewUIComponentProps,
} from 'stream-chat-react';
import {
  Channel as StreamChannel,
  ChannelFilters,
  ChannelSort,
  DefaultGenerics,
} from 'stream-chat';
import { EmojiPicker } from 'stream-chat-react/emojis';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';
import {
  ArrowLeft,
  MessageSquare,
  MessageSquarePlus,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NewConversationForm from '@/components/rtmComp/new-conversation-form';
import 'stream-chat-react/dist/css/v2/index.css';

init({ data });

interface StreamChatMember {
  user?: {
    id: string;
    image?: string;
    name?: string;
    online?: boolean;
  };
  role?: string;
}

interface StreamChatProps {
  userData: {
    id: string;
    name?: string;
    image?: string;
  };
  initialChannel?: string | null;
}

const OnlineStatusIndicator = ({ isOnline }: { isOnline: boolean }) => {
  return (
    <div
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black
        ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}
    />
  );
};

const EmptyStateMessage = () => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full space-y-4 text-center p-8">
      <div className="bg-zinc-900 p-6 rounded-full">
        <MessageSquare className="w-12 h-12 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-white">No Chat Selected</h3>
      <p className="text-gray-400 max-w-sm">
        Select a conversation from the sidebar to start messaging
      </p>
    </div>
  );
};

const getOnlineMemberCount = (channel: StreamChannel): number => {
  return Object.values(channel.state.members).filter(
    (member: StreamChatMember) => member.user?.online
  ).length;
};

const getChannelInfo = (channel: StreamChannel, userData: { id: string }) => {
  const memberCount = Object.keys(channel.state.members).length;
  const isDirectMessage = channel.data?.member_count === 2;

  if (isDirectMessage) {
    const otherMember = Object.values(channel.state.members).find(
      (member: StreamChatMember) => member.user?.id !== userData.id
    );
    return {
      name: otherMember?.user?.name || 'Unknown',
      isOnline: otherMember?.user?.online || false,
      memberCount,
    };
  }

  return {
    name: channel.data?.name || 'Unknown Group',
    isOnline: false,
    memberCount,
  };
};

const RealTimeChat = ({ userData, initialChannel }: StreamChatProps) => {
  const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(
    null
  );
  const [isMobileView, setIsMobileView] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const tokenProvider = useCallback(async () => {
    return await createToken(userData.id);
  }, [userData.id]);

  const client = useCreateChatClient({
    userData,
    tokenOrProvider: tokenProvider,
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  });

  const baseFilters: ChannelFilters = {
    type: 'messaging',
    members: { $in: [userData.id] },
  };

  const filters: ChannelFilters = {
    ...baseFilters,
    ...(searchQuery && {
      $or: [
        { name: { $autocomplete: searchQuery } },
        { 'members.user.name': { $autocomplete: searchQuery } },
        { 'members.user.id': { $autocomplete: searchQuery } },
      ] as const,
    }),
  };

  const sort: ChannelSort = { last_message_at: -1 } as const;
  const options = { limit: 10 };

  const getMemberAvatar = (channel: StreamChannel): string => {
    if (channel.data?.member_count === 2) {
      const otherMember = Object.values(channel.state.members).find(
        (member: StreamChatMember) => member.user?.id !== userData.id
      );
      return (
        (otherMember?.user?.image as string) ||
        'https://i.ibb.co/3yxpdjQV/12.png'
      );
    }
    return (
      (channel.data?.image as string) || 'https://i.ibb.co/3yxpdjQV/12.png'
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(!!query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  useEffect(() => {
    if (initialChannel && client) {
      const channel = client.channel('messaging', initialChannel);
      channel.watch().then(() => {
        setActiveChannel(channel);
      });
    }
  }, [initialChannel, client]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChannelSelect = (channel: StreamChannel) => {
    setActiveChannel(channel);
  };

  const handleBackToList = () => {
    setActiveChannel(null);
  };

  const closeDialog = () => {
    setDialogIsOpen(false);
  };

  if (!client) return null;

  return (
    <div className="flex w-full border-r border-darkBorder h-screen bg-background overflow-hidden">
      <style jsx global>{`
        :root {
          color-scheme: #0b0b0a;
        }

        /* Scrollbar hiding */
        .hide-scrollbar::-webkit-scrollbar,
        .str-chat::-webkit-scrollbar,
        .str-chat__list::-webkit-scrollbar,
        .str-chat__channel-list::-webkit-scrollbar,
        .str-chat__thread::-webkit-scrollbar,
        .str-chat__main-panel::-webkit-scrollbar,
        .str-chat__message-list::-webkit-scrollbar,
        .str-chat-channel::-webkit-scrollbar,
        .str-chat__thread-list::-webkit-scrollbar,
        .messaging.str-chat.str-chat-channel::-webkit-scrollbar,
        .str-chat__virtual-list::-webkit-scrollbar,
        .str-chat__virtual-list__wrapper::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar,
        .str-chat,
        .str-chat__list,
        .str-chat__channel-list,
        .str-chat__thread,
        .str-chat__main-panel,
        .str-chat__message-list,
        .str-chat-channel,
        .str-chat__thread-list,
        .messaging.str-chat.str-chat-channel,
        .str-chat__virtual-list,
        .str-chat__virtual-list__wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Base theme with purple accents */
        .str-chat {
          --str-chat__primary-color: #a855f7;
          --str-chat__secondary-color: #9333ea;
          background: #0b0b0a !important;
          height: 100%;
        }

        .str-chat__theme-dark {
          --str-chat__primary-color: #a855f7;
          --str-chat__secondary-color: #9333ea;
          --str-chat__border-color: #2d2d2d;
          --str-chat__message-text-color: #ffffff;
        }

        /* Channel list and layout */
        .str-chat__list {
          background: #0b0b0a !important;
          padding: 0 !important;
        }

        .str-chat__channel-list {
          background: #0b0b0a !important;
          height: calc(100% - 116px) !important;
        }

        .str-chat__main-panel {
          width: 100% !important;
          max-width: none !important;
        }

        .str-chat__message-list-container {
          width: 100% !important;
          max-width: none !important;
        }

        .str-chat__list--message-wrapper {
          width: 100% !important;
          max-width: none !important;
          padding: 0 1rem;
        }

        /* Message styling */
        .str-chat__message-data {
          background: #1a1a1a !important;
        }

        .str-chat__message--me .str-chat__message-data {
          background: #a855f7 !important;
        }

        /* Message status */
        .str-chat__message-status-timestamp,
        .str-chat__message-status svg,
        .str-chat__message-delivery-status {
          color: #a855f7 !important;
        }

        /* Message input */
        .str-chat__message-input {
          background: #0b0b0a !important;
          border-top: 1px solid #2d2d2d !important;
          width: 100% !important;
          max-width: none !important;
          padding: 1rem !important;
        }

        .str-chat__messaging-input {
          background: #1a1a1a !important;
          border: 1px solid #2d2d2d !important;
          border-radius: 8px !important;
        }

        .str-chat__messaging-input:hover,
        .str-chat__messaging-input:focus-within {
          border-color: #a855f7 !important;
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
        }

        /* Send button and input icons */
        .str-chat__send-button,
        .str-chat__input-flat-icons button {
          color: #a855f7 !important;
        }

        .str-chat__send-button:hover,
        .str-chat__input-flat-icons button:hover {
          color: #9333ea !important;
        }

        /* Thread styling */
        .str-chat__thread {
          background: #0b0b0a !important;
          border-left: 1px solid #2d2d2d !important;
        }

        .str-chat__thread-list .str-chat__message--me .str-chat__message-data {
          background: #a855f7 !important;
        }

        .str-chat__thread-header {
          background: #0b0b0a !important;
          border-bottom: 1px solid #2d2d2d !important;
          border-color: #a855f7 !important;
        }

        .str-chat__thread-indicator {
          color: #a855f7 !important;
        }

        /* Message actions */
        .str-chat__message-actions-box {
          background: #1a1a1a !important;
          border: 1px solid #2d2d2d !important;
        }

        .str-chat__message-actions-box button:hover {
          color: #a855f7 !important;
          background: rgba(168, 85, 247, 0.1) !important;
        }

        /* Active channel */
        .str-chat__channel-preview-messenger--active {
          border-left: 4px solid #a855f7 !important;
          background: rgba(168, 85, 247, 0.1) !important;
        }

        /* Emoji picker */
        .str-chat__emoji-picker-container .emoji-mart-category-label {
          color: #a855f7 !important;
        }

        // .str-chat__emoji-picker {
        //   background: #1a1a1a !important;
        //   border-color: #2d2d2d !important;
        // }

        /* Message mentions */
        .str-chat__message-mention {
          color: #a855f7 !important;
          background: rgba(168, 85, 247, 0.1) !important;
        }

        /* Quote messages */
        .str-chat__quoted-message {
          background: #1a1a1a !important;
          border-left: 2px solid #a855f7 !important;
        }

        /* Typing indicators */
        .str-chat__typing-indicator {
          color: #a855f7 !important;
        }

        /* File upload */
        .str-chat__file-upload-progress {
          background: #a855f7 !important;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .mobile-view {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 50;
            background: #000000;
          }

          .str-chat__channel-list {
            height: calc(100% - 80px) !important;
          }
        }
      `}</style>

      <div className="flex flex-1 h-full">
        <Chat client={client} theme="str-chat__theme-dark">
          <div className="flex w-full h-full">
            <div
              className={cn(
                'w-full md:w-80 border-r border-zinc-800 flex flex-col flex-shrink-0',
                isMobileView && activeChannel ? 'hidden' : 'block'
              )}
            >
              <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">Chats</h1>
                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MessageSquarePlus className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create new channel</DialogTitle>
                        <DialogDescription>
                          Start a new conversation with someone
                        </DialogDescription>
                      </DialogHeader>
                      <NewConversationForm onSuccess={closeDialog} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Search..."
                    className="w-full bg-zinc-900 pl-10 pr-10"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {isSearching && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {isSearching && (
                  <div className="mt-2 text-sm text-gray-400">
                    Searching for &quot;{searchQuery}&quot;...
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar">
                <ChannelList
                  filters={filters}
                  sort={sort}
                  options={options}
                  Preview={(
                    previewProps: ChannelPreviewUIComponentProps<DefaultGenerics>
                  ) => {
                    const channelInfo = getChannelInfo(
                      previewProps.channel,
                      userData
                    );
                    const onlineCount = getOnlineMemberCount(
                      previewProps.channel
                    );

                    return (
                      <div
                        className="flex items-center p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-900"
                        onClick={() =>
                          handleChannelSelect(previewProps.channel)
                        }
                      >
                        <div className="relative w-12 h-12">
                          <img
                            src={getMemberAvatar(previewProps.channel)}
                            alt="avatar"
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://i.ibb.co/3yxpdjQV/12.png';
                            }}
                          />
                          <OnlineStatusIndicator
                            isOnline={channelInfo.isOnline}
                          />
                        </div>
                        <div className="flex-1 min-w-0 ml-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold truncate">
                              {channelInfo.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {channelInfo.memberCount > 2 &&
                                `${channelInfo.memberCount} members`}
                              {channelInfo.memberCount > 2 &&
                                onlineCount > 0 &&
                                ` • ${onlineCount} online`}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 truncate">
                            {previewProps.lastMessage?.text ||
                              'No messages yet'}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                  EmptyStateIndicator={() => (
                    <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                      {isSearching ? (
                        <>
                          <p className="text-gray-400 mb-2">
                            No results found for &quot;{searchQuery}&quot;
                          </p>
                          <Button variant="ghost" onClick={clearSearch}>
                            Clear search
                          </Button>
                        </>
                      ) : (
                        <p className="text-gray-400">No conversations yet</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div
              className={cn(
                'flex-1 flex flex-col h-full hide-scrollbar',
                isMobileView
                  ? activeChannel
                    ? 'mobile-view'
                    : 'hidden'
                  : 'block'
              )}
            >
              {activeChannel ? (
                <Channel
                  channel={activeChannel}
                  EmojiPicker={EmojiPicker}
                  emojiSearchIndex={SearchIndex}
                >
                  <Window>
                    <div className="sticky top-0 z-10 bg-[#0B0B0A] border-b border-zinc-800">
                      <div className="flex items-center p-4">
                        {isMobileView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBackToList}
                            className="mr-2"
                          >
                            <ArrowLeft className="h-6 w-6" />
                          </Button>
                        )}
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="relative w-8 h-8">
                            <img
                              src={getMemberAvatar(activeChannel)}
                              alt="channel"
                              className="w-full h-full rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://i.ibb.co/3yxpdjQV/12.png';
                              }}
                            />
                            <OnlineStatusIndicator
                              isOnline={
                                getChannelInfo(activeChannel, userData).isOnline
                              }
                            />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <span className="font-semibold block truncate">
                              {getChannelInfo(activeChannel, userData).name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {Object.keys(activeChannel.state.members).length}{' '}
                              members •{' '}{getOnlineMemberCount(activeChannel)}{' '}
                              online
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                      <MessageList />
                    </div>
                    <div className="sticky bottom-0 bg-black border-t border-zinc-800">
                      <MessageInput audioRecordingEnabled />
                    </div>
                  </Window>
                  <Thread />
                </Channel>
              ) : (
                <EmptyStateMessage />
              )}
            </div>
          </div>
        </Chat>
      </div>
    </div>
  );
};

export default RealTimeChat;
