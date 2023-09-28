import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { User } from '../../types/discussionTypes';
import Tooltip from '../Tooltip';

type DiscussionTopBarProps = {
  title: string;
  users: User[];
};

const DiscussionTopBar = ({ title, users }: DiscussionTopBarProps) => {
  const isMobile = useResponsive();
  return (
    <div
      className={`z-40 sticky top-0 bg-white border-b border-gray-200 ${
        !isMobile ? ' border-l border-gray-200 ml-96 border-r' : ''
      }`}
    >
      <div className="flex flex-col items-center px-4 py-2">
        <div className="text-lg font-bold text-center mb-1">{title}</div>
        <div className="flex flex-wrap space-x-2 self-start">
          {users.map((user) => (
            <Tooltip key={user.id} tooltipText={user.email} position="top">
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
