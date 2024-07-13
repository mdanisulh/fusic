import { useAudio } from "@/lib/hooks/useAudio";
import { useQueue } from "@/lib/hooks/useQueue";
import { getArtistSongs } from "@/lib/services/artists";
import Artist from "@/types/artist";
import Image from "next/image";
import IconButton from "../common/IconButton";

export default function AlbumCard({
  artist,
}: {
  artist: Omit<Artist, "songs">;
}) {
  const { id } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const handleClick = async () => {
    if (id === artist.id) return togglePlay();
    const songs = await getArtistSongs(artist.id);
    setQueue(songs, artist.id);
  };
  return (
    <div className="group relative min-w-44 max-w-44 flex-1 cursor-pointer flex-row rounded-lg p-3 hover:bg-grey-dark">
      <Image
        width={152}
        height={152}
        style={{ objectFit: "cover" }}
        src={artist.image[1]}
        alt={artist.name}
        className="rounded-full"
        priority={true}
      />
      <IconButton
        className="absolute left-[120px] top-[120px] h-10 w-10 justify-center rounded-full bg-primary opacity-0 group-hover:opacity-100"
        iconPath="/assets/pause.svg"
        altIconPath="/assets/play.svg"
        isActive={id === artist.id && isPlaying}
        iconSize={16}
        isWhite={false}
        onClick={handleClick}
      />
      <div className="flex-col justify-between px-1 pt-2">
        <div className="truncate text-white">{artist.name}</div>
        <div className="truncate text-sm text-grey-light">Artist</div>
      </div>
    </div>
  );
}
