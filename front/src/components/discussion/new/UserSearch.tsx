import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import config from '../../../config/config';
import fetcher from '../../../utils/fetcher';
import { useCookies } from 'react-cookie';
import UserItem from './UserItem';
import { User } from '../../../types/discussionTypes';

type UserSearchProps = {
  onSelect: (user: User) => void;
  selectedUsers: User[];
};

const UserSearch = ({ onSelect, selectedUsers }: UserSearchProps) => {
  const [cookies] = useCookies(['accessToken']);
  const [searchTerm, setSearchTerm] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUsers]);

  const { data: users } = useSWR<User[]>(
    searchTerm ? `${config.API_BASE_URL}/users?term=${searchTerm}` : null,
    (url: string) => fetcher(url, cookies.accessToken) as Promise<User[]>,
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const isEmailValid = /\S+@\S+\.\S+/.test(searchTerm);
      if (isEmailValid) {
        onSelect({ email: searchTerm });
        setSearchTerm('');
      }
    }
  };

  const selectedUserEmails = selectedUsers.map((user) => user.email);
  const filteredUsers = users
    ? users.filter((user) => !selectedUserEmails.includes(user.email))
    : [];

  return (
    <div className="relative flex items-center">
      <label htmlFor="userSearch" className="text-gray-700 font-medium">
        To:
      </label>
      <input
        ref={inputRef}
        id="userSearch"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder=""
        className="flex-grow py-2 px-4 focus:outline-none"
        autoFocus
      />
      {filteredUsers && filteredUsers.length > 0 && (
        <div className="absolute top-full mt-2 w-96 bg-white border border-gray-300 p-2 rounded-xl shadow-md z-50 overflow-hidden">
          {filteredUsers.map((user) => (
            <div
              key={user.email}
              onClick={() => {
                onSelect(user);
                setSearchTerm('');
              }}
            >
              <UserItem user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
