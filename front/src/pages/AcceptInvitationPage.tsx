import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import config from '../config/config';

const AcceptInvitationPage = () => {
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEmail(queryParams.get('email') || '');
    setInviteCode(queryParams.get('inviteCode') || '');
  }, [location.search]);

  const onSubmit = async () => {
    if (pass !== confirmPass) {
      setSignUpError('Passwords do not match.');
      return;
    }
    const response = await fetch(
      `${config.API_BASE_URL}/auth/register-invite`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode: inviteCode,
          name: userName,
          password: pass,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setSignUpError(data.message);
      return;
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="px-12 py-12 shadow bg-white rounded-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-600 text-center mb-2">
          Complete Your Registration
        </h1>
        <p className="text-md text-gray-600 text-center mb-4">{email}</p>
        <Input
          placeholder="Username"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          id="input_username"
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setPass(e.target.value);
          }}
          id="input_password"
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          onChange={(e) => {
            setConfirmPass(e.target.value);
          }}
          id="input_confirm_password"
        />
        <p
          className={`text-red-600 text-center text-sm -mt-2 capitalize ${
            signUpError ? 'animate-shake' : 'invisible'
          }`}
        >
          {signUpError || 'invisible'}
        </p>
        <Button type="button" className="-mt-2" onClick={onSubmit}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;
