import React, { useEffect, useRef, useState } from "react";

export default function ScrollableDiv({
  children,
  className,
  style,
  onHover = true,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onHover?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollDuration, setScrollDuration] = useState("0s");
  const [scrollDistance, setScrollDistance] = useState("0px");

  useEffect(() => {
    const updateScroll = () => {
      if (ref.current) {
        const scrollWidth = ref.current.scrollWidth;
        const clientWidth = ref.current.clientWidth;
        if (scrollWidth - clientWidth > 25) {
          const distance = scrollWidth - clientWidth;
          const duration = distance / 10 + "s";
          setScrollDuration(duration);
          setScrollDistance(`-${distance}px`);
        } else {
          setScrollDuration("0s");
          setScrollDistance("0px");
        }
      }
    };

    updateScroll();

    const resizeObserver = new ResizeObserver(() => {
      updateScroll();
    });
    const currentRef = ref.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);
  return (
    <div
      ref={ref}
      className={`${className} whitespace-nowrap transition-transform ease-linear ${onHover ? "hover:animate-scroll" : "animate-scroll"}`}
      style={
        {
          animationDuration: scrollDuration,
          "--scroll-distance": scrollDistance,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
