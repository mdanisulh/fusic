"use client";
import { useContext } from "react";
import { ContextMenuContext } from "../providers/ContextMenuProvider";

export type MenuItem = { icon?: string; text: string; onClick: () => void };
export const useContextMenu = () => useContext(ContextMenuContext);
