import React from 'react';
import Account from './Account';
import Notifications from './Notifications';

const ModalSettings = () => {
  return (
    <div className="mt-2 flex flex-col justify-center items-center">
      <div className="text-xl font-semibold mb-4">Settings</div>
      <div className="w-full mt-6 ml-2 space-y-6">
        <Account />
        <Notifications />
      </div>
    </div>
  );
};

export default ModalSettings;
