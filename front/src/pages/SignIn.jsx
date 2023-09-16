import React, { useState } from 'react';
import Button from '../components/Button.tsx';
import Input from '../components/Input.tsx';
import { useCookies } from 'react-cookie';

const SignIn = () => {
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [, setCookie] = useCookies(['authToken']);

  const onSubmit = async () => {
    console.log(userName + pass);
    setLoginError(true);
    setCookie('authToken', 'test', { path: '/' });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="px-12 py-12 shadow bg-white rounded-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-600 text-center mb-4">
          Connectez-vous à votre compte
        </h1>
        <Input
          placeholder="E-mail"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          id="input_email"
        />
        <Input
          placeholder="Mot de passe"
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
          Identifiants incorrects. Veuillez réessayer.
        </p>
        <Button type="button" className="-mt-2" onClick={onSubmit}>
          Connexion
        </Button>
        <p className="mt-1 text-sm text-center text-gray-400">
          Vous n&apos;avez pas de compte ?{' '}
          <a href="/signUp" className="text-lime-400 underline">
            Créez-en un ici
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SignIn;
