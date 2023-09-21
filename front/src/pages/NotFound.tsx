import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const onClickBackHome = () => navigate('/');
  return (
    <section className="flex items-center h-screen p-12 gradient__bg">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-black-6">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-3xl font-semibold text-white-6 leading-snug">
            Sorry, we couldn't find this page.
          </p>
          <p className="mt-8 mb-10 text-white-6">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Button
            type="submit"
            className="px-8 py-3 font-semibold rounded-lg bg-purple-1 hover:bg-purple-2"
            onClick={onClickBackHome}
          >
            Back to homepage
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
