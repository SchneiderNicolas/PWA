import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import config from '../../config/config.dev';
import fetcher from '../../utils/fetcher';
import { useCookies } from 'react-cookie';
import { Discussion as DiscussionType } from '../../types/discussionTypes';
import MessageBubble from './MessageBubble';
import DiscussionTopBar from './DiscussionTopBar';
import { useDiscussionContext } from '../../contexts/DiscussionContext';

const Discussion = () => {
  const [messageInput, setMessageInput] = useState('');
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [cookies] = useCookies(['accessToken', 'userId']);
  const navigate = useNavigate();
  const { discussionId: routeDiscussionId } = useParams<{
    discussionId: string;
  }>();
  const { viewState } = useDiscussionContext();
  const discussionId = routeDiscussionId || viewState.discussionId;

  useEffect(() => {
    if (!routeDiscussionId && discussionId) {
      navigate(`/discussion/${discussionId}`, { replace: false });
    }
  }, [navigate, routeDiscussionId, discussionId]);
  const {
    data: discussion,
    error,
    mutate,
  } = useSWR<DiscussionType>(
    `${config.API_BASE_URL}/discussions/${discussionId}`,
    (url) => fetcher(url, cookies.accessToken),
  );
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [discussion]);

  const topBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (topBarRef.current) {
      setTopBarHeight(topBarRef.current.offsetHeight);
    }
  }, [discussion]);

  const handleSendMessage = async () => {
    if (messageInput.trim() === '' || !discussionId) return;

    let numericDiscussionId: number;

    if (typeof discussionId === 'number') {
      numericDiscussionId = Math.floor(discussionId);
    } else if (typeof discussionId === 'string') {
      numericDiscussionId = parseInt(discussionId, 10);

      if (isNaN(numericDiscussionId)) {
        console.error('Invalid discussionId');
        return;
      }
    } else {
      console.error('Invalid discussionId');
      return;
    }

    const response = await fetch(`${config.API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.accessToken}`,
      },
      body: JSON.stringify({
        content: messageInput,
        discussionId: numericDiscussionId,
      }),
    });

    if (response.ok) {
      setMessageInput('');
      mutate();
    } else {
      console.error('Failed to send message');
    }
  };

  if (error) return <div>Error loading discussion.</div>;
  if (!discussion) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      <div ref={topBarRef}>
        <DiscussionTopBar title={discussion.title} users={discussion.users} />
      </div>
      <div
        className="flex-grow p-2 overflow-y-auto"
        style={{ maxHeight: `calc(100vh - ${topBarHeight}px - 4rem)` }}
      >
        {discussion.messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isUser={message.user.id === cookies.userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 flex">
        <input
          type="text"
          placeholder="Aa"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-grow rounded-full py-2 px-4 mr-2 bg-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-violet-500 text-white font-medium rounded-full px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Discussion;
