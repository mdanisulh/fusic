"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function Slider({
  range,
  value,
  minWidth,
  maxWidth,
  thickness = 4,
  thumbSize = 12,
  onChange,
}: {
  range: number;
  value: number;
  minWidth?: number;
  maxWidth?: number;
  thickness?: number;
  thumbSize?: number;
  onChange: (value: number) => void;
}) {
  const [width, setWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (ref.current?.clientWidth) {
        setWidth(ref.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleSliderMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (ref.current && thumbRef.current) {
        const rect = ref.current.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newCompleted = Math.max(0, Math.min(newX, width));
        const newValue = (newCompleted / width) * range;
        onChange(newValue);
      }
    },
    [onChange, width, range],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleSliderMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleSliderMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleSliderMove]);

  const completed = (value / range) * 100;
  const remaining = 100 - completed;
  const thumbLeftPosition = Math.max(
    Math.ceil((value / range) * width) - thumbSize / 2,
    0,
  );
  return (
    <div
      ref={ref}
      style={{
        maxWidth: maxWidth,
        minWidth: minWidth,
        height: thumbSize,
      }}
      className="group relative flex flex-grow cursor-pointer self-center"
      onClick={handleSliderMove}
    >
      <div
        style={{
          height: thickness,
          flex: `${completed} ${completed} ${completed}%`,
        }}
        className={`flex self-center rounded-s-full bg-white ${value === range ? "rounded-e-full" : ""}`}
      ></div>
      <div
        ref={thumbRef}
        style={{
          position: "absolute",
          left: thumbLeftPosition,
          height: thumbSize,
          width: thumbSize,
        }}
        className="flex-1 self-center rounded-full group-hover:bg-white"
        onMouseDown={handleMouseDown}
      ></div>
      <div
        style={{
          height: thickness,
          flex: `${remaining} ${remaining} ${remaining}%`,
        }}
        className={`flex self-center rounded-e-full bg-grey ${value === 0 ? "rounded-s-full" : ""}`}
      ></div>
    </div>
  );
}
