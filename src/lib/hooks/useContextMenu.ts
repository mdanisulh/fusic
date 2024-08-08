"use client";
import { useContext } from "react";
import { ContextMenuContext } from "../providers/ContextMenuProvider";

export type MenuItem = {
  icon?: string;
  text: string;
  onClick: (e: React.MouseEvent) => void;
};
export const useContextMenu = () => useContext(ContextMenuContext);
