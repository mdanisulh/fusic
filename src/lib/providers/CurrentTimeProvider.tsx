"use client";
import React, { createContext, useEffect } from "react";
import { useAudio } from "../hooks/useAudio";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

export const CurrentTimeContext = createContext({
  currentTime: 0,
  setTime: (_: number) => {},
});

export default function CurrentTimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { audio, isPlaying } = useAudio()!;
  const [currentTime, setCurrentTime] = useLocalStorageState<number>(
    "currentTime",
    0,
    (value: number) => audio && (audio.currentTime = value),
  );

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener("timeupdate", updateCurrentTime);
    return () => audio.removeEventListener("timeupdate", updateCurrentTime);
  }, [isPlaying, audio, setCurrentTime]);

  const setTime = (time: number) => {
    audio.currentTime = time;
  };

  return (
    <CurrentTimeContext.Provider value={{ currentTime, setTime }}>
      {children}
    </CurrentTimeContext.Provider>
  );
}
