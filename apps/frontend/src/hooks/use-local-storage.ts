import { useEffect, useState } from 'react';

const PREFIX = '@snipet/';

export const useLocalStorage = <T = string>(key: string, defaultValue?: T | null) => {
  const k = PREFIX + key;
  const [state, setState] = useState<T | null>((): T | null => {
    const item = localStorage.getItem(k);

    if (item) {
      return JSON.parse(item) as T;
    }
    else return defaultValue || null;
  });

  useEffect(() => {
    if (!state) localStorage.removeItem(k);
    localStorage.setItem(k, JSON.stringify(state));
  }, [k, state]);

  return [state, setState] as const;
}