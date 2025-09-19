import React, { useEffect } from 'react';

function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [ref.current]);
}

export default useClickOutside;
