import PlaylistCard from "@/components/cards/PlaylistCard";
import { MenuItem, useContextMenu } from "@/lib/hooks/useContextMenu";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import { idbSet } from "@/lib/services/idb";
import { useRouter } from "next/navigation";
import AlbumCard from "../cards/AlbumCard";
import ArtistCard from "../cards/ArtistCard";
import IconButton from "../common/IconButton";

export default function Library() {
  const { playlists, albums, artists, createPlaylist } = useLibrary()!;
  const { isLSBCollapsed, setLSBCollapsed } = useUIConfig()!;
  const { handleContextMenu } = useContextMenu()!;
  const router = useRouter();
  const menuList: MenuItem[] = [
    {
      text: "Create New Playlist",
      onClick: () =>
        createPlaylist({
          id: crypto.randomUUID(),
          name: `New Playlist #${Object.keys(playlists).length}`,
          songs: [],
          artists: [],
          image: [],
        }),
    },
    {
      text: "Import Playlist",
      onClick: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".fusic";
        input.onchange = async (e) => {
          try {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const fileExtension = file.name.split(".").pop();
            if (!fileExtension) return;
            const data = await file.text();
            idbSet("importPlaylist", JSON.parse(data));
            router.push("/import");
          } catch (e) {
            console.error(e);
          }
        };
        input.click();
      },
    },
  ];
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
            isActive={isLSBCollapsed}
          />
        </div>
        {!isLSBCollapsed && (
          <div className="flex-initial self-center">
            <IconButton
              iconPath="/assets/add.svg"
              title="Create Playlist"
              className="m-2 rounded-full p-2 font-bold hover:bg-dark-grey"
              iconSize={16}
              onClick={(e) => handleContextMenu(e, menuList)}
            />
          </div>
        )}
      </div>
      <div
        className={`flex-grow overflow-hidden p-2 hover:overflow-y-scroll hover:pr-1`}
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
        <PlaylistCard
          playlist={playlists["_liked"]}
          showOnlyImage={cardSize < 150}
        />
        {Object.values(playlists).map((playlist) => {
          if (playlist.id === "_liked") return null;
          return (
            <PlaylistCard
              playlist={playlist}
              showOnlyImage={cardSize < 150}
              key={playlist.id}
            />
          );
        })}
        {Object.values(albums).map((album) => {
          return (
            <AlbumCard
              album={album}
              showOnlyImage={cardSize < 150}
              key={album.id}
            />
          );
        })}
        {Object.values(artists).map((artist) => {
          return (
            <ArtistCard
              artist={artist}
              showOnlyImage={cardSize < 150}
              key={artist.id}
            />
          );
        })}
      </div>
    </div>
  );
}
