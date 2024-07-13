import Song from "@/types/song";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import IconButton from "../common/IconButton";

export default function QueueCard({
  isPlaying,
  togglePlay,
  setCurrentIndex,
  removeFromExtraQueue,
  shuffleIndices,
  setSong,
  addToExtraQueue,
  song,
  index,
  isNowPlaying = false,
  isInQueue = -1,
}: {
  isPlaying: boolean;
  togglePlay: () => void;
  setCurrentIndex: (index: number) => void;
  removeFromExtraQueue: (index: number) => void;
  shuffleIndices: number[];
  setSong: (song: Song) => void;
  addToExtraQueue: (song: Song) => void;
  song: Song;
  index: number;
  isNowPlaying?: boolean;
  isInQueue?: number;
}) {
  const overlaySrc =
    isPlaying && isNowPlaying ? "/assets/play.svg" : "/assets/pause.svg";
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  useEffect(() => {
    if (showContextMenu) {
      window.addEventListener("click", handleCloseContextMenu);
    }
    return () => {
      window.removeEventListener("click", handleCloseContextMenu);
    };
  }, [showContextMenu]);
  return (
    <div
      className="group flex cursor-pointer truncate rounded-md p-2 hover:bg-grey-dark"
      onContextMenu={handleRightClick}
    >
      <div
        className="group relative flex-shrink-0"
        style={{ width: "48px", height: "48px" }}
        onClick={() => {
          setCurrentIndex(shuffleIndices.indexOf(index));
          isNowPlaying ? togglePlay() : setSong(song);
          isInQueue !== -1 && removeFromExtraQueue(isInQueue);
        }}
      >
        <Image
          src={song["image"][1]}
          alt={song["name"]}
          title={song["name"]}
          width={48}
          height={48}
          className="rounded-md group-hover:opacity-50"
          style={{ objectFit: "cover" }}
          priority={true}
        />
        <Image
          src={overlaySrc}
          alt="Overlay"
          width={16}
          height={16}
          className="absolute left-4 top-4 rounded-md opacity-0 invert group-hover:opacity-100"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex-grow flex-col truncate px-3">
        <div className="my-1 flex-shrink truncate text-sm text-white">
          {song["name"]}
        </div>
        <div className="truncate text-sm text-grey-light">
          {song["artists"][0]["name"]}
        </div>
      </div>
      <IconButton
        iconPath="/assets/more.svg"
        title={`More options for ${song["name"]}`}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100"
      />
      {showContextMenu && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => addToExtraQueue(song)}
          >
            Add to Queue
          </button>
          {isInQueue !== -1 && (
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => removeFromExtraQueue(isInQueue)}
            >
              Remove from Queue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
