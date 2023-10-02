import { useCookies } from 'react-cookie';

export const useCleanCookiesAndDisconnect = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookie, setCookie, removeCookie] = useCookies([
    'accessToken',
    'userName',
    'userId',
  ]);

  const cleanCookiesAndDisconnect = () => {
    removeCookie('accessToken', { path: '/' });
    removeCookie('userName', { path: '/' });
    removeCookie('userId', { path: '/' });
  };

  return cleanCookiesAndDisconnect;
};
