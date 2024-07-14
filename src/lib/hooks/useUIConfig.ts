"use client";
import { UIConfigContext } from "@/lib/providers/UIConfigProvider";
import { useContext } from "react";

export const useUIConfig = () => useContext(UIConfigContext);
