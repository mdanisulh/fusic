"use client";
import React, { createContext, useEffect, useState } from "react";
import IconButton from "@/components/common/IconButton";
import { MenuItem } from "../hooks/useContextMenu";

interface ContextMenuInterface {
  handleContextMenu: (event: React.MouseEvent, menuList: MenuItem[]) => void;
}

export const ContextMenuContext = createContext<ContextMenuInterface | null>(
  null,
);

export default function ContextMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contextMenu, setContextMenu] = useState({
    show: false,
    top: true,
    left: true,
    mouseX: 0,
    mouseY: 0,
  });
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const handleContextMenu = (event: React.MouseEvent, menuList: MenuItem[]) => {
    event.preventDefault();
    setMenuList(menuList);
    const top = event.clientY < window.innerHeight / 2;
    const left = event.clientX + 200 < window.innerWidth;
    setContextMenu({
      show: true,
      top,
      left,
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  useEffect(() => {
    if (!contextMenu.show) return;
    const handleClick = () => {
      setContextMenu({
        ...contextMenu,
        show: false,
      });
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleClick);
    };
  }, [contextMenu]);

  return (
    <ContextMenuContext.Provider value={{ handleContextMenu }}>
      <div className="h-full">
        {children}
        <div
          style={{
            display: contextMenu.show ? "block" : "none",
            position: "fixed",
            top: contextMenu.top ? `${contextMenu.mouseY}px` : "auto",
            left: contextMenu.left ? `${contextMenu.mouseX}px` : "auto",
            right: contextMenu.left
              ? "auto"
              : `${window.innerWidth - contextMenu.mouseX}px`,
            bottom: contextMenu.top
              ? "auto"
              : `${window.innerHeight - contextMenu.mouseY}px`,
          }}
          className="z-50 rounded-md bg-zinc-700 p-1 shadow-md"
        >
          {menuList.map((item, index) => (
            <IconButton
              iconPath={item.icon}
              iconSize={16}
              key={index}
              text={item.text}
              onClick={item.onClick}
              spacing={10}
              className="block w-full rounded-md px-2 py-2 text-left text-sm hover:bg-zinc-500"
            />
          ))}
        </div>
      </div>
    </ContextMenuContext.Provider>
  );
}
