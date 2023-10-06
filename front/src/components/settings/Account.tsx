import React from 'react';
import { useCookies } from 'react-cookie';

const Account = () => {
  const [cookies] = useCookies(['userName', 'email']);
  return (
    <div className="mb-4">
      <div className="text-base font-semibold mb-2">Account</div>
      <div className="rounded-xl hover:bg-violet-100 px-3 py-2">
        <div className="font-medium text-stone-800"> {cookies.userName}</div>
        <div className="text-xs text-zinc-500">{cookies.email}</div>
      </div>
    </div>
  );
};

export default Account;
