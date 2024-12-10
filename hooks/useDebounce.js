import React, {useState, useEffect} from 'react';

function useDebounce(search, delay = 500) {
  const [deferredValue, setDeferredValue] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredValue(search);
    }, delay);

    return () => clearTimeout(timer);
  }, [search, delay]);

  return deferredValue;
}

export default useDebounce;
