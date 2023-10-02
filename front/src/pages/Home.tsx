import React from 'react';
import Discussion from '../components/discussion/Discussion';
import Discussions from '../components/discussion/list/Discussions';
import NewDiscussion from '../components/discussion/new/NewDiscussion';
import { useDiscussionContext } from '../contexts/DiscussionContext';

const Home = () => {
  const { viewState } = useDiscussionContext();

  const renderRightPanel = () => {
    switch (viewState.type) {
      case 'NEW_DISCUSSION':
        return <NewDiscussion />;
      case 'DISCUSSION':
        return <Discussion />;
      default:
        return <NewDiscussion />;
    }
  };

  return (
    <div className="flex">
      <div className="pt-14">
        <Discussions />
      </div>
      <div className="md:flex-grow hidden md:block">{renderRightPanel()}</div>
    </div>
  );
};

export default Home;
