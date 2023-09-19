import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

type TooltipProps = {
  tooltipText: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  isMobile?: boolean;
};

const Tooltip = ({
  tooltipText,
  children,
  position = 'top',
  isMobile,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ top: rect.top, left: rect.left });

    timeoutRef.current = window.setTimeout(() => {
      setVisible(true);
    }, 300);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  const calculateStyle = () => {
    switch (position) {
      case 'top':
        return {
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transform: 'translateY(-100%)',
        };
      case 'right':
        return {
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transform: 'translateX(50%)',
        };
      case 'bottom':
        return {
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transform: 'translateY(100%)',
        };
      case 'left':
        return {
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transform: 'translateX(-100%)',
        };
      default:
        return {};
    }
  };

  const tooltip = (
    <div
      className={`absolute z-50 p-2 bg-stone-600 font-semibold text-sm text-white rounded-lg transition-opacity ${
        visible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      style={calculateStyle()}
    >
      {tooltipText}
    </div>
  );

  return (
    <div onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isMobile ? null : ReactDOM.createPortal(tooltip, document.body)}
    </div>
  );
};

export default Tooltip;
