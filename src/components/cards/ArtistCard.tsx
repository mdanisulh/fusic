import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useQueue } from "@/lib/hooks/useQueue";
import { getArtistSongs } from "@/lib/services/artists";
import Artist from "@/types/artist";
import Image from "next/image";
import Link from "next/link";
import IconButton from "../common/IconButton";

export default function ArtistCard({
  artist,
  showOnlyImage = false,
}: {
  artist: Omit<Artist, "songs"> | Artist;
  showOnlyImage?: boolean;
}) {
  const { id } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const { handleContextMenu } = useContextMenu()!;
  const { isFollowingArtist, followArtist, unfollowArtist } = useLibrary()!;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (id === artist.id) return togglePlay();
    const songs = await getArtistSongs(artist.id);
    setQueue(songs, artist.id);
  };

  const menuList: MenuItem[] = [
    isFollowingArtist(artist.id)
      ? {
          icon: "/assets/close.svg",
          text: "Unfollow Artist",
          onClick: () => unfollowArtist(artist.id),
        }
      : {
          icon: "/assets/follow.svg",
          text: "Follow Artist",
          onClick: () => followArtist({ ...artist, songs: [] }),
        },
  ];
  return (
    <div className="max-w-[400px]">
      <Link href={`/artist/${artist.id}`}>
        <div
          className="group flex-1 -translate-x-1 cursor-pointer flex-row rounded-lg p-[7%] hover:bg-dark-grey"
          onContextMenu={(e) => {
            e.stopPropagation();
            handleContextMenu(e, menuList);
          }}
        >
          <div className="relative">
            <Image
              width={150}
              height={150}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
              src={artist.image[1]}
              className="rounded-full"
              priority={true}
              alt={artist.name}
            />
            {!showOnlyImage && (
              <IconButton
                className="absolute bottom-[5%] right-[5%] h-12 w-12 justify-center rounded-full bg-primary opacity-0 group-hover:opacity-100"
                iconPath="/assets/pause.svg"
                altIconPath="/assets/play.svg"
                isActive={id === artist.id && isPlaying}
                iconSize={20}
                isWhite={false}
                onClick={handleClick}
              />
            )}
          </div>
          {!showOnlyImage && (
            <div className="flex-col justify-between px-1 pt-2">
              <div className="truncate text-white">{artist.name}</div>
              <div className="truncate text-sm text-light-grey">Artist</div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
