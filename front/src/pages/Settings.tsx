import React from 'react';
import config from '../config/config';

const Settings = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  });

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: config.PUBLIC_VAPID_KEY,
        })
        .then((subscription) => {
          console.log('User is subscribed:', subscription);
        })
        .catch((err) => {
          console.log('Failed to subscribe the user: ', err);
        });
    });
  }

  return <div className="bg-zinc-50 h-screen pt-24">Settings</div>;
};

export default Settings;
