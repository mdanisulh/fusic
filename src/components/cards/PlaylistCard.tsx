import { useAudio } from "@/lib/hooks/useAudio";
import { useQueue } from "@/lib/hooks/useQueue";
import { getPlaylist } from "@/lib/services/playlists";
import Playlist from "@/types/playlist";
import IconButton from "../common/IconButton";
import PlaylistImage from "../common/PlaylistImage";

export default function PlaylistCard({
  playlist,
  showOnlyImage = false,
}: {
  playlist: Omit<Playlist, "songs"> | Playlist;
  showOnlyImage?: boolean;
}) {
  const { id } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;

  const handleClick = async () => {
    if (id === playlist.id) return togglePlay();
    if ("songs" in playlist) return setQueue(playlist.songs, playlist.id);
    const songList = await getPlaylist(playlist.id);
    setQueue(songList.songs, playlist.id);
  };

  return (
    <div className="group max-w-[400px] flex-1 -translate-x-1 cursor-pointer flex-row rounded-lg p-[7%] hover:bg-dark-grey">
      <div className="relative">
        <PlaylistImage playlist={playlist} />
        {!showOnlyImage && (
          <IconButton
            className="absolute bottom-[5%] right-[5%] h-12 w-12 justify-center rounded-full bg-primary opacity-0 group-hover:opacity-100"
            iconPath="/assets/pause.svg"
            altIconPath="/assets/play.svg"
            isActive={id === playlist.id && isPlaying}
            iconSize={20}
            isWhite={false}
            onClick={handleClick}
          />
        )}
      </div>
      {!showOnlyImage && (
        <div className="line-clamp-2 flex-col justify-between px-1 pt-2 text-white">
          {playlist.name}
        </div>
      )}
    </div>
  );
}
