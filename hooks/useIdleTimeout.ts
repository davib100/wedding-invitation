import { useState, useEffect, useRef } from 'react';

export const useIdleTimeout = (onIdle: () => void, idleTime = 1000 * 60 * 60) => {
  const timeoutId = useRef<number | null>(null);

  const startTimer = () => {
    timeoutId.current = window.setTimeout(onIdle, idleTime);
  };

  const resetTimer = () => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }
    startTimer();
  };

  const handleEvent = () => {
    resetTimer();
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    // Initial timer start
    startTimer();

    // Add event listeners
    events.forEach(event => window.addEventListener(event, handleEvent));

    // Cleanup
    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      events.forEach(event => window.removeEventListener(event, handleEvent));
    };
  }, [onIdle, idleTime]);

  return {};
};
