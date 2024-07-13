"use client";
import { QueueContext } from "@/lib/providers/QueueProvider";
import { useContext } from "react";

export const useQueue = () => useContext(QueueContext);
