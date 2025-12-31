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
import React, { useEffect, useRef, useState, use } from "react";

export default function PlaylistPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const {
    playlists,
    isPlaylistInLibrary,
    deletePlaylist,
    createPlaylist,
    addToPlaylist,
  } = useLibrary()!;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [color, setColor] = useState("");
  const [showHeader, setShowHeader] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
    {
      icon: "/assets/add.svg",
      text: "Add all songs to playlist",
      onClick: (e: React.MouseEvent) => {
        const list: MenuItem[] = Object.entries(playlists).map(([id, _]) => ({
          text: _?.name ?? "Playlist",
          onClick: () =>
            playlist &&
            playlist.songs.forEach((song) => addToPlaylist(song, id)),
        }));
        list.unshift({
          icon: "/assets/add.svg",
          text: "New Playlist",
          onClick: () =>
            createPlaylist({
              id: crypto.randomUUID(),
              name: playlist?.name ?? "",
              songs: playlist?.songs ?? [],
              artists: [],
              image: [],
            }),
        });
        handleContextMenu(e, list);
      },
    },
    {
      icon: "/assets/share.svg",
      text: "Export Playlist",
      onClick: () => {
        if (!playlist) return;
        const data = new Blob(
          [
            JSON.stringify({
              name: playlist.name,
              image: playlist.image,
              songIds: playlist.songs.map((song) => song.id),
            }),
          ],
          {
            type: "application/json",
          },
        );
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${playlist.name}.fusic`;
        a.click();
        URL.revokeObjectURL(url);
      },
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
  useEffect(() => {
    const div = ref.current;
    if (!div) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowHeader(!entry.isIntersecting);
      },
      { threshold: [0.7] },
    );
    observer.observe(div);
    return () => {
      observer.disconnect();
    };
  }, [ref, playlist]);

  if (!playlist) return <div>Loading...</div>;
  const totalDuration = playlist.songs.reduce(
    (acc, song) => acc + song.duration,
    0,
  );
  return (
    <div className="relative h-full w-full overflow-y-scroll rounded-lg">
      <header
        className="sticky top-0 z-20 flex rounded-t-lg"
        style={{
          backgroundColor: color,
          backgroundImage: `linear-gradient(transparent 0, rgba(18,18,18,0.1) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
        }}
      >
        <div className="p-4 pr-0">
          <Router />
        </div>
        {showHeader && (
          <div className="flex truncate pl-4">
            <IconButton
              className="my-auto h-14 w-14 justify-center rounded-full bg-primary hover:scale-105"
              iconPath="/assets/pause.svg"
              altIconPath="/assets/play.svg"
              isActive={id === playlist.id && isPlaying}
              iconSize={20}
              isWhite={false}
              onClick={handleClick}
            />
            <p className="my-auto line-clamp-1 truncate px-3 text-2xl font-bold text-pretty text-white">
              {playlist.name}
            </p>
          </div>
        )}
      </header>
      <div className="absolute top-0 h-72 w-full">
        <div className="absolute bottom-0 z-10 flex h-60 w-full p-5" ref={ref}>
          <div className="mt-2 mr-5 w-48 shrink-0">
            <PlaylistImage playlist={playlist} />
          </div>
          <div className="flex h-full grow flex-col justify-evenly text-white">
            <div className="p-1 text-sm">Playlist</div>
            <div
              className="overflow-hidden p-1 text-5xl font-black text-pretty"
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
        <div className="sticky top-16 z-10 mr-2 ml-3 flex border-b-2 border-dark-grey bg-light-black py-2 text-sm text-light-grey">
          <div className="w-8 shrink-0 text-end">#</div>
          <div className="mx-6 flex-1">Title</div>
          <div className="mx-6 flex-1">Album</div>
          <div className="m-auto w-20 shrink-0 pr-8">
            <Image
              src="/assets/duration.svg"
              alt=""
              width={16}
              height={16}
              className="m-auto invert-[0.7]"
            />
          </div>
        </div>
        <div className="mt-3 mr-2 ml-3">
          {playlist.songs.map((song, index) => (
            <SongCard
              song={song}
              index={index}
              queueId={playlist.id}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
