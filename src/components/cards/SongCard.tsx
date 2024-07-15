import { useAudio } from "@/lib/hooks/useAudio";
import { useQueue } from "@/lib/hooks/useQueue";
import Song from "@/types/song";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import IconButton from "../common/IconButton";

export default function SongCard({ song }: { song: Song }) {
  const { setSong, isPlaying, song: currentSong, togglePlay } = useAudio()!;
  const { addToExtraQueue } = useQueue()!;
  const overlaySrc =
    isPlaying && song.id === currentSong.id
      ? "/assets/play.svg"
      : "/assets/pause.svg";
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
      className="group flex cursor-pointer truncate rounded-md p-2 hover:bg-grey"
      onContextMenu={handleRightClick}
    >
      <div
        className="group relative flex-shrink-0"
        style={{ width: "48px", height: "48px" }}
        onClick={() => {
          song.id === currentSong.id ? togglePlay() : setSong(song);
        }}
      >
        <Image
          src={song["image"][1]}
          alt={song["name"]}
          title={song["name"]}
          width={48}
          height={48}
          className="rounded-md group-hover:opacity-50"
          style={{ objectFit: "fill" }}
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
          {song["artists"].map((artist) => artist["name"]).join(", ")}
        </div>
      </div>
      <IconButton
        iconPath="/assets/more.svg"
        title={`More options for ${song["name"]}`}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100"
      />
      {showContextMenu && (
        <div className="absolute z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => addToExtraQueue(song)}
          >
            Add to Queue
          </button>
        </div>
      )}
    </div>
  );
}
