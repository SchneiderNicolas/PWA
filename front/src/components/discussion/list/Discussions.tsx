import React from 'react';
import DiscussionCards from './DiscussionCards';

const Discussions = () => {
  return (
    <>
      <div className="mt-2 md:w-96 w-screen md:h-[calc(100vh-64px)] md:border-r md:border-gray-200 p-2 overflow-y-auto">
        <DiscussionCards />
      </div>
    </>
  );
};

export default Discussions;
