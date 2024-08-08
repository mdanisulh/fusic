import PlaylistCard from "@/components/cards/PlaylistCard";
import { useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import AlbumCard from "../cards/AlbumCard";
import ArtistCard from "../cards/ArtistCard";
import IconButton from "../common/IconButton";

export default function Library() {
  const { playlists, albums, artists, createPlaylist } = useLibrary()!;
  const { isLSBCollapsed, setLSBCollapsed } = useUIConfig()!;
  const { handleContextMenu } = useContextMenu()!;
  const cardSize = isLSBCollapsed ? 56 : 150;
  return (
    <div className="mt-1 flex flex-grow flex-col overflow-y-hidden rounded-lg bg-light-black">
      <div className="flex justify-between px-2 py-0">
        <div className="flex-initial self-center">
          <IconButton
            iconPath="/assets/library-filled.svg"
            altIconPath="/assets/library-outlined.svg"
            title={`${isLSBCollapsed ? "Expand" : "Collapse"} Your Library`}
            text={isLSBCollapsed ? undefined : "Your Library"}
            className="m-2 p-2 font-bold"
            spacing={10}
            onClick={() => setLSBCollapsed(!isLSBCollapsed)}
          />
        </div>
        {!isLSBCollapsed && (
          <div className="flex-initial self-center">
            <IconButton
              iconPath="/assets/add.svg"
              title="Create Playlist"
              className="m-2 rounded-full p-2 font-bold hover:bg-dark-grey"
              iconSize={16}
              onClick={() =>
                createPlaylist({
                  id: crypto.randomUUID(),
                  name: `My Playlist #${Object.keys(playlists).length}`,
                  image: [],
                  songs: [],
                  artists: [],
                })
              }
            />
          </div>
        )}
      </div>
      <div
        className={`flex-grow overflow-hidden p-3 hover:overflow-y-scroll hover:pr-0`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
          alignItems: "start",
          alignContent: "start",
          rowGap: isLSBCollapsed ? "4px" : "0px",
        }}
        onContextMenu={(e) =>
          handleContextMenu(e, [
            {
              text: "Create Playlist",
              onClick: () =>
                createPlaylist({
                  id: crypto.randomUUID(),
                  name: `New Playlist #${Object.keys(playlists).length}`,
                  songs: [],
                  artists: [],
                  image: [],
                }),
              icon: "/assets/add.svg",
            },
          ])
        }
      >
        <div className={isLSBCollapsed ? "" : "translate-x-1"}>
          <PlaylistCard
            playlist={playlists["_liked"]}
            showOnlyImage={cardSize < 150}
          />
        </div>
        {Object.values(playlists).map((playlist) => {
          if (playlist.id === "_liked") return null;
          return (
            <div
              className={isLSBCollapsed ? "" : "translate-x-1"}
              key={playlist.id}
            >
              <PlaylistCard
                playlist={playlist}
                showOnlyImage={cardSize < 150}
              />
            </div>
          );
        })}
        {albums.map((album) => {
          return (
            <div
              className={isLSBCollapsed ? "" : "translate-x-1"}
              key={album.id}
            >
              <AlbumCard album={album} showOnlyImage={cardSize < 150} />
            </div>
          );
        })}
        {artists.map((artist) => {
          return (
            <div
              className={isLSBCollapsed ? "" : "translate-x-1"}
              key={artist.id}
            >
              <ArtistCard artist={artist} showOnlyImage={cardSize < 150} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
