import React, { ReactNode, useEffect, useState } from 'react';
import { useSideBar } from '../hooks/useSideBar';
import { useResponsive } from '../hooks/useResponsive';
import { RxArrowLeft, RxChatBubble, RxGear, RxExit } from 'react-icons/rx';
import { BsWifi, BsWifiOff } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCleanCookiesAndDisconnect } from '../hooks/useCleanCookiesAndDisconnect';
import { useCookies } from 'react-cookie';
import { TopBar } from './TopBar';
import Tooltip from './Tooltip';

export type SidebarButtonProps = {
  name: string;
  icon: ReactNode;
  onClick: () => void;
  isMobile: boolean;
  path: string;
};

const SidebarButton = ({
  name,
  icon,
  onClick,
  isMobile,
  path,
  tooltipText,
}: SidebarButtonProps & { tooltipText?: string }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Tooltip
      isMobile={isMobile}
      tooltipText={tooltipText || name}
      position="right"
    >
      <div
        className={`cursor-pointer flex items-center p-2 text-base font-semibold text-violet-500 rounded-lg ${
          isActive ? 'bg-violet-50' : ''
        } hover:bg-violet-50`}
        onClick={onClick}
      >
        {icon}
        {isMobile && (
          <span className="flex-1 ml-3 whitespace-nowrap">{name}</span>
        )}
      </div>
    </Tooltip>
  );
};

interface SidebarType {
  children?: ReactNode;
}

const Sidebar = (props: SidebarType) => {
  const { isOpen, toggle } = useSideBar();
  const { isMobile } = useResponsive();
  const [cookies] = useCookies(['userName']);
  const cleanCookiesAndDisconnect = useCleanCookiesAndDisconnect();
  const navigate = useNavigate();

  const onClickHome = () => {
    navigate('/');
  };

  const onClickSettings = () => {
    navigate('/settings');
  };

  const onClickDisconnect = () => {
    cleanCookiesAndDisconnect();
    navigate('/signin');
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <>
      <TopBar toggle={toggle} isMobile={isMobile} />

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-transform md:translate-x-0 ${
          !isOpen ? '-translate-x-full' : ''
        } ${isMobile ? 'w-60' : 'border-r border-gray-200'}`}
        aria-label="Sidebar"
      >
        <div className="h-full px-2 py-2 md:py-0 overflow-y-auto bg-white">
          <div className="flex items-center p-2">
            {isMobile && (
              <>
                <div className="font-bold ml-2 text-lg text-violet-600">
                  {cookies.userName}
                </div>
                <RxArrowLeft
                  className="absolute right-0 mr-4 hover:bg-violet-100 rounded-md"
                  onClick={toggle}
                  size={30}
                  color={'#8b5cf6'}
                />
              </>
            )}
          </div>

          <div className={`space-y-3 ${isMobile ? 'mt-10' : ''}`}>
            <SidebarButton
              name="Discussions"
              icon={<RxChatBubble size={24} color={'#8b5cf6'} />}
              onClick={onClickHome}
              isMobile={isMobile}
              path="/"
              tooltipText="Discussions"
            />
            <SidebarButton
              name="Settings"
              icon={<RxGear size={24} color={'#8b5cf6'} />}
              onClick={onClickSettings}
              isMobile={isMobile}
              path="/settings"
              tooltipText="Settings"
            />
            <Tooltip
              position="right"
              tooltipText={isOnline ? 'Connected' : 'Offline'}
              isMobile={isMobile}
            >
              <div className="flex items-center p-2">
                {isOnline ? (
                  <BsWifi size={24} color={'#8b5cf6'} />
                ) : (
                  <BsWifiOff size={24} color={'#8b5cf6'} />
                )}
                {isMobile && (
                  <span className="flex-1 ml-3 whitespace-nowrap text-base font-semibold text-violet-500">
                    {isOnline ? 'Connected' : 'Offline'}
                  </span>
                )}
              </div>
            </Tooltip>
            <SidebarButton
              name="Sign Out"
              icon={<RxExit size={24} color={'#8b5cf6'} />}
              onClick={onClickDisconnect}
              isMobile={isMobile}
              path=""
              tooltipText="Sign Out"
            />
          </div>
        </div>
      </aside>
      <div className="min-h-screen md:px-7 p-0">{props.children}</div>
    </>
  );
};

export default Sidebar;
