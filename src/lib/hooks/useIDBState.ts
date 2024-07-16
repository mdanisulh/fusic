"use client";
import { useEffect, useState } from "react";
import { idbGet, idbSet } from "../services/idb";

export const useIDBState = <T>(
  key: string,
  initialValue: T,
  onInit: (value: T) => void,
  useLocalStorage = false,
) => {
  const [state, setState] = useState(() => {
    if (!useLocalStorage) return initialValue;
    const value = localStorage.getItem(key);
    if (value) {
      const parsedValue = JSON.parse(value);
      onInit(parsedValue);
      return parsedValue;
    }
  });

  useEffect(() => {
    const init = async () => {
      const storedValue = await idbGet(key);
      if (storedValue) {
        const value: T = storedValue;
        onInit(value);
        setState(value);
      }
    };
    if (!useLocalStorage) init();
  }, [key, onInit, useLocalStorage]);

  useEffect(() => {
    if (useLocalStorage) localStorage.setItem(key, JSON.stringify(state));
    else idbSet(key, state);
  }, [state, key, useLocalStorage]);

  return [state, setState] as [
    state: T,
    setState: React.Dispatch<React.SetStateAction<T>>,
  ];
};
