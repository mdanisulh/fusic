"use client";
import SongCard from "@/components/cards/SongCard";
import Router from "@/components/common/Router";
import { useAudio } from "@/lib/hooks/useAudio";
import { useHistory } from "@/lib/hooks/useHistory";
import getAverageColor from "@/lib/utils/averageColor";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import IconButton from "../components/common/IconButton";

export default function Home() {
  const { last100 } = useHistory()!;
  const recentlyPlayed = last100.slice(0, 8);
  const [color, setColor] = useState("");
  const { song } = useAudio()!;
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [numColumns, setNumColumns] = useState(8);

  useEffect(() => {
    const calculateColumns = () => {
      if (gridRef.current && cardRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        const cardWidth = cardRef.current.offsetWidth;
        const maxColumns = Math.floor(gridWidth / cardWidth);
        const columns =
          recentlyPlayed.length - (recentlyPlayed.length % maxColumns);
        setNumColumns(columns);
      }
    };
    calculateColumns();
    const resizeObserver = new ResizeObserver(() => {
      calculateColumns();
    });
    const currentGridRef = gridRef.current;
    if (currentGridRef) {
      resizeObserver.observe(currentGridRef);
    }
    return () => {
      if (currentGridRef) {
        resizeObserver.unobserve(currentGridRef);
      }
    };
  }, [recentlyPlayed]);

  useEffect(() => {
    if (!song) return;
    let gradientImage = song.image[1];
    if (!gradientImage) return;
    getAverageColor(gradientImage).then((color) => {
      setColor(color);
    });
  }, [song]);

  return (
    <div
      className="relative h-full w-full overflow-y-scroll rounded-lg"
      ref={gridRef}
    >
      <header
        className="sticky top-0 z-20 flex rounded-t-lg"
        style={{
          backgroundColor: color,
          backgroundImage: `linear-gradient(rgba(18,18,18,0.1) 0, rgba(18,18,18,0.375) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
        }}
      >
        <div className="p-4 pr-0">
          <Router />
        </div>
      </header>
      <div className="absolute top-0 h-96 w-full">
        <div
          style={{
            backgroundColor: color,
            backgroundImage: `linear-gradient(rgba(18,18,18,0.25) 0, rgb(18,18,18) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
          }}
          className="h-full w-full"
        />
      </div>
      {recentlyPlayed.length > 0 && (
        <div className="relative px-4">
          <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
            Recently Played
          </div>
          <Link href="/history">
            <IconButton
              iconPath="/assets/next.svg"
              iconSize={16}
              className="absolute right-0 top-0 m-4 h-8 w-8 justify-center self-center rounded-full bg-dark-grey"
            />
          </Link>
          <div
            className="grid gap-4 py-4"
            style={{
              scrollbarWidth: "none",
              gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
            }}
          >
            {recentlyPlayed.slice(0, numColumns).map((song, index) => (
              <div
                key={song.id}
                ref={index == 0 ? cardRef : null}
                className="w-full rounded-lg bg-white bg-opacity-10"
              >
                <SongCard song={song} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
