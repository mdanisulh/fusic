"use client";
import { LibraryContext } from "@/lib/providers/LibraryProvider";
import { useContext } from "react";

export const useLibrary = () => useContext(LibraryContext);
