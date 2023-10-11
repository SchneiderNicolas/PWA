import React, { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import config from '../../config/config';

const Notifications = () => {
  const [cookies] = useCookies(['accessToken']);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showDisableGuide, setShowDisableGuide] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const unsubscribeFromNotifications = useCallback(async () => {
    try {
      await fetch(`${config.API_BASE_URL}/notifications/disable`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  }, [cookies.accessToken]);

  useEffect(() => {
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      setIsBlocked(false);
    } else if (Notification.permission === 'denied') {
      setIsBlocked(true);
    } else {
      unsubscribeFromNotifications();
    }
  }, [unsubscribeFromNotifications]);

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log(registration);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: config.PUBLIC_VAPID_KEY,
      });
      console.log(subscription);
      await fetch(`${config.API_BASE_URL}/notifications/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.accessToken}`,
        },
        body: JSON.stringify({ subscription }),
      });
      setNotificationsEnabled(true);
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled && !isBlocked) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeToNotifications();
        setNotificationsEnabled(true);
        setShowDisableGuide(false);
        setIsBlocked(false);
      } else if (permission === 'denied') {
        setIsBlocked(true);
      }
    } else {
      setNotificationsEnabled(false);
      setShowDisableGuide(true);
    }
  };

  return (
    <div>
      <div className="text-base font-semibold mb-2">Parameters</div>
      <div className="pr-4 flex items-center justify-between">
        <div className="px-3 py-2">
          <div className="font-medium text-stone-800">Notifications</div>
          <div className="text-xs text-zinc-600">
            Receive notifications of discussions and messages sent to you
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
            disabled={isBlocked}
          />
          <div className="w-11 h-6 bg-zinc-300 peer-focus:ring-violet-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
        </label>
      </div>
      {showDisableGuide && (
        <div className="mt-2 pl-4 text-xs text-zinc-500">
          To disable notifications, please go to your browser settings and
          remove notification permissions for this site.
        </div>
      )}
      {isBlocked && (
        <div className="mt-2 pl-4 text-xs text-red-500">
          Notifications are blocked. Please unblock notifications in your
          browser settings to enable them.
        </div>
      )}
    </div>
  );
};

export default Notifications;
