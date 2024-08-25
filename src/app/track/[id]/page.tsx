"use client";
import SongCard from "@/components/cards/SongCard";
import IconButton from "@/components/common/IconButton";
import Router from "@/components/common/Router";
import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useQueue } from "@/lib/hooks/useQueue";
import { getSong, getSongSuggestions } from "@/lib/services/songs";
import getAverageColor from "@/lib/utils/averageColor";
import { formatDuration } from "@/lib/utils/formatTime";
import Song from "@/types/song";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TrackPage({ params }: { params: { id: string } }) {
  const {
    isSongInPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    createPlaylist,
    playlists,
  } = useLibrary()!;
  const [song, setSong] = useState<Song | null>(null);
  const [color, setColor] = useState("");
  const { addToExtraQueue } = useQueue()!;
  const { handleContextMenu } = useContextMenu()!;
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const {
    isPlaying,
    togglePlay,
    setSong: setCurrentSong,
    song: currentSong,
  } = useAudio()!;

  useEffect(() => {
    const fetchSuggestions = async () => {
      const results = await getSongSuggestions(params.id);
      setSuggestions(results);
    };
    fetchSuggestions();
  }, [params.id]);

  const menuList: MenuItem[] = [
    {
      text: "Add to Playlist",
      onClick: (e: React.MouseEvent) => {
        const list: MenuItem[] = Object.entries(playlists).map(
          ([id, playlist]) => ({
            text: playlist.name,
            onClick: () => song && addToPlaylist(song, id),
          }),
        );
        list.unshift({
          icon: "/assets/add.svg",
          text: "New Playlist",
          onClick: () =>
            song &&
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
    song && isSongInPlaylist(song.id, "_liked")
      ? {
          text: "Remove from Liked Songs",
          onClick: () => removeFromPlaylist(song["id"], "_liked"),
          icon: "/assets/favourite-filled.svg",
        }
      : {
          text: "Add to Liked Songs",
          onClick: () => song && addToPlaylist(song, "_liked"),
          icon: "/assets/favourite-outlined.svg",
        },
    {
      text: "Add to Queue",
      onClick: () => song && addToExtraQueue(song),
      icon: "/assets/add-queue.svg",
    },
  ];

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!song) return;
    if (currentSong.id === song.id) togglePlay();
    else setCurrentSong(song);
  };

  useEffect(() => {
    getSong(params.id).then((song) => {
      setSong(song);
    });
  }, [params.id]);
  useEffect(() => {
    if (!song) return;
    let gradientImage = song.image[1];
    if (!gradientImage) return;
    getAverageColor(gradientImage).then((color) => {
      setColor(color);
    });
  }, [song]);

  if (!song) return null;
  return (
    <div className="relative h-full w-full overflow-y-scroll rounded-lg">
      <header
        className="sticky top-0 z-20 rounded-t-lg p-4"
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
              src={song.image[1]}
              alt=""
              width={192}
              height={192}
              className="rounded-lg"
              priority
            />
          </div>
          <div className="flex h-full flex-grow flex-col justify-evenly text-white">
            <div className="p-1 text-sm">Song</div>
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
              {song.name}
            </div>
            <div className="p-1 text-sm">
              <span>
                {song["artists"].reduce(
                  (acc: React.ReactNode[], artist, index) => {
                    acc.push(
                      <Link
                        key={artist.id}
                        href={`/artist/${artist.id}`}
                        className="hover:text-white hover:underline"
                      >
                        {artist.name}
                      </Link>,
                    );
                    if (index < song.artists.length - 1) {
                      acc.push(", ");
                    }
                    return acc;
                  },
                  [],
                )}
              </span>
              <span>
                <Link
                  href={`/album/${song.album?.id}`}
                  className="hover:underline"
                >
                  {` • ${song.album?.name}`}
                </Link>
              </span>
              <span>{song.year && ` • ${song.year}`}</span>
              <span>{` • ${formatDuration(song.duration)}`}</span>
              <span>
                {song.playCount && ` • ${song.playCount.toLocaleString()}`}
              </span>
            </div>
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
            isActive={currentSong.id === song.id && isPlaying}
            iconSize={20}
            isWhite={false}
            onClick={handleClick}
          />
          <IconButton
            iconPath="/assets/favourite-outlined.svg"
            altIconPath="/assets/favourite-filled.svg"
            isActive={isSongInPlaylist(song["id"], "_liked")}
            iconSize={40}
            className={`mx-4 my-auto ml-8 flex-shrink-0`}
            onClick={() =>
              isSongInPlaylist(song["id"], "_liked")
                ? removeFromPlaylist(song["id"], "_liked")
                : addToPlaylist(song, "_liked")
            }
          />
          <IconButton
            className="mx-4 hover:scale-105"
            iconPath="/assets/more.svg"
            iconSize={30}
            isWhite={true}
            title={`More options for ${song.name}`}
            onClick={(e) => handleContextMenu(e, menuList)}
          />
        </div>
        <div className="pl-3 pr-2">
          {suggestions.length > 0 && (
            <p className="p-3 text-lg font-bold text-white">Recommended</p>
          )}
          {suggestions.map((suggestion) => (
            <SongCard key={suggestion.id} song={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
}
