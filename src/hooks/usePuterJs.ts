import { useEffect, useState } from 'react';

export const usePuterAvailable = () => {
  const [puterAvailable, setPuterAvailable] = useState(false);
  const [puterLoading, setPuterLoading] = useState(true);

  useEffect(() => {
    // Check if Puter.js is already loaded
    const checkPuter = () => {
      if (typeof window !== 'undefined' && 'puter' in window) {
        console.log('✅ Puter.js is available');
        setPuterAvailable(true);
        setPuterLoading(false);
      }
    };

    // Try immediately
    checkPuter();

    // If not available, wait for it to load
    if (!("puter" in window)) {
      const maxAttempts = 20; // 10 seconds max
      let attempts = 0;

      const interval = setInterval(() => {
        attempts++;
        console.log(`Checking for Puter.js... (attempt ${attempts}/${maxAttempts})`);
        
        if (typeof window !== 'undefined' && 'puter' in window) {
          console.log('✅ Puter.js loaded after polling');
          setPuterAvailable(true);
          setPuterLoading(false);
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          console.error('❌ Puter.js failed to load after 10 seconds');
          setPuterLoading(false);
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, []);

  return { puterAvailable, puterLoading };
};

export const initPuter = async (timeout = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    // Check if already loaded
    if ('puter' in window) {
      console.log('✅ Puter.js already loaded');
      resolve(true);
      return;
    }

    // Wait for Puter to load
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if ('puter' in window) {
        console.log('✅ Puter.js loaded');
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        console.error('❌ Puter.js load timeout');
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};
