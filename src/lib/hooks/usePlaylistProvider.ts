"use client";
import { PlaylistContext } from "@/lib/providers/PlaylistProvider";
import { useContext } from "react";

export const usePlaylist = () => useContext(PlaylistContext);
