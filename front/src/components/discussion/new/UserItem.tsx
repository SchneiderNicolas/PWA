import React from 'react';
import { User } from '../../../types/discussionTypes';

type UserItemProps = {
  user: User;
};

const UserItem = ({ user }: UserItemProps) => {
  return (
    <div className="rounded-xl hover:bg-violet-100 px-3 py-2">
      <div className="font-medium text-stone-800"> {user.name}</div>
      <div className="text-sm text-zinc-500"> {user.email}</div>
    </div>
  );
};

export default UserItem;
