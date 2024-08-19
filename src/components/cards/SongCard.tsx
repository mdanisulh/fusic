import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useQueue } from "@/lib/hooks/useQueue";
import Song from "@/types/song";
import Image from "next/image";
import React from "react";
import formatTime from "../../lib/utils/formatTime";
import IconButton from "../common/IconButton";

export default function SongCard({
  song,
  index,
  playlistId,
}: {
  song: Song;
  index?: number;
  playlistId?: string;
}) {
  const { setSong, isPlaying, song: currentSong, togglePlay } = useAudio()!;
  const { handleContextMenu } = useContextMenu()!;
  const { id: pId, addToExtraQueue } = useQueue()!;
  const {
    playlists,
    isSongInPlaylist,
    createPlaylist,
    addToPlaylist,
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
  if (
    playlistId &&
    playlistId != "_liked" &&
    isSongInPlaylist(song.id, playlistId)
  ) {
    menuList.splice(1, 0, {
      text: "Remove from Playlist",
      onClick: () => removeFromPlaylist(song.id, playlistId),
      icon: "/assets/delete.svg",
    });
  }

  const overlaySrc =
    isPlaying && song.id === currentSong.id
      ? "/assets/play.svg"
      : "/assets/pause.svg";
  return (
    <div
      className="group flex h-14 rounded-md p-2 px-2 hover:bg-grey"
      onContextMenu={(e) => handleContextMenu(e, menuList)}
      style={{
        backgroundColor:
          playlistId === pId && song.id === currentSong.id
            ? "rgba(138,32,240,0.3)"
            : "",
      }}
    >
      {index == undefined && (
        <div
          className="group relative mr-2 flex-shrink-0"
          style={{ width: "40px", height: "40px" }}
          onClick={() => {
            song.id === currentSong.id ? togglePlay() : setSong(song);
          }}
        >
          <Image
            src={song["image"][1]}
            alt={song["name"]}
            title={song["name"]}
            width={40}
            height={40}
            className="rounded-md group-hover:opacity-50"
            style={{ objectFit: "fill" }}
            priority={true}
          />
          <Image
            src={overlaySrc}
            alt="Overlay"
            width={16}
            height={16}
            className="absolute left-3 top-3 rounded-md opacity-0 invert group-hover:opacity-100"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      {index != undefined && (
        <>
          <div className="my-auto w-8 pl-2 text-center text-sm text-light-grey group-hover:hidden">
            {index + 1}
          </div>
          <div
            className="my-auto hidden w-8 pl-2 group-hover:block"
            onClick={() =>
              song.id === currentSong.id ? togglePlay() : setSong(song)
            }
          >
            <Image
              src={overlaySrc}
              alt="Overlay"
              width={16}
              height={16}
              className="m-auto rounded-md opacity-0 invert group-hover:opacity-100"
              style={{ objectFit: "cover" }}
            />
          </div>
          <Image
            src={song["image"][1]}
            alt={song["name"]}
            title={song["name"]}
            width={40}
            height={40}
            className="mx-4 rounded-md"
            style={{ objectFit: "cover" }}
            priority={true}
          />
        </>
      )}
      <div className="flex h-full flex-1 truncate">
        <div className="flex flex-col truncate pr-4">
          <div className="mb-1 flex-shrink truncate text-sm text-white">
            {song["name"]}
          </div>
          <div className="truncate text-sm text-light-grey">
            {song["artists"].map((artist) => artist["name"]).join(", ")}
          </div>
        </div>
      </div>
      {index !== undefined && (
        <>
          <div className="my-auto flex-1 truncate pr-4 text-sm text-light-grey">
            {song.album?.name}
          </div>
          <IconButton
            iconPath="/assets/favourite-outlined.svg"
            altIconPath="/assets/favourite-filled.svg"
            isActive={isSongInPlaylist(song["id"], "_liked")}
            iconSize={24}
            className="my-auto mr-2 flex-shrink-0 opacity-0 group-hover:opacity-100"
            onClick={() =>
              isSongInPlaylist(song["id"], "_liked")
                ? removeFromPlaylist(song["id"], "_liked")
                : addToPlaylist(song, "_liked")
            }
          />
        </>
      )}
      <div className="my-auto w-8 flex-shrink-0 text-center text-sm text-light-grey">
        {formatTime(song["duration"])}
      </div>
      <IconButton
        iconPath="/assets/more.svg"
        iconSize={22}
        title={`More options for ${song["name"]}`}
        className="flex-shrink-0 pl-2 opacity-0 group-hover:opacity-100"
        onClick={(e) => handleContextMenu(e, menuList)}
      />
    </div>
  );
}
