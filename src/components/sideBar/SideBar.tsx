"use client";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import React, { useEffect, useState } from "react";

export default function SideBar({
  name,
  children,
}: {
  name: "left" | "right";
  children: React.ReactNode;
}) {
  const uiConfig = useUIConfig()!;
  const width = name === "left" ? uiConfig.lsbWidth : uiConfig.rsbWidth;
  const setWidth =
    name === "left" ? uiConfig.setLSBWidth : uiConfig.setRSBWidth;
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;
    const onMouseMove = (e: TouchEvent | MouseEvent) => {
      const clientX =
        (e as unknown as TouchEvent).touches?.[0]?.clientX ||
        (e as unknown as MouseEvent).clientX;
      const newWidth =
        (name === "left" ? clientX : window.innerWidth - clientX) - 12;
      setWidth(newWidth);
    };
    const onMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchend", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [isResizing, name, width, setWidth]);

  const resizer = (
    <div
      className="group h-full w-2 cursor-e-resize py-1"
      onMouseDown={() => setIsResizing(true)}
      onTouchStart={() => setIsResizing(true)}
    >
      {isResizing && <div className="m-auto h-full w-0.5 bg-white" />}
      {!isResizing && (
        <div className="m-auto h-full w-0.5 group-hover:bg-white" />
      )}
    </div>
  );
  return (
    (name !== "right" || uiConfig.rsbView !== "none") && (
      <div
        className="flex shrink-0"
        style={{ cursor: isResizing ? "e-resize" : "default" }}
      >
        {name === "right" && resizer}
        <div style={{ width: width }}>{children}</div>
        {name === "left" && resizer}
      </div>
    )
  );
}
