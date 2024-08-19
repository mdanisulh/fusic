"use client";
import SongCard from "@/components/cards/SongCard";
import IconButton from "@/components/common/IconButton";
import PlaylistImage from "@/components/common/PlaylistImage";
import Router from "@/components/common/Router";
import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useQueue } from "@/lib/hooks/useQueue";
import { getPlaylist } from "@/lib/services/playlists";
import getAverageColor from "@/lib/utils/averageColor";
import { formatDuration } from "@/lib/utils/formatTime";
import Playlist from "@/types/playlist";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const { playlists, isPlaylistInLibrary, deletePlaylist, createPlaylist } =
    useLibrary()!;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [color, setColor] = useState("");
  const { id, addToExtraQueue } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const { handleContextMenu } = useContextMenu()!;

  const menuList: MenuItem[] = [
    isPlaylistInLibrary(params.id)
      ? {
          icon: "/assets/delete.svg",
          text: "Remove from Library",
          onClick: () => deletePlaylist(params.id),
        }
      : {
          icon: "/assets/add.svg",
          text: "Add to Library",
          onClick: () => playlist && createPlaylist(playlist),
        },
    {
      icon: "/assets/add-queue.svg",
      text: "Add to Queue",
      onClick: () =>
        playlist && playlist.songs.map((song) => addToExtraQueue(song)),
    },
  ];
  if (params.id === "_liked") {
    menuList.shift();
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playlist) return;
    if (id === playlist.id) return togglePlay();
    if (playlist.songs) return setQueue(playlist.songs, playlist.id);
  };

  useEffect(() => {
    if (isPlaylistInLibrary(params.id)) {
      setPlaylist(playlists[params.id]);
    } else {
      getPlaylist(params.id).then((playlist) => {
        setPlaylist(playlist);
      });
    }
  }, [isPlaylistInLibrary, params.id, playlists]);
  useEffect(() => {
    if (!playlist) return;
    let gradientImage = playlist.image[1];
    if (!gradientImage && playlist.songs.length)
      gradientImage = playlist.songs[0].image[1];
    if (!gradientImage) return;
    getAverageColor(gradientImage).then((color) => {
      setColor(color);
    });
  }, [playlist]);

  if (!playlist) return <div>Loading...</div>;
  const totalDuration = playlist.songs.reduce(
    (acc, song) => acc + song.duration,
    0,
  );
  return (
    <div className="relative h-full w-full overflow-y-scroll">
      <header
        className="sticky top-0 z-20 p-4"
        style={{
          backgroundColor: color,
          opacity: 1,
          backgroundImage: `linear-gradient(transparent 0, rgba(18,18,18,0.1) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
        }}
      >
        <Router />
      </header>
      <div className="absolute top-0 h-72 w-full">
        <div className="absolute bottom-0 z-10 flex h-60 w-full p-5">
          <div className="mr-5 mt-2 w-48 flex-shrink-0">
            <PlaylistImage playlist={playlist} />
          </div>
          <div className="flex h-full flex-grow flex-col justify-evenly text-white">
            <div className="p-1 text-sm">Playlist</div>
            <div
              className="overflow-hidden text-pretty p-1 text-5xl font-black"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineClamp: 2,
                boxOrient: "vertical",
              }}
            >
              {playlist.name}
            </div>
            <div className="p-1 text-sm">{`${playlist.songs.length} songs, ${formatDuration(totalDuration)}`}</div>
          </div>
        </div>
        <div
          className="h-full w-full"
          style={{
            backgroundColor: color,
            backgroundImage: `linear-gradient(transparent 0, rgba(18,18,18,0.45) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
          }}
        />
        <div
          style={{
            backgroundColor: color,
            backgroundImage: `linear-gradient(rgba(18,18,18,0.55) 0, rgb(18,18,18) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
          }}
          className="h-32 w-full"
        />
      </div>
      <div className="absolute top-72 w-full">
        <div className="flex h-32 px-5 py-9">
          <IconButton
            className="h-14 w-14 justify-center rounded-full bg-primary hover:scale-105"
            iconPath="/assets/pause.svg"
            altIconPath="/assets/play.svg"
            isActive={id === playlist.id && isPlaying}
            iconSize={20}
            isWhite={false}
            onClick={handleClick}
          />
          <IconButton
            className="mx-8 hover:scale-105"
            iconPath="/assets/more.svg"
            iconSize={30}
            isWhite={true}
            title={`More options for ${playlist.name}`}
            onClick={(e) => handleContextMenu(e, menuList)}
          />
        </div>
        <div className="sticky top-16 z-10 ml-6 mr-3 flex border-b-2 border-dark-grey bg-light-black py-2 text-sm text-light-grey">
          <div className="w-8 flex-shrink-0 text-end">#</div>
          <div className="mx-6 flex-1">Title</div>
          <div className="mx-6 flex-1">Album</div>
          <div className="m-auto w-20 flex-shrink-0 pr-8">
            <Image
              src="/assets/duration.svg"
              alt=""
              width={16}
              height={16}
              className="m-auto invert-[0.7]"
            />
          </div>
        </div>
        <div className="m-3 ml-6">
          {playlist.songs.map((song, index) => (
            <SongCard
              song={song}
              index={index}
              playlistId={playlist.id}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
