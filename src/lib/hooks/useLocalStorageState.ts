"use client";
import { useEffect, useState } from "react";

export const useLocalStorageState = (key: string, defaultValue: any) => {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};
