import React from 'react';
import { User } from '../../../types/discussionTypes';

type SelectedUserProps = {
  user: User;
  onRemove: (userEmail: string) => void;
};

const SelectedUser = ({ user, onRemove }: SelectedUserProps) => {
  return (
    <div className="px-3 py-1 rounded-md bg-violet-400 text-white text-sm mb-1">
      {user.name ? `${user.name} (${user.email})` : user.email}{' '}
      <button onClick={() => onRemove(user.email)}>×</button>{' '}
    </div>
  );
};

export default SelectedUser;
