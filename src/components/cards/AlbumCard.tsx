import { useAudio } from "@/lib/hooks/useAudio";
import { useQueue } from "@/lib/hooks/useQueue";
import { getAlbum } from "@/lib/services/albums";
import Album from "@/types/album";
import Image from "next/image";
import IconButton from "../common/IconButton";

export default function AlbumCard({ album }: { album: Omit<Album, "songs"> }) {
  const { id } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const handleClick = async () => {
    if (id === album.id) return togglePlay();
    const newAlbum = await getAlbum(album.id);
    setQueue(newAlbum.songs, album.id);
  };
  return (
    <div className="hover:bg-dark-grey group relative min-w-44 max-w-44 flex-1 cursor-pointer flex-row rounded-lg p-3">
      <Image
        width={152}
        height={152}
        style={{ objectFit: "cover" }}
        src={album.image[1]}
        alt={album.name}
        className="rounded-lg"
        priority={true}
      />
      <IconButton
        className="absolute left-[120px] top-[120px] h-10 w-10 justify-center rounded-full bg-primary opacity-0 group-hover:opacity-100"
        iconPath="/assets/pause.svg"
        altIconPath="/assets/play.svg"
        isActive={id === album.id && isPlaying}
        iconSize={16}
        isWhite={false}
        onClick={handleClick}
      />
      <div className="flex-col justify-between px-1 pt-2">
        <div className="truncate text-white">{album.name}</div>
        <div className="text-light-grey truncate text-sm">
          <span>{album.year}</span>
          <span className="text-lg font-black"> · </span>
          <span>{album.artists.map((artist) => artist.name)}</span>
        </div>
      </div>
    </div>
  );
}
