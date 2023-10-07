import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useCookies } from 'react-cookie';
import config from '../../../config/config';
import fetcher from '../../../utils/fetcher';
import { Discussion } from '../../../types/discussionTypes';
import { useNavigate } from 'react-router-dom';
import { useDiscussionContext } from '../../../contexts/DiscussionContext';

const DiscussionCards = () => {
  const [cookies] = useCookies(['accessToken']);
  const navigate = useNavigate();
  const { showDiscussion, viewState } = useDiscussionContext();
  const { forceUpdate } = useDiscussionContext();
  const [localDiscussions, setLocalDiscussions] = useState<Discussion[] | null>(
    null,
  );

  const { data: discussions, error } = useSWR<Discussion[]>(
    [`${config.API_BASE_URL}/discussions`, forceUpdate],
    ([url]) => fetcher(url, cookies.accessToken),
  );

  useEffect(() => {
    setLocalDiscussions(discussions || null);
  }, [discussions]);

  const handleDiscussionClick = (id: number) => {
    if (localDiscussions) {
      const updatedDiscussions = localDiscussions.map((discussion) =>
        discussion.id === id ? { ...discussion, isNew: false } : discussion,
      );
      setLocalDiscussions(updatedDiscussions);
      showDiscussion(id);
      navigate(`/discussion/${id}`, { replace: false });
    }
  };

  if (error) return <div>Error loading discussions.</div>;
  if (!localDiscussions) return <div>Loading...</div>;

  return (
    <div>
      {localDiscussions.map((discussion) => (
        <div
          key={discussion.id}
          className={`p-2 rounded-xl cursor-pointer relative ${
            discussion.id === viewState.discussionId
              ? 'bg-violet-100'
              : 'hover:bg-violet-100'
          }`}
          onClick={() => handleDiscussionClick(discussion.id)}
        >
          {discussion.isNew && (
            <span className="block absolute top-0 right-0 w-3 h-3 mt-2 mr-2 bg-violet-500 rounded-full" />
          )}
          <h2
            className={`text-stone-800 ${
              discussion.isNew ? 'font-bold' : 'font-medium'
            }`}
          >
            {discussion.title}
          </h2>
          <div className="flex justify-between items-center mt-1 text-sm">
            <p
              className={`truncate flex-grow ${
                discussion.isNew
                  ? 'font-semibold text-stone-800'
                  : 'text-zinc-500'
              }`}
            >
              <span>{discussion.messages[0]?.user.name}:</span>{' '}
              {discussion.messages[0]?.content}
            </p>
            <small className="text-gray-500 ml-2 whitespace-nowrap">
              {discussion.messages[0]?.formattedCreatedAt}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionCards;
