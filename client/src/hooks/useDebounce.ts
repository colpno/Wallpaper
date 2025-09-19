import { useEffect, useState } from 'react';

function useDebounce(delay: number): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [valueToDebounce, setValueToDebounce] = useState('');
  const [debounce, setDebounce] = useState(valueToDebounce);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounce(valueToDebounce), delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [valueToDebounce, delay]);

  return [debounce, setValueToDebounce];
}

export default useDebounce;
