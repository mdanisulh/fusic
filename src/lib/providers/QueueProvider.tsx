"use client";
import Song from "@/types/song";
import React, { createContext, useEffect, useReducer } from "react";
import shuffleArray from "../utils/shuffleArray";

export const QueueContext = createContext<QueueInterface | null>(null);

interface QueueState {
  queue: Song[];
  extraQueue: Song[];
  shuffleIndices: number[];
  currentIndex: number;
  shuffle: boolean;
  repeat: number;
  id: string;
}
interface QueueInterface extends QueueState {
  addToExtraQueue: (song: Song) => void;
  removeFromExtraQueue: (index: number) => void;
  updateQueue: (queue: Song[], id: string) => void;
  clearQueue: () => void;
  removeFromQueue: (index: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setCurrentIndex: (index: number) => void;
}

const queueReducer = (
  state: QueueState,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case "ADD_TO_EXTRA_QUEUE":
      return { ...state, extraQueue: [...state.extraQueue, action.payload] };
    case "REMOVE_FROM_EXTRA_QUEUE":
      return {
        ...state,
        extraQueue: state.extraQueue.filter(
          (_, index) => index !== action.payload,
        ),
      };
    case "CLEAR_EXTRA_QUEUE":
      return { ...state, extraQueue: [] };
    case "UPDATE_QUEUE":
      return {
        ...state,
        queue: action.payload.songs,
        id: action.payload.id,
        currentIndex: 0,
        shuffleIndices: state.shuffle
          ? shuffleArray(action.payload.songs.length)
          : [...Array(action.payload.songs.length).keys()],
      };
    case "REMOVE_FROM_QUEUE":
      return {
        ...state,
        queue: state.queue.filter((_, index) => index !== action.payload),
      };
    case "SHUFFLE_QUEUE":
      return {
        ...state,
        shuffle: !state.shuffle,
        shuffleIndices: action.payload,
      };
    case "UPDATE_CURRENT_INDEX":
      return { ...state, currentIndex: action.payload };
    case "TOGGLE_REPEAT":
      return { ...state, repeat: (state.repeat + 1) % 3 };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState = {
    id: "fusic",
    queue: [],
    extraQueue: [],
    shuffleIndices: [],
    currentIndex: 0,
    shuffle: false,
    repeat: 1,
  };
  function loadInitialState() {
    const savedState = localStorage.getItem("queueState");
    if (savedState) {
      try {
        const state: QueueState = JSON.parse(savedState);
        return state;
      } catch (e) {
        console.error("Error loading state from localStorage:", e);
      }
    }
    return initialState;
  }
  const [state, dispatch] = useReducer(
    queueReducer,
    initialState,
    loadInitialState,
  );

  useEffect(() => {
    localStorage.setItem("queueState", JSON.stringify(state));
  }, [state]);

  const addToExtraQueue = (song: Song) =>
    dispatch({ type: "ADD_TO_EXTRA_QUEUE", payload: song });

  const removeFromExtraQueue = (index: number) =>
    dispatch({ type: "REMOVE_FROM_EXTRA_QUEUE", payload: index });

  const clearQueue = () =>
    dispatch({ type: "CLEAR_EXTRA_QUEUE", payload: null });

  const updateQueue = (songs: Song[], id: string) =>
    dispatch({ type: "UPDATE_QUEUE", payload: { songs, id } });

  const removeFromQueue = (index: number) =>
    dispatch({ type: "REMOVE_FROM_QUEUE", payload: index });

  const setCurrentIndex = (index: number) =>
    dispatch({ type: "UPDATE_CURRENT_INDEX", payload: index });

  const toggleRepeat = () =>
    dispatch({ type: "TOGGLE_REPEAT", payload: undefined });

  const toggleShuffle = () => {
    dispatch({
      type: "UPDATE_CURRENT_INDEX",
      payload: state.shuffleIndices[state.currentIndex],
    });
    if (state.shuffle) {
      dispatch({
        type: "SHUFFLE_QUEUE",
        payload: [...Array(state.queue.length).keys()],
      });
    } else {
      dispatch({
        type: "SHUFFLE_QUEUE",
        payload: shuffleArray(state.queue.length, state.currentIndex),
      });
      dispatch({
        type: "UPDATE_CURRENT_INDEX",
        payload: 0,
      });
    }
  };

  const value = {
    ...state,
    addToExtraQueue,
    removeFromExtraQueue,
    clearQueue,
    updateQueue,
    removeFromQueue,
    setCurrentIndex,
    toggleRepeat,
    toggleShuffle,
  };
  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
};

export default QueueProvider;
