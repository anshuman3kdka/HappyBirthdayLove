import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type WishContextType = {
  isHolding: boolean;
  isWishing: boolean;
};

const WishContext = createContext<WishContextType>({ isHolding: false, isWishing: false });

export const useWish = () => useContext(WishContext);

export const WishProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [isWishing, setIsWishing] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const startHold = () => {
      if (!isHolding && !isWishing) {
        setIsHolding(true);
        if (pressTimer.current) clearTimeout(pressTimer.current);
        pressTimer.current = setTimeout(() => {
          setIsHolding(false);
          setIsWishing(true);
        }, 1500); // 1.5 seconds hold
      }
    };

    const stopHold = () => {
      setIsHolding(false);
      setIsWishing(false); // They let go, we cancel the wish state so they can do it again later
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        startHold();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        stopHold();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      startHold();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!pressTimer.current && !isHolding) return;
      
      const moveX = e.touches[0].clientX;
      const moveY = e.touches[0].clientY;
      
      // Cancel if they move their finger too much (it's a scroll, not a long press)
      if (Math.abs(moveX - touchStartX) > 15 || Math.abs(moveY - touchStartY) > 15) {
        stopHold();
      }
    };

    const handleTouchEnd = () => {
      stopHold();
    };

    const handleContextMenu = (e: Event) => {
      // Prevent the default mobile device menu (copy, share, etc.) from interrupting the long press
      e.preventDefault();
    };

    const handleBlur = () => {
      stopHold();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Use passive: false so we have full control over the touch experience if needed,
    // though for touchstart/move here we aren't preventing default currently.
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('blur', handleBlur);
      
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, [isWishing]);

  return (
    <WishContext.Provider value={{ isHolding, isWishing }}>
      {children}
    </WishContext.Provider>
  );
};
