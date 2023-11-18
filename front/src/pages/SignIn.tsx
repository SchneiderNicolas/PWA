import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [, setCookie] = useCookies([
    'accessToken',
    'userName',
    'userId',
    'email',
  ]);
  const navigate = useNavigate();

  const onSubmit = async () => {
    const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoginError(data.message);
      return;
    } else {
      setCookie('accessToken', data.accessToken, { path: '/' });
      setCookie('userName', data.name, { path: '/' });
      setCookie('userId', data.id, { path: '/' });
      setCookie('email', data.email, { path: '/' });
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="px-12 py-12 shadow bg-white rounded-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-600 text-center mb-4">
          Sign in to your accounttt
        </h1>
        <Input
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          id="input_email"
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setPass(e.target.value);
          }}
          id="input_password"
        />
        <p
          className={`text-red-600 text-center text-sm -mt-2 ${
            loginError ? 'animate-shake' : 'invisible'
          }`}
        >
          Incorrect credentials. Please try again.
        </p>
        <Button type="button" className="-mt-2" onClick={onSubmit}>
          Login
        </Button>
        <p className="mt-1 text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-violet-500 underline">
            Create one here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SignIn;
