import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null): void => {
  const savedCallback = useRef<() => void>(callback); // Fix: tambahkan initial value

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};