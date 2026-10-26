import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value changes (e.g. search input keystrokes)
 * @param {any} value - The input value to debounce
 * @param {number} delay - Milliseconds to delay (default: 300ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value changes before delay window completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
