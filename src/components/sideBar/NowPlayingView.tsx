import { useAudio } from "@/lib/hooks/useAudio";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import Song from "@/types/song";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSongSuggestions } from "../../lib/services/songs";
import SongCard from "../cards/SongCard";
import IconButton from "../common/IconButton";
import ScrollableDiv from "../common/ScrollableDiv";

export default function NowPlayingView() {
  const { song } = useAudio()!;
  const { setRSBView } = useUIConfig()!;
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const { isSongInPlaylist, addToPlaylist, removeFromPlaylist } = useLibrary()!;

  useEffect(() => {
    const fetchSuggestions = async () => {
      const results = await getSongSuggestions(song.id);
      setSuggestions(results);
    };
    fetchSuggestions();
  }, [song.id]);

  return (
    <div className="flex h-full flex-col rounded-lg bg-light-black">
      <div className="sticky top-0 flex justify-between">
        <p
          className="my-1 truncate p-4 font-bold text-white"
          title={song["name"]}
        >
          {song["name"]}
        </p>
        <div className="flex flex-shrink-0">
          <IconButton
            iconPath="/assets/more.svg"
            iconSize={24}
            title={`More options for ${song["name"]}`}
          />
          <IconButton
            iconPath="/assets/close.svg"
            title="Close"
            className="m-4 ml-1 rounded-full p-2 font-bold hover:bg-dark-grey"
            iconSize={16}
            onClick={() => setRSBView("none")}
          />
        </div>
      </div>
      <div className="overflow-y-hidden p-3 pt-0 hover:overflow-y-scroll hover:pr-2">
        <div className="px-1">
          <Image
            src={song["image"][2]}
            alt={song["name"]}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            className="rounded-lg"
            width={200}
            height={200}
          />
        </div>
        <div className="flex justify-between px-1 py-4">
          <div className="flex flex-col truncate">
            <ScrollableDiv className="truncate text-2xl font-bold text-white">
              <Link href={`/track/${song.id}`} className="hover:underline">
                {song["name"]}
              </Link>
            </ScrollableDiv>
            <ScrollableDiv
              className="truncate text-sm text-light-grey"
              onHover={false}
            >
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
            </ScrollableDiv>
          </div>
          <IconButton
            iconPath="/assets/favourite-outlined.svg"
            altIconPath="/assets/favourite-filled.svg"
            isActive={isSongInPlaylist(song["id"], "_liked")}
            iconSize={24}
            className="mx-2 mb-2 flex-shrink-0"
            onClick={() =>
              isSongInPlaylist(song["id"], "_liked")
                ? removeFromPlaylist(song["id"], "_liked")
                : addToPlaylist(song, "_liked")
            }
          />
        </div>
        <div>
          {suggestions.length > 0 && (
            <p className="p-2 text-lg font-bold text-white">Recommended</p>
          )}
          {suggestions.map((suggestion) => (
            <SongCard key={suggestion.id} song={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
}
