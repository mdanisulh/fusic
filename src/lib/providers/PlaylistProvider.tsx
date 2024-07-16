"use client";
import Playlist from "@/types/playlist";
import Song from "@/types/song";
import React, { createContext, useCallback } from "react";
import { useIDBReducer } from "../hooks/useIDBReducer";

export const PlaylistContext = createContext<PlaylistInterface | null>(null);
interface PlaylistState {
  playlists: Record<string, Playlist>;
}
interface PlaylistInterface extends PlaylistState {
  createPlaylist: (playlist: Playlist) => void;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (song: Song, playlistId: string) => void;
  removeFromPlaylist: (songId: string, playlistId: string) => void;
  searchInPlaylist: (songId: string, playlistId: string) => boolean;
}

function playlistReducer(
  state: PlaylistState,
  action: { type: string; payload: any },
) {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "CREATE_PLAYLIST":
      return {
        playlists: { ...state.playlists, [action.payload.id]: action.payload },
      };
    case "DELETE_PLAYLIST":
      const { [action.payload]: _, ...playlists } = state.playlists;
      return { playlists };
    case "ADD_TO_PLAYLIST":
      return {
        playlists: {
          ...state.playlists,
          [action.payload.playlistId]: {
            ...state.playlists[action.payload.playlistId],
            songs: [
              ...state.playlists[action.payload.playlistId].songs,
              action.payload.song,
            ],
          },
        },
      };
    case "REMOVE_FROM_PLAYLIST":
      return {
        playlists: {
          ...state.playlists,
          [action.payload.playlistId]: {
            ...state.playlists[action.payload.playlistId],
            songs: state.playlists[action.payload.playlistId].songs.filter(
              (song) => song.id !== action.payload.songId,
            ),
          },
        },
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export default function PlaylistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState: PlaylistState = {
    playlists: {
      _liked: {
        id: "_liked",
        name: "Liked Songs",
        image: [],
        songs: [],
        artists: [],
      },
    },
  };
  const [state, dispatch] = useIDBReducer(
    "playlists",
    playlistReducer,
    initialState,
    useCallback(() => {}, []),
  );

  const createPlaylist = (playlist: Playlist) => {
    dispatch({ type: "CREATE_PLAYLIST", payload: playlist });
  };
  const deletePlaylist = (playlistId: string) => {
    dispatch({ type: "DELETE_PLAYLIST", payload: playlistId });
  };
  const addToPlaylist = (song: Song, playlistId: string = "_liked") => {
    dispatch({ type: "ADD_TO_PLAYLIST", payload: { song, playlistId } });
  };
  const removeFromPlaylist = (
    songId: string,
    playlistId: string = "_liked",
  ) => {
    dispatch({ type: "REMOVE_FROM_PLAYLIST", payload: { songId, playlistId } });
  };
  const searchInPlaylist = (songId: string, playlistId: string = "_liked") => {
    return state.playlists[playlistId].songs.some((song) => song.id === songId);
  };

  const value = {
    ...state,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    searchInPlaylist,
  };
  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}
