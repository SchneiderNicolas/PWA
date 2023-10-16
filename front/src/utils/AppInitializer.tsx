import { openDB } from 'idb';
import React, { ReactNode, useEffect } from 'react';

interface AppInitializerProps {
  children: ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  useEffect(() => {
    async function setupDatabase() {
      try {
        await openDB('myDB', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('outbox')) {
              db.createObjectStore('outbox', {
                autoIncrement: true,
                keyPath: 'id',
              });
            }
          },
        });
      } catch (error) {
        console.error('Error setting up the database:', error);
      }
    }

    setupDatabase();
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
