"use client";

import Song from "@/types/song";
import { createContext, useCallback } from "react";
import { useIDBState } from "../hooks/useIDBState";

interface HistoryState {
  history: Record<string, number>;
  last100: Song[];
}

const initialState: HistoryState = {
  history: {},
  last100: [],
};

export const HistoryContext = createContext<HistoryInterface | null>(null);

interface HistoryInterface extends HistoryState {
  addSong: (song: Song, duration: number) => void;
}

export default function HistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const onInit = useCallback(() => {}, []);
  const [state, setState] = useIDBState("history", initialState, onInit);
  const addSong = (song: Song, duration: number) => {
    setState((state) => {
      const newHistory = { ...state.history };
      if (newHistory[song.id]) {
        newHistory[song.id] += duration;
      } else {
        newHistory[song.id] = duration;
      }
      const last100 = [song, ...state.last100.filter((s) => s.id !== song.id)];
      while (last100.length > 100) {
        last100.pop();
      }
      return { history: newHistory, last100 };
    });
  };
  return (
    <HistoryContext.Provider value={{ ...state, addSong }}>
      {children}
    </HistoryContext.Provider>
  );
}
