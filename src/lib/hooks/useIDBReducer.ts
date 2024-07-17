"use client";
import { useEffect, useReducer } from "react";
import { idbGet, idbSet } from "../services/idb";

export const useIDBReducer = <T>(
  key: string,
  reducer: (state: T, action: { type: string; payload: any }) => T,
  initialValue: T,
  onInit: (value: T) => void,
  useLocalStorage = false,
) => {
  const init = () => {
    if (useLocalStorage) {
      const value = localStorage.getItem(key);
      if (value) {
        const parsedValue = JSON.parse(value);
        onInit(parsedValue);
        return parsedValue;
      }
    }
    return initialValue;
  };
  const [state, dispatch] = useReducer(reducer, initialValue, init);

  useEffect(() => {
    const loadInitialState = async () => {
      const value: T = await idbGet(key);
      if (value) {
        onInit(value);
        dispatch({ type: "INIT", payload: value });
      }
    };
    if (!useLocalStorage) loadInitialState();
  }, [key, onInit, useLocalStorage]);

  useEffect(() => {
    if (useLocalStorage) localStorage.setItem(key, JSON.stringify(state));
    else idbSet(key, state);
  }, [state, key, useLocalStorage]);

  return [state, dispatch] as [
    state: T,
    dispatch: React.Dispatch<{ type: string; payload: any }>,
  ];
};
