import React, { useState } from 'react';
import Button from '../components/Button.tsx';
import Input from '../components/Input.tsx';

const SignUpPage = () => {
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');
  const [email, setUserEmail] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [signUpError, setSignUpError] = useState('');

  const onSubmit = async () => {
    if (pass.current !== confirmPass.current) {
      setSignUpError('Les mots de passe ne correspondent pas.');
      return;
    }

    console.log(userName + email + pass + confirmPass);
    setSignUpError(true);

    /*
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName.current,
          email: email.current,
          password: pass.current,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setSignUpError(data.message);
      return;
    }
    */
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="px-12 py-12 shadow bg-white rounded-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-600 text-center mb-4">
          Créez votre compte
        </h1>
        <Input
          placeholder="Nom d'utilisateur"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          id="input_username"
        />
        <Input
          placeholder="E-mail"
          onChange={(e) => {
            setUserEmail(e.target.value);
          }}
          id="input_email"
          type="email"
        />
        <Input
          placeholder="Mot de passe"
          type="password"
          onChange={(e) => {
            setPass(e.target.value);
          }}
          id="input_password"
        />
        <Input
          placeholder="Confirmez le mot de passe"
          type="password"
          onChange={(e) => {
            setConfirmPass(e.target.value);
          }}
          id="input_confirm_password"
        />
        <p
          className={`text-red-600 text-center text-sm -mt-2 ${
            signUpError ? 'animate-shake' : 'invisible'
          }`}
        >
          {signUpError || 'invisible'}
        </p>
        <Button type="button" className="-mt-2" onClick={onSubmit}>
          Inscription
        </Button>
        <p className="mt-1 text-sm text-center text-gray-400">
          Vous avez déjà un compte ?{' '}
          <a href="/signin" className="text-lime-400 underline cursor-pointer">
            Connectez-vous ici
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
