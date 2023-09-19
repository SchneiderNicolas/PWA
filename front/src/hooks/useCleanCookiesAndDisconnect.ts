import { useCookies } from 'react-cookie';

export const useCleanCookiesAndDisconnect = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookie, setCookie, removeCookie] = useCookies([
    'accessToken',
    'userName',
  ]);

  const cleanCookiesAndDisconnect = () => {
    console.log('disconnect');
    removeCookie('accessToken', { path: '/' });
    removeCookie('userName', { path: '/' });
  };

  return cleanCookiesAndDisconnect;
};
