import React, { useEffect, useRef, useState } from 'react';
import config from '../../../config/config';
import { User } from '../../../types/discussionTypes';
import { useCookies } from 'react-cookie';
import NewDiscussionTopBar from './NewDiscussionTopBar';
import { useDiscussionContext } from '../../../contexts/DiscussionContext';

const NewDiscussion = () => {
  const [messageInput, setMessageInput] = useState('');
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [title, setTitle] = useState('New Discussion');
  const [cookies] = useCookies(['accessToken']);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { showDiscussion, toggleForceUpdate } = useDiscussionContext();

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleUserRemove = (userEmail: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.email !== userEmail));
  };

  const handleNewDiscussion = () => {
    const payload = {
      title,
      emails: selectedUsers.map((user) => user.email),
      message: messageInput,
    };

    fetch(`${config.API_BASE_URL}/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.accessToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        showDiscussion(data.id);
        toggleForceUpdate();
      })
      .catch((error) => console.error('Error:', error));
  };

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

  return (
    <div className="flex flex-col h-full">
      <div ref={topBarRef}>
        <NewDiscussionTopBar
          title={title}
          selectedUsers={selectedUsers}
          onTitleChange={handleTitleChange}
          onUserSelect={handleUserSelect}
          onUserRemove={handleUserRemove}
        />
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
