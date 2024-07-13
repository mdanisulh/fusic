"use client";
import { useEffect, useState } from "react";

export const useLocalStorageState = <T>(
  key: string,
  initialValue: T,
  onInit: (value: T) => void = () => {},
) => {
  const [state, setState] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      const value: T = JSON.parse(storedValue);
      onInit(value);
      return value;
    }
    return initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState] as [
    state: T,
    setState: React.Dispatch<React.SetStateAction<T>>,
  ];
};
