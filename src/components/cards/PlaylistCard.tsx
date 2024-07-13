import { useAudio } from "@/lib/hooks/useAudio";
import { useQueue } from "@/lib/hooks/useQueue";
import { getPlaylist } from "@/lib/services/playlists";
import Playlist from "@/types/playlist";
import Image from "next/image";
import IconButton from "../common/IconButton";

export default function AlbumCard({
  playlist,
}: {
  playlist: Omit<Playlist, "songs">;
}) {
  const { id, updateQueue } = useQueue()!;
  const { isPlaying, togglePlay } = useAudio()!;
  const handleClick = async () => {
    if (id === playlist.id) return togglePlay();
    const songs = await getPlaylist(playlist.id);
    updateQueue(songs.songs, playlist.id);
  };
  return (
    <div className="group relative min-w-44 max-w-44 flex-1 cursor-pointer flex-row rounded-lg p-3 hover:bg-grey-dark">
      <Image
        width={152}
        height={152}
        style={{ objectFit: "cover" }}
        src={playlist.image[1]}
        alt={playlist.name}
        className="rounded-lg"
        priority={true}
      />
      <IconButton
        className="absolute left-[120px] top-[120px] h-10 w-10 justify-center rounded-full bg-primary opacity-0 group-hover:opacity-100"
        iconPath="/assets/pause.svg"
        altIconPath="/assets/play.svg"
        isActive={id === playlist.id && isPlaying}
        iconSize={16}
        isWhite={false}
        onClick={handleClick}
      />
      <div className="line-clamp-2 flex-col justify-between px-1 pt-2 text-white">
        {playlist.name}
      </div>
    </div>
  );
}
