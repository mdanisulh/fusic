"use client";
import React, { createContext, useCallback, useEffect, useRef } from "react";

import Song, { dummySong } from "@/types/song";
import { useHistory } from "../hooks/useHistory";
import { useIDBReducer } from "../hooks/useIDBReducer";
import { useQueue } from "../hooks/useQueue";

export const AudioContext = createContext<AudioInterface | null>(null);

interface AudioState {
  isPlaying: boolean;
  volume: number;
  song: Song;
}
interface AudioInterface extends AudioState {
  togglePlay: () => void;
  setTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setSong: (song: Song) => void;
  setQueue: (songs: Song[], id: string) => void;
  playPrevious: () => void;
  playNext: () => void;
  setLyrics: (lyrics: { time: number; line: string }[]) => void;
  audio: HTMLAudioElement;
}

function audioReducer(
  state: AudioState,
  action: { type: string; payload: any },
) {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "togglePlay":
      return { ...state, isPlaying: !state.isPlaying };
    case "setDuration":
      return { ...state, song: { ...state.song, duration: action.payload } };
    case "setLyrics":
      return { ...state, song: { ...state.song, lyrics: action.payload } };
    case "setVolume":
      return { ...state, volume: action.payload };
    case "setSong":
      return { ...state, song: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export default function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audio = useRef(new Audio()).current;

  const {
    queue,
    extraQueue,
    currentIndex,
    shuffleIndices,
    repeat,
    setCurrentIndex,
    removeFromExtraQueue,
    updateQueue,
  } = useQueue()!;
  const { addSong } = useHistory()!;

  const initialState = {
    isPlaying: false,
    song: dummySong,
    volume: 1,
  };
  const onInit = useCallback(
    (state: AudioState) => {
      state.isPlaying = false;
      audio.src = state.song.url;
      audio.volume = state.volume;
    },
    [audio],
  );
  const [state, dispatch] = useIDBReducer(
    "audioState",
    audioReducer,
    initialState,
    onInit,
    true,
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((window as any).isInputFocused) return;
      if (!audio) return;
      e.preventDefault();
      switch (e.key) {
        case " ":
          togglePlay();
          break;
        case "ArrowLeft":
          audio.currentTime = Math.max(0, audio.currentTime - 5);
          break;
        case "ArrowRight":
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
          break;
        case "n":
          playNext(true);
          break;
        case "p":
          playPrevious();
          break;
        case "ArrowUp":
          setVolume(Math.min(1, state.volume + 0.1));
          break;
        case "ArrowDown":
          setVolume(Math.max(0, state.volume - 0.1));
          break;
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [audio, state.isPlaying, state.volume]); // eslint-disable-line

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: state.song["name"],
        artist: state.song["artists"]
          .map((artist: { name: string }) => artist["name"])
          .join(", "),
        album: (state.song["album"] && state.song["album"]["name"]) || "",
        artwork: [
          { src: state.song["image"][1], sizes: "150x150", type: "image/jpeg" },
        ],
      });
      navigator.mediaSession.setActionHandler("play", () => {
        dispatch({ type: "togglePlay", payload: undefined });
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        dispatch({ type: "togglePlay", payload: undefined });
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => playNext());
      navigator.mediaSession.setActionHandler("previoustrack", playPrevious);
    }

    if (state.isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    const handleSongEnd = () => playNext(true);
    audio.addEventListener("ended", handleSongEnd);

    const setDuration = () =>
      dispatch({ type: "setDuration", payload: audio.duration });
    audio.addEventListener("loadedmetadata", setDuration);

    return () => {
      audio.removeEventListener("loadedmetadata", setDuration);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [state.isPlaying, currentIndex, state.song, extraQueue]); // eslint-disable-line

  const playNext = (canRepeat = false) => {
    if (canRepeat && repeat == 2) {
      setSong(queue[shuffleIndices[currentIndex]]);
    } else if (extraQueue.length > 0) {
      setSong(extraQueue[0]);
      removeFromExtraQueue(0);
    } else if (currentIndex === queue.length - 1) {
      if (repeat === 0) {
        setSong(queue[shuffleIndices[0]], !canRepeat);
        setCurrentIndex(0);
        return;
      }
      setSong(queue[shuffleIndices[0]]);
      setCurrentIndex(0);
    } else {
      setSong(queue[shuffleIndices[currentIndex + 1]]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const playPrevious = () => {
    const previousIndex =
      (currentIndex - 1 + shuffleIndices.length) % shuffleIndices.length;
    setSong(queue[shuffleIndices[previousIndex]]);
    setCurrentIndex(previousIndex);
  };

  const setLyrics = (lyrics: { time: number; line: string }[]) =>
    dispatch({ type: "setLyrics", payload: lyrics });

  const setSong = (song: Song, play = true) => {
    if (!song) return;
    if (audio.currentTime >= 10) {
      addSong(state.song, Math.floor(audio.currentTime));
    }
    audio.src = song.url;
    if (play) audio.play();
    if (!state.isPlaying) togglePlay();
    if (!play && state.isPlaying) togglePlay();
    dispatch({ type: "setSong", payload: song });
  };

  const setTime = (time: number) => (audio.currentTime = time);

  const setVolume = (volume: number) => {
    const newVolume = parseFloat(volume.toFixed(2));
    audio.volume = newVolume;
    dispatch({ type: "setVolume", payload: newVolume });
  };

  const setQueue = (songs: Song[], id: string) => {
    if (songs.length === 0) return;
    const newIndex = updateQueue(songs, id);
    setSong(songs[newIndex]);
  };

  const togglePlay = () => dispatch({ type: "togglePlay", payload: undefined });

  const value = {
    ...state,
    audio: audio,
    playNext,
    playPrevious,
    setLyrics,
    setSong,
    setTime,
    setVolume,
    setQueue,
    togglePlay,
  };
  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}
