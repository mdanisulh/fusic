"use client";
import NotFound from "@/app/not-found";
import SongCard from "@/components/cards/SongCard";
import IconButton from "@/components/common/IconButton";
import Router from "@/components/common/Router";
import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useQueue } from "@/lib/hooks/useQueue";
import { getAlbum } from "@/lib/services/albums";
import getAverageColor from "@/lib/utils/averageColor";
import { formatDuration } from "@/lib/utils/formatTime";
import Album from "@/types/album";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function AlbumPage({ params }: { params: { id: string } }) {
  const { albums, addAlbum, isAlbumInLibrary, removeAlbum } = useLibrary()!;
  const [album, setAlbum] = useState<Album | null>(null);
  const [color, setColor] = useState("");
  const [showHeader, setShowHeader] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { id, addToExtraQueue } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const { handleContextMenu } = useContextMenu()!;

  const menuList: MenuItem[] = [
    isAlbumInLibrary(params.id)
      ? {
          icon: "/assets/delete.svg",
          text: "Remove from Library",
          onClick: () => removeAlbum(params.id),
        }
      : {
          icon: "/assets/add.svg",
          text: "Add to Library",
          onClick: () => album && addAlbum(album),
        },
    {
      icon: "/assets/add-queue.svg",
      text: "Add to Queue",
      onClick: () => album && album.songs.map((song) => addToExtraQueue(song)),
    },
  ];

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!album) return;
    if (id === album.id) return togglePlay();
    if (album.songs) return setQueue(album.songs, album.id);
  };

  useEffect(() => {
    getAlbum(params.id).then((album) => {
      setAlbum(album);
    });
  }, [albums, isAlbumInLibrary, params.id]);
  useEffect(() => {
    if (!album) return;
    let gradientImage = album.image[1];
    if (!gradientImage && album.songs && album.songs.length)
      gradientImage = album.songs[0].image[1];
    if (!gradientImage) return;
    getAverageColor(gradientImage).then((color) => {
      setColor(color);
    });
  }, [album]);
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
  }, [ref, album]);

  if (!album) return null;
  if (!album.songs) return <NotFound />;
  const totalDuration = album.songs.reduce(
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
              isActive={id === album.id && isPlaying}
              iconSize={20}
              isWhite={false}
              onClick={handleClick}
            />
            <p className="my-auto line-clamp-1 truncate text-pretty px-3 text-2xl font-bold text-white">
              {album.name}
            </p>
          </div>
        )}
      </header>
      <div className="absolute top-0 h-72 w-full">
        <div className="absolute bottom-0 z-10 flex h-60 w-full p-5" ref={ref}>
          <div className="mr-5 mt-2 w-48 flex-shrink-0">
            <Image
              src={album.image[1] ?? album.songs[0].image[1]}
              alt=""
              width={192}
              height={192}
              className="rounded-lg"
            />
          </div>
          <div className="flex h-full flex-grow flex-col justify-evenly text-white">
            <div className="p-1 text-sm">Album</div>
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
              {album.name}
            </div>
            <div className="p-1 text-sm">{`${album.songs.length} songs, ${formatDuration(totalDuration)}`}</div>
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
            isActive={id === album.id && isPlaying}
            iconSize={20}
            isWhite={false}
            onClick={handleClick}
          />
          <IconButton
            className="mx-8 hover:scale-105"
            iconPath="/assets/more.svg"
            iconSize={30}
            isWhite={true}
            title={`More options for ${album.name}`}
            onClick={(e) => handleContextMenu(e, menuList)}
          />
        </div>
        <div className="sticky top-16 z-10 ml-3 mr-2 flex border-b-2 border-dark-grey bg-light-black py-2 text-sm text-light-grey">
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
        <div className="m-3 mr-2">
          {album.songs.map((song, index) => (
            <SongCard
              song={song}
              index={index}
              queueId={album.id}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
