import { useAudio } from "@/lib/hooks/useAudio";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
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
  const { id, addToExtraQueue } = useQueue()!;
  const { isPlaying, togglePlay, setQueue } = useAudio()!;
  const { isPlaylistInLibrary, createPlaylist, deletePlaylist } = useLibrary()!;
  const { handleContextMenu } = useContextMenu()!;

  const handleClick = async () => {
    if (id === playlist.id) return togglePlay();
    if ("songs" in playlist) return setQueue(playlist.songs, playlist.id);
    const songList = await getPlaylist(playlist.id);
    setQueue(songList.songs, playlist.id);
  };
  const menuList: MenuItem[] = [
    {
      icon: "/assets/add-queue.svg",
      text: "Add to Queue",
      onClick: () => {
        if ("songs" in playlist && playlist.songs)
          playlist.songs.map((song) => addToExtraQueue(song));
        else
          getPlaylist(playlist.id).then((playlist) =>
            playlist.songs.map((song) => addToExtraQueue(song)),
          );
      },
    },
    isPlaylistInLibrary(playlist.id)
      ? {
          icon: "/assets/delete.svg",
          text: "Remove from Library",
          onClick: () => deletePlaylist(playlist.id),
        }
      : {
          icon: "/assets/add.svg",
          text: "Add to Library",
          onClick: () => {
            if ("songs" in playlist && playlist.songs)
              return createPlaylist(playlist);
            getPlaylist(playlist.id).then((playlist) =>
              createPlaylist(playlist),
            );
          },
        },
  ];
  if (playlist.id === "_liked") {
    menuList.pop();
  }
  return (
    <div className="max-w-[400px]">
      <div
        className="group flex-1 -translate-x-1 cursor-pointer flex-row rounded-lg p-[7%] hover:bg-dark-grey"
        onContextMenu={(e) => {
          e.stopPropagation();
          handleContextMenu(e, menuList);
        }}
      >
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
          <>
            <div className="truncate text-white">{playlist.name}</div>
            <div className="truncate text-sm text-light-grey">
              <span>Playlist</span>
              {"songs" in playlist && (
                <>
                  <span className="text-lg font-black"> · </span>
                  <span>{`${playlist.songs.length} songs`}</span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
