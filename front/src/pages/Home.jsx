import React from 'react';
import { useCookies } from 'react-cookie';

const Home = () => {
  const [cookies] = useCookies(['authToken']);
  console.log(cookies.authToken);
  return <div>Home</div>;
};

export default Home;
