"use client";
import React, { createContext, useCallback, useEffect } from "react";
import { useAudio } from "../hooks/useAudio";
import { useIDBState } from "../hooks/useIDBState";

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
  const onInit = useCallback(
    (value: number) => audio && (audio.currentTime = value),
    [audio],
  );
  const [currentTime, setCurrentTime] = useIDBState<number>(
    "currentTime",
    0,
    onInit,
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
