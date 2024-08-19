"use client";
import AlbumCard from "@/components/cards/AlbumCard";
import SongCard from "@/components/cards/SongCard";
import IconButton from "@/components/common/IconButton";
import Router from "@/components/common/Router";
import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useQueue } from "@/lib/hooks/useQueue";
import { getArtist } from "@/lib/services/artists";
import getAverageColor from "@/lib/utils/averageColor";
import { formatDuration } from "@/lib/utils/formatTime";
import Artist from "@/types/artist";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ArtistPage({ params }: { params: { id: string } }) {
  const { artists, isFollowingArtist, followArtist, unfollowArtist } =
    useLibrary()!;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [color, setColor] = useState("");
  const { id, addToExtraQueue } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const { handleContextMenu } = useContextMenu()!;

  const menuList: MenuItem[] = [
    isFollowingArtist(params.id)
      ? {
          icon: "/assets/delete.svg",
          text: "Remove from Library",
          onClick: () => unfollowArtist(params.id),
        }
      : {
          icon: "/assets/add.svg",
          text: "Add to Library",
          onClick: () => artist && followArtist(artist),
        },
    {
      icon: "/assets/add-queue.svg",
      text: "Add to Queue",
      onClick: () =>
        artist && artist.songs.map((song) => addToExtraQueue(song)),
    },
  ];
  if (params.id === "_liked") {
    menuList.shift();
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!artist) return;
    if (id === artist.id) return togglePlay();
    if (artist.songs) return setQueue(artist.songs, artist.id);
  };

  useEffect(() => {
    getArtist(params.id, 0, 999, 999).then((artist) => {
      if (!artist) return;
      setArtist(artist);
    });
  }, [isFollowingArtist, params.id, artists]);
  useEffect(() => {
    if (!artist) return;
    let gradientImage = artist.image[1];
    if (!gradientImage && artist.songs.length)
      gradientImage = artist.songs[0].image[1];
    if (!gradientImage) return;
    getAverageColor(gradientImage).then((color) => {
      setColor(color);
    });
  }, [artist]);

  if (!artist) return <div>Loading...</div>;
  const totalDuration = artist.songs.reduce(
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
            <Image
              src={artist.image[1]}
              alt=""
              width={192}
              height={192}
              className="rounded-full"
            />
          </div>
          <div className="flex h-full flex-grow flex-col justify-evenly text-white">
            <div className="p-1 text-sm">Artist</div>
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
              {artist.name}
            </div>
            <div className="p-1 text-sm">{`${artist.songs.length} songs, ${formatDuration(totalDuration)}`}</div>
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
            isActive={id === artist.id && isPlaying}
            iconSize={20}
            isWhite={false}
            onClick={handleClick}
          />
          <IconButton
            className="mx-8 hover:scale-105"
            iconPath="/assets/more.svg"
            iconSize={30}
            isWhite={true}
            title={`More options for ${artist.name}`}
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
          {artist.songs.map((song, index) => (
            <SongCard
              song={song}
              index={index}
              queueId={artist.id}
              key={index}
            />
          ))}
        </div>
        {artist.albums.length > 0 && (
          <div className="pl-10 pt-10 text-2xl font-bold text-white">
            {`Albums by ${artist.name}`}
          </div>
        )}
        <div
          className="m-3 ml-6 flex flex-row overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {artist.albums.map((album, index) => (
            <div key={index} className="min-w-48 max-w-48 translate-x-1">
              <AlbumCard album={album} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
