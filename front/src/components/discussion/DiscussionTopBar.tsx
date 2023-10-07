import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDiscussionContext } from '../../contexts/DiscussionContext';
import { useResponsive } from '../../hooks/useResponsive';
import { User } from '../../types/discussionTypes';
import Tooltip from '../Tooltip';

type DiscussionTopBarProps = {
  title: string;
  users: User[];
};

const DiscussionTopBar = ({ title, users }: DiscussionTopBarProps) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { resetViewState } = useDiscussionContext();

  const handleBackClick = () => {
    resetViewState();
    navigate('/');
  };

  return (
    <div className={'z-30 sticky top-0 bg-white border-b border-gray-200'}>
      {isMobile && (
        <button
          onClick={handleBackClick}
          className="absolute top-0 left-0 cursor-pointer flex items-center p-2 text-base font-semibold text-violet-500 rounded-br-md hover:bg-violet-100"
          aria-label="Go back"
        >
          <FiArrowLeft size={24} color={'#8b5cf6'} />
        </button>
      )}
      <div className="flex flex-col items-center px-4 py-2">
        <div className="text-lg font-bold text-center mb-4 md:mb-2">
          {title}
        </div>
        <div className="flex flex-wrap space-x-2 self-start">
          {users.map((user) => (
            <Tooltip
              isMobile={isMobile}
              key={user.id}
              tooltipText={user.email}
              position="top"
            >
              <div className="px-3 py-1 rounded-md bg-violet-400 text-white font-medium text-sm mb-1 cursor-pointer">
                {user.name || user.email}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionTopBar;
