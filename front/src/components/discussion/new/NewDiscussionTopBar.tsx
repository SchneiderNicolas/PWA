import React, { useRef, useState } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';
import { User } from '../../../types/discussionTypes';
import UserSearch from './UserSearch';
import SelectedUser from './SelectedUser';
import Tooltip from '../../Tooltip';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDiscussionContext } from '../../../contexts/DiscussionContext';

type NewDiscussionTopBarProps = {
  title: string;
  selectedUsers: User[];
  onTitleChange: (title: string) => void;
  onUserSelect: (user: User) => void;
  onUserRemove: (userEmail: string) => void;
};

const NewDiscussionTopBar = ({
  title,
  selectedUsers,
  onTitleChange,
  onUserSelect,
  onUserRemove,
}: NewDiscussionTopBarProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { isMobile } = useResponsive();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { resetViewState } = useDiscussionContext();

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  const handleBackClick = () => {
    resetViewState();
    navigate('/');
  };

  return (
    <div className={'z-40 sticky top-0 bg-white border-b border-gray-200'}>
      {isMobile && (
        <button
          onClick={handleBackClick} // use handleBackClick function
          className="absolute top-0 left-0 cursor-pointer flex items-center p-2 text-base font-semibold text-violet-500 rounded-br-md hover:bg-violet-100"
          aria-label="Go back"
        >
          <FiArrowLeft size={24} color={'#8b5cf6'} />{' '}
        </button>
      )}
      <div className="flex flex-col items-center px-4 py-2">
        <div className="text-lg font-bold text-center mb-1 flex items-center">
          {isEditingTitle ? (
            <input
              autoComplete="off"
              ref={inputRef}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyPress={handleTitleKeyPress}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
              className="flex-grow text-lg font-bold py-2 px-4 focus:outline-none"
            />
          ) : (
            <>
              {title}
              <Tooltip
                isMobile={isMobile}
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
          <UserSearch onSelect={onUserSelect} selectedUsers={selectedUsers} />
          <div className="flex flex-wrap space-x-2 mt-2">
            {selectedUsers.map((user) => (
              <SelectedUser
                key={user.email}
                user={user}
                onRemove={onUserRemove}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDiscussionTopBar;
