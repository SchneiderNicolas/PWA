import React from 'react';
import { RxTextAlignJustify, RxPencil1 } from 'react-icons/rx';
import Tooltip from './Tooltip';

export type TopBarProps = {
  toggle: () => void;
  isMobile: boolean;
};

export const TopBar = ({ toggle, isMobile }: TopBarProps) => {
  const handleNewDiscussionClick = () => {
    console.log('new discussion');
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 ${
        !isMobile ? 'ml-14 border-l border-gray-200' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2">
        {isMobile && (
          <RxTextAlignJustify
            className="text-sm rounded-lg"
            onClick={toggle}
            size={30}
            color={'#8b5cf6'}
          />
        )}
        <div className="text-lg font-bold text-center">Discussions</div>
        <div className="flex items-center space-x-4">
          <Tooltip
            isMobile={isMobile}
            tooltipText="New message"
            position="left"
          >
            <div className="cursor-pointer flex items-center p-1 text-base font-semibold text-violet-500 rounded-lg hover:bg-violet-50">
              <RxPencil1
                onClick={handleNewDiscussionClick}
                size={24}
                color={'#8b5cf6'}
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
