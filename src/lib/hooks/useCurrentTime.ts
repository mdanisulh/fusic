"use client";
import { useContext } from "react";
import { CurrentTimeContext } from "@/lib/providers/CurrentTimeProvider";

export const useCurrentTime = () => useContext(CurrentTimeContext);
