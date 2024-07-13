"use client";
import { AudioContext } from "@/lib/providers/AudioProvider";
import { useContext } from "react";

export const useAudio = () => useContext(AudioContext);
