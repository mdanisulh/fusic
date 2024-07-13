"use client";
import { useEffect, useReducer } from "react";

export const useLocalStorageReducer = <T>(
  key: string,
  reducer: (state: T, action: { type: string; payload: any }) => T,
  initialValue: T,
  onInit: (value: T) => void = () => {},
) => {
  const loadInitialState = () => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      const value: T = JSON.parse(storedValue);
      onInit(value);
      return value;
    }
    return initialValue;
  };
  const [state, dispatch] = useReducer(reducer, initialValue, loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, dispatch] as [
    state: T,
    dispatch: React.Dispatch<{ type: string; payload: any }>,
  ];
};
