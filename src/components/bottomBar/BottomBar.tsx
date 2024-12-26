"use client";
import { useAudio } from "@/lib/hooks/useAudio";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import IconButton from "../common/IconButton";
import ScrollableDiv from "../common/ScrollableDiv";
import PlayerControls from "./PlayerControls";
import VolumeBar from "./VolumeBar";

export default function BottomBar() {
  const { song } = useAudio()!;
  const { rsbView, setRSBView } = useUIConfig()!;
  const {
    isSongInPlaylist: searchInPlaylist,
    addToPlaylist,
    removeFromPlaylist,
  } = useLibrary()!;
  const path = usePathname();
  const router = useRouter();
  return (
    <div className="z-50 flex h-20 w-full p-2 pt-0">
      <div className="flex flex-[3_0_0%] truncate">
        <Image
          src={song["image"][1]}
          alt={song["name"]}
          title={song["name"]}
          width={56}
          height={56}
          className="current-song-img m-2 rounded-md"
          style={{ height: "56px", width: "56px", objectFit: "fill" }}
          priority={true}
        />
        <div className="flex-col content-center truncate p-2 align-text-bottom">
          <ScrollableDiv className="truncate text-white">
            <Link href={`/track/${song.id}`} className="hover:underline">
              {song["name"]}
            </Link>
          </ScrollableDiv>
          <ScrollableDiv className="text-xs text-light-grey" onHover={false}>
            {song.artists.reduce((acc: React.ReactNode[], artist, index) => {
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
            }, [])}
          </ScrollableDiv>
        </div>
        <IconButton
          iconPath="/assets/favourite-outlined.svg"
          altIconPath="/assets/favourite-filled.svg"
          isActive={searchInPlaylist(song["id"], "_liked")}
          iconSize={24}
          className="mx-2 mb-2 flex-shrink-0"
          onClick={() =>
            searchInPlaylist(song["id"], "_liked")
              ? removeFromPlaylist(song["id"], "_liked")
              : addToPlaylist(song, "_liked")
          }
        />
      </div>
      <div className="flex flex-[4_1_0%]">
        <PlayerControls />
      </div>
      <div className="flex flex-[3_0_0%] justify-end">
        <IconButton
          iconPath="/assets/now-playing.svg"
          altIconPath="dot"
          iconSize={16}
          className="m-2 h-8 self-center"
          title="Now Playing"
          isActive={rsbView === "nowPlaying"}
          onClick={() =>
            rsbView === "nowPlaying"
              ? setRSBView("none")
              : setRSBView("nowPlaying")
          }
        />
        <IconButton
          iconPath="/assets/lyrics.svg"
          altIconPath="dot"
          iconSize={16}
          className="m-2 h-8 self-center"
          title="Lyrics"
          isActive={path === "/lyrics"}
          onClick={() =>
            path === "/lyrics" ? router.back() : router.push("/lyrics")
          }
        />
        <IconButton
          iconPath="/assets/queue.svg"
          altIconPath="dot"
          iconSize={16}
          className="m-2 h-8 self-center"
          title="Queue"
          isActive={rsbView === "queue"}
          onClick={() =>
            rsbView === "queue" ? setRSBView("none") : setRSBView("queue")
          }
        />
        <VolumeBar />
      </div>
    </div>
  );
}
