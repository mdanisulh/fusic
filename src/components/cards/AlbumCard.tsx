import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useQueue } from "@/lib/hooks/useQueue";
import { getAlbum } from "@/lib/services/albums";
import Album from "@/types/album";
import Image from "next/image";
import Link from "next/link";
import IconButton from "../common/IconButton";

export default function AlbumCard({
  album,
  showOnlyImage = false,
}: {
  album: Omit<Album, "songs"> | Album;
  showOnlyImage?: boolean;
}) {
  const { id, addToExtraQueue } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const { handleContextMenu } = useContextMenu()!;
  const { isAlbumInLibrary, addAlbum, removeAlbum } = useLibrary()!;
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (id === album.id) return togglePlay();
    const newAlbum = await getAlbum(album.id);
    if (newAlbum) setQueue(newAlbum.songs, album.id);
  };
  const menuList: MenuItem[] = [
    isAlbumInLibrary(album.id)
      ? {
          icon: "/assets/delete.svg",
          text: "Remove from Library",
          onClick: () => removeAlbum(album.id),
        }
      : {
          icon: "/assets/add.svg",
          text: "Add to Library",
          onClick: () => {
            if ("songs" in album) return addAlbum(album);
            getAlbum(album.id).then((album) => addAlbum(album));
          },
        },
    {
      icon: "/assets/add-queue.svg",
      text: "Add to Queue",
      onClick: () => {
        if ("songs" in album && album.songs)
          album.songs.map((song) => addToExtraQueue(song));
        else
          getAlbum(album.id).then((album) =>
            album.songs.map((song) => addToExtraQueue(song)),
          );
      },
    },
  ];
  return (
    <div className="max-w-100">
      <Link href={`/album/${album.id}`}>
        <div
          className="group flex-1 cursor-pointer flex-row rounded-lg p-[7%] hover:bg-dark-grey"
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
              src={album.image[1]}
              className="rounded-lg"
              priority={true}
              alt={album.name}
            />
            {!showOnlyImage && (
              <IconButton
                className="absolute right-[5%] bottom-[5%] h-12 w-12 justify-center rounded-full bg-primary opacity-0 group-hover:opacity-100"
                iconPath="/assets/pause.svg"
                altIconPath="/assets/play.svg"
                isActive={id === album.id && isPlaying}
                iconSize={20}
                isWhite={false}
                onClick={handleClick}
              />
            )}
          </div>
          {!showOnlyImage && (
            <>
              <div className="truncate text-white">{album.name}</div>
              <div className="truncate text-sm text-light-grey">
                <span>Album</span>
                <span className="text-lg font-black"> · </span>
                <span>{album.artists.map((artist) => artist.name)}</span>
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
