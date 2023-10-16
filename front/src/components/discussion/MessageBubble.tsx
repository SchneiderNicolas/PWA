import React from 'react';
import { Message, OfflineMessage } from '../../types/discussionTypes';

interface MessageBubbleProps {
  message?: Message;
  offlineMessage?: OfflineMessage;
  isUser: boolean;
}

const MessageBubble = ({
  message,
  offlineMessage,
  isUser,
}: MessageBubbleProps) => {
  let content: string;
  let statusText: string | null = null;
  let userName: string | null | undefined;

  if (message) {
    content = message.content;
    userName = message.user.name;
  } else if (offlineMessage) {
    content = offlineMessage.content;
    statusText = offlineMessage.status === 'Pending' ? 'Pending' : null;
    userName = isUser ? 'You' : null;
  } else {
    console.error('No message or offlineMessage provided to MessageBubble');
    return null;
  }

  return (
    <div className={`flex mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col ${!isUser ? 'items-start' : 'items-end'}`}>
        {userName && !isUser ? (
          <p className="text-zinc-500 ml-2 text-xs">{userName}</p>
        ) : null}
        <div
          className={`px-4 py-2 rounded-3xl text-sm ${
            isUser ? 'bg-violet-500 text-white' : 'bg-gray-200'
          }`}
        >
          {content}
        </div>
        {statusText ? (
          <p className="text-xs text-red-500 mt-1">{statusText}</p>
        ) : null}
      </div>
    </div>
  );
};

export default MessageBubble;
