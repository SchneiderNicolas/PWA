import React from 'react';
import { RxTextAlignJustify } from 'react-icons/rx';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDiscussionContext } from '../contexts/DiscussionContext';
import Tooltip from './Tooltip';

export type TopBarProps = {
  toggle: () => void;
  isMobile: boolean;
};

export const TopBar = ({ toggle, isMobile }: TopBarProps) => {
  const { showNewDiscussion } = useDiscussionContext();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-white border-gray-200 ${
        !isMobile ? 'ml-14 border-l border-gray-200 w-96 border-r' : ''
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {isMobile && (
          <RxTextAlignJustify
            className="text-sm rounded-lg"
            onClick={toggle}
            size={30}
            color={'#8b5cf6'}
          />
        )}
        <div className="md:text-2xl text-xl font-bold text-center">
          Discussions
        </div>
        <div className="flex items-center space-x-4">
          <Tooltip
            isMobile={isMobile}
            tooltipText="New message"
            position="left"
          >
            <div className="cursor-pointer flex items-center p-2 text-base font-semibold text-violet-500 rounded-full bg-violet-50 hover:bg-violet-100">
              <FiEdit
                onClick={() => {
                  showNewDiscussion();
                  navigate('/new', { replace: false });
                }}
                size={20}
                color={'#8b5cf6'}
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
