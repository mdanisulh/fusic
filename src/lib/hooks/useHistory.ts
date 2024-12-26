"use client";
import { useContext } from "react";
import { HistoryContext } from "../providers/HistoryProvider";

export const useHistory = () => useContext(HistoryContext);
