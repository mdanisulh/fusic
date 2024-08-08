"use client";
import Album from "@/types/album";
import Artist from "@/types/artist";
import Playlist from "@/types/playlist";
import Song from "@/types/song";
import React, { createContext, useCallback } from "react";
import { useIDBReducer } from "../hooks/useIDBReducer";

export const LibraryContext = createContext<LibraryInterface | null>(null);
interface LibraryState {
  playlists: Record<string, Playlist>;
  artists: Artist[];
  albums: Album[];
}
interface LibraryInterface extends LibraryState {
  createPlaylist: (playlist: Playlist) => void;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (song: Song, playlistId: string) => void;
  removeFromPlaylist: (songId: string, playlistId: string) => void;
  isSongInPlaylist: (songId: string, playlistId: string) => boolean;
  isPlaylistInLibrary: (playlistId: string) => boolean;
  followArtist: (artist: Artist) => void;
  unfollowArtist: (artistId: string) => void;
  isFollowingArtist: (artistId: string) => boolean;
  addAlbum: (album: Album) => void;
  removeAlbum: (albumId: string) => void;
  isAlbumInLibrary: (albumId: string) => boolean;
}
const initialState: LibraryState = {
  playlists: {
    _liked: {
      id: "_liked",
      name: "Liked Songs",
      image: [],
      songs: [],
      artists: [],
    },
  },
  artists: [],
  albums: [],
};

function libraryReducer(
  state: LibraryState,
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
    case "FOLLOW_ARTIST":
      return {
        ...state,
        artists: [...state.artists, action.payload],
      };
    case "UNFOLLOW_ARTIST":
      return {
        ...state,
        artists: state.artists.filter((artist) => artist.id !== action.payload),
      };
    case "ADD_ALBUM":
      return {
        ...state,
        albums: [...state.albums, action.payload],
      };
    case "REMOVE_ALBUM":
      return {
        ...state,
        albums: state.albums.filter((album) => album.id !== action.payload),
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
  const [state, dispatch] = useIDBReducer(
    "playlists",
    libraryReducer,
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
    if (!isSongInPlaylist(song.id, playlistId)) {
      dispatch({ type: "ADD_TO_PLAYLIST", payload: { song, playlistId } });
    }
  };
  const removeFromPlaylist = (
    songId: string,
    playlistId: string = "_liked",
  ) => {
    dispatch({ type: "REMOVE_FROM_PLAYLIST", payload: { songId, playlistId } });
  };
  const isSongInPlaylist = (songId: string, playlistId: string = "_liked") => {
    return (
      playlistId in state.playlists &&
      state.playlists[playlistId].songs.some((song) => song.id === songId)
    );
  };
  const isPlaylistInLibrary = (playlistId: string) => {
    return playlistId in state.playlists;
  };

  const followArtist = (artist: Artist) => {
    dispatch({ type: "FOLLOW_ARTIST", payload: artist });
  };
  const unfollowArtist = (artistId: string) => {
    dispatch({ type: "UNFOLLOW_ARTIST", payload: artistId });
  };
  const isFollowingArtist = (artistId: string) => {
    return artistId in state.artists;
  };

  const addAlbum = (album: Album) => {
    dispatch({ type: "ADD_ALBUM", payload: album });
  };
  const removeAlbum = (albumId: string) => {
    dispatch({ type: "REMOVE_ALBUM", payload: albumId });
  };
  const isAlbumInLibrary = (albumId: string) => {
    return albumId in state.albums;
  };

  const value = {
    ...state,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    isSongInPlaylist,
    isPlaylistInLibrary,
    followArtist,
    unfollowArtist,
    isFollowingArtist,
    addAlbum,
    removeAlbum,
    isAlbumInLibrary,
  };
  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}
