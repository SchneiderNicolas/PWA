import React, { useRef, useState } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';
import { User } from '../../../types/discussionTypes';
import UserSearch from './UserSearch';
import SelectedUser from './SelectedUser';
import Tooltip from '../../Tooltip';
import { FiEdit2 } from 'react-icons/fi';

type NewDiscussionTopBarProps = {
  initialTitle: string;
};

const NewDiscussionTopBar = ({ initialTitle }: NewDiscussionTopBarProps) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const isMobile = useResponsive();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleUserRemove = (userEmail: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.email !== userEmail));
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      className={`z-40 sticky top-0 bg-white border-b border-gray-200 ${
        !isMobile ? ' border-l border-gray-200 ml-96 border-r' : ''
      }`}
    >
      <div className="flex flex-col items-center px-4 py-2">
        <div className="text-lg font-bold text-center mb-1 flex items-center">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleTitleKeyPress}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
              className="flex-grow text-lg font-bold py-2 px-4 focus:outline-none"
            />
          ) : (
            <>
              {title}
              <Tooltip
                isMobile={isMobile.isMobile}
                tooltipText="Edit Title"
                position="right+"
              >
                <div className="ml-4 cursor-pointer flex items-center p-2 text-base font-semibold text-violet-500 rounded-full bg-violet-50 hover:bg-violet-100">
                  <FiEdit2
                    onClick={() => setIsEditingTitle(true)}
                    size={18}
                    color={'#8b5cf6'}
                  />
                </div>
              </Tooltip>
            </>
          )}
        </div>
        <div className="w-full">
          <UserSearch
            onSelect={handleUserSelect}
            selectedUsers={selectedUsers}
          />
          <div className="flex flex-wrap space-x-2 mt-2">
            {selectedUsers.map((user) => (
              <SelectedUser
                key={user.email}
                user={user}
                onRemove={handleUserRemove}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDiscussionTopBar;
