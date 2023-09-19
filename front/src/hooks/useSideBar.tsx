import { useState } from 'react';
import { useResponsive } from './useResponsive';

export const useSideBar = () => {
  const [isOpen, setisOpen] = useState(false);
  const { isMobile } = useResponsive();

  const toggle = () => {
    if (isMobile) {
      setisOpen(!isOpen);
    }
  };

  return {
    isOpen,
    toggle,
  };
};
