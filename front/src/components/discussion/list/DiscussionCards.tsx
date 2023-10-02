import React from 'react';
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

  const { data: discussions, error } = useSWR<Discussion[]>(
    [`${config.API_BASE_URL}/discussions`, forceUpdate], // Depend on forceUpdate
    ([url]) => fetcher(url, cookies.accessToken), // destructuring the array
  );

  if (error) return <div>Error loading discussions.</div>;
  if (!discussions) return <div>Loading...</div>;

  return (
    <div>
      {discussions.map((discussion) => (
        <div
          key={discussion.id}
          className={`p-2 rounded-xl cursor-pointer ${
            discussion.id === viewState.discussionId
              ? 'bg-violet-100'
              : 'hover:bg-violet-100'
          }`}
          onClick={() => {
            showDiscussion(discussion.id);
            navigate(`/discussion/${discussion.id}`, { replace: false });
          }}
        >
          <h2 className="text-stone-800 font-medium">{discussion.title}</h2>
          <div className="flex justify-between items-center mt-1 text-sm">
            <p className="text-zinc-500 truncate flex-grow">
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
