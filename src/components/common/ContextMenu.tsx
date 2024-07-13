"use client";
import React, { useEffect, useState } from "react";

export default function ContextMenu() {
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    show: boolean;
  }>({
    mouseX: 0,
    mouseY: 0,
    show: false,
  });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      show: true,
    });
  };

  useEffect(() => {
    if (contextMenu.show) return;
    const handleClick = () => {
      setContextMenu({ ...contextMenu, show: false });
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        width: "100%",
        height: "100%",
      }}
      className="fixed left-0 top-0 h-full w-full bg-black bg-opacity-50"
    >
      <ul
        style={{
          display: contextMenu.show ? "block" : "none",
          position: "fixed",
          top: `${contextMenu.mouseY}px`,
          left: `${contextMenu.mouseX}px`,
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          boxShadow: "0px 0px 5px #aaa",
        }}
      >
        {/* Render your context menu items here */}
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
      </ul>

      {/* Your component's content here */}
    </div>
  );
}
