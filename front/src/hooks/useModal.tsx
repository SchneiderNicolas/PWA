import { useState, useEffect } from 'react';

export const useModal = () => {
  const [isModalOpen, setisModalOpen] = useState(false);

  const toggleModal = () => {
    setisModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    }
    if (!isModalOpen) {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  return {
    isModalOpen,
    toggleModal,
  };
};
