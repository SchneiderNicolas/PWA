import React, { useEffect, useRef, useState } from 'react';
import NewDiscussionTopBar from './NewDiscussionTopBar';

const NewDiscussion = () => {
  const [messageInput, setMessageInput] = useState('');
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);

  useEffect(() => {
    if (topBarRef.current) {
      setTopBarHeight(topBarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, []);

  const handleNewDiscussion = () => {
    console.log(messageInput);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={topBarRef}>
        <NewDiscussionTopBar initialTitle="New Discussion" />
      </div>
      <div
        className="flex-grow p-2 overflow-y-auto"
        style={{ maxHeight: `calc(100vh - ${topBarHeight}px - 4rem)` }}
      >
        <div ref={messagesEndRef} />
      </div>
      <div
        className="flex-grow p-2 overflow-y-auto"
        style={{ maxHeight: `calc(100vh - 2px - 4rem)` }}
      ></div>
      <div className="p-2 flex">
        <input
          type="text"
          placeholder="Aa"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-grow rounded-full py-2 px-4 mr-2 bg-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
          onKeyDown={(e) => e.key === 'Enter' && handleNewDiscussion()}
        />
        <button
          onClick={handleNewDiscussion}
          className="bg-violet-500 text-white font-medium rounded-full px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default NewDiscussion;
