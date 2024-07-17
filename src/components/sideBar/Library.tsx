import PlaylistCard from "@/components/cards/PlaylistCard";
import { usePlaylist } from "@/lib/hooks/usePlaylistProvider";
import { useUIConfig } from "@/lib/hooks/useUIConfig";

export default function Library() {
  const { playlists } = usePlaylist()!;
  const { isLSBCollapsed } = useUIConfig()!;
  const cardSize = isLSBCollapsed ? 56 : 150;
  return (
    <div
      className={`flex-grow overflow-hidden p-3 hover:overflow-y-scroll hover:pr-0`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
        alignItems: "start",
        alignContent: "start",
        rowGap: isLSBCollapsed ? "4px" : "0px",
      }}
    >
      {Object.values(playlists).map((playlist) => {
        return (
          <div
            className={isLSBCollapsed ? "" : "translate-x-1"}
            key={playlist.id}
          >
            <PlaylistCard playlist={playlist} showOnlyImage={cardSize < 150} />
          </div>
        );
      })}
    </div>
  );
}
