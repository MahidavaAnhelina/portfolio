import { useCallback, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStored(value);
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage full or unavailable — fall through silently.
      }
    },
    [key],
  );

  return [stored, setValue];
}
