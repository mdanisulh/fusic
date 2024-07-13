"use client";
import React, { useEffect, useState } from "react";

export default function SideBar({
  name,
  children,
}: {
  name: "left" | "right";
  children: React.ReactNode;
}) {
  const [width, setWidth] = useState(280);
  const [otherWidth, setOtherWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const newOtherWidth = parseInt(
      localStorage?.getItem(
        `${name === "left" ? "right" : "left"}SideBarWidth`,
      ) ?? "280",
    );
    const newWidth = parseInt(
      localStorage?.getItem(`${name}SideBarWidth`) ?? "280",
    );
    setOtherWidth(newOtherWidth);
    setWidth(newWidth);
    const mainWidth = window.innerWidth - newWidth - newOtherWidth - 32;
    document
      .querySelector(".main-section")
      ?.setAttribute("style", `width: ${mainWidth}px`);
  }, [name]);

  useEffect(() => {
    if (!isResizing) return;
    const onMouseMove = (e: MouseEvent) => {
      let newWidth = e.clientX;
      if (name === "right") {
        newWidth = window.innerWidth - e.clientX;
      }
      newWidth -= 8;
      const mainWidth = window.innerWidth - newWidth - otherWidth;
      if (newWidth < 280 || mainWidth < 430) return;
      setWidth(newWidth);
      document
        .querySelector(".main-section")
        ?.setAttribute("style", `width: ${mainWidth - 32}px`);
    };
    const onMouseUp = () => {
      setIsResizing(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      localStorage?.setItem(`${name}SideBarWidth`, width.toString());
    };
  }, [isResizing, name, width, otherWidth]);

  const resizer = (
    <div
      className="h-full w-2 cursor-e-resize"
      onMouseDown={() => setIsResizing(true)}
    />
  );
  return (
    <div className="flex">
      {name === "right" && resizer}
      <div style={{ width: width }}>{children}</div>
      {name === "left" && resizer}
    </div>
  );
}
