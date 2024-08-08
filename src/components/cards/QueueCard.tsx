import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import Song from "@/types/song";
import Image from "next/image";
import React from "react";
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
  const { handleContextMenu } = useContextMenu()!;
  const {
    playlists,
    addToPlaylist,
    createPlaylist,
    isSongInPlaylist,
    removeFromPlaylist,
  } = useLibrary()!;
  const menuList = [
    {
      text: "Add to Playlist",
      onClick: (e: React.MouseEvent) => {
        const list: MenuItem[] = Object.entries(playlists).map(
          ([id, playlist]) => ({
            text: playlist.name,
            onClick: () => addToPlaylist(song, id),
          }),
        );
        list.unshift({
          icon: "/assets/add.svg",
          text: "New Playlist",
          onClick: () =>
            createPlaylist({
              id: crypto.randomUUID(),
              name: song.name,
              songs: [song],
              artists: [song.artists[0]],
              image: [],
            }),
        });
        handleContextMenu(e, list);
      },
      icon: "/assets/add.svg",
    },
    isSongInPlaylist(song.id, "_liked")
      ? {
          text: "Remove from Liked Songs",
          onClick: () => removeFromPlaylist(song["id"], "_liked"),
          icon: "/assets/favourite-filled.svg",
        }
      : {
          text: "Add to Liked Songs",
          onClick: () => addToPlaylist(song, "_liked"),
          icon: "/assets/favourite-outlined.svg",
        },
    {
      text: "Add to Queue",
      onClick: () => addToExtraQueue(song),
      icon: "/assets/add-queue.svg",
    },
  ];
  if (isInQueue !== -1) {
    menuList.push({
      text: "Remove from Queue",
      onClick: () => removeFromExtraQueue(isInQueue),
      icon: "/assets/delete.svg",
    });
  }
  return (
    <div
      className="group relative flex cursor-pointer truncate rounded-md p-2 hover:bg-dark-grey"
      onContextMenu={(e) => handleContextMenu(e, menuList)}
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
        <div className="truncate text-sm text-light-grey">
          {song["artists"][0]["name"]}
        </div>
      </div>
      <IconButton
        iconPath="/assets/more.svg"
        title={`More options for ${song["name"]}`}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100"
        onClick={(e) => handleContextMenu(e, menuList)}
      />
    </div>
  );
}
