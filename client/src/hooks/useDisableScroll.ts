import { useEffect } from 'react';

const useDisableScroll = (isDisable: boolean = false) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflowY;

    // Disable scroll behavior
    document.body.style.overflowY = isDisable ? 'hidden' : 'unset';

    return () => {
      // Re-enable scroll behavior when component unmounts
      document.body.style.overflowY = originalOverflow || 'unset';
    };
  }, [isDisable]);
};

export default useDisableScroll;
