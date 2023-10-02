import React from 'react';
import { Message } from '../../types/discussionTypes';

type MessageBubbleProps = {
  message: Message;
  isUser: boolean;
};

const MessageBubble = ({ message, isUser }: MessageBubbleProps) => {
  return (
    <div className={`flex mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col ${!isUser ? 'items-start' : 'items-end'}`}>
        {!isUser && (
          <p className="text-zinc-500 ml-2 text-xs">{message.user.name}</p>
        )}
        <div
          className={`px-4 py-2 rounded-3xl text-sm ${
            isUser ? 'bg-violet-500 text-white' : 'bg-gray-200'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
