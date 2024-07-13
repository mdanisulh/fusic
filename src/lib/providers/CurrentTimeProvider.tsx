"use client";
import React, { createContext, useEffect, useState } from "react";
import { useAudio } from "../hooks/useAudio";

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
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const storedTime = localStorage.getItem("currentTime");
    if (storedTime) {
      audio.currentTime = parseFloat(storedTime);
      setCurrentTime(parseFloat(storedTime));
    }
  }, [audio]);

  useEffect(() => {
    localStorage.setItem("currentTime", currentTime.toFixed(2));
  }, [currentTime]);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener("timeupdate", updateCurrentTime);
    return () => audio.removeEventListener("timeupdate", updateCurrentTime);
  }, [isPlaying, audio]);

  const setTime = (time: number) => {
    audio.currentTime = time;
  };

  return (
    <CurrentTimeContext.Provider value={{ currentTime, setTime }}>
      {children}
    </CurrentTimeContext.Provider>
  );
}
