"use client";
import AlbumCard from "@/components/cards/AlbumCard";
import ArtistCard from "@/components/cards/ArtistCard";
import PlaylistCard from "@/components/cards/PlaylistCard";
import SongCard from "@/components/cards/SongCard";
import { searchAlbums } from "@/lib/services/albums";
import { searchArtists } from "@/lib/services/artists";
import { searchPlaylists } from "@/lib/services/playlists";
import { searchSongs } from "@/lib/services/songs";
import Album from "@/types/album";
import Artist from "@/types/artist";
import Playlist from "@/types/playlist";
import Song from "@/types/song";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type searchResults = {
  // topQuery: Item | null;
  songs: Song[];
  artists: Omit<Artist, "songs">[];
  albums: Omit<Album, "songs">[];
  playlists: Omit<Playlist, "songs">[];
};

export default function Page() {
  const params = useSearchParams();
  const query = params.get("query")?.toString();
  const [searchResults, setSearchResults] = useState<searchResults | null>();
  useEffect(() => {
    async function fetchData(query: string) {
      const songs = await searchSongs(query, 5);
      const albums = await searchAlbums(query);
      const artists = await searchArtists(query);
      const playlists = await searchPlaylists(query);
      setSearchResults({
        songs: songs,
        albums: albums,
        playlists: playlists,
        artists: artists,
      });
    }
    if (query) {
      fetchData(query);
    } else {
      setSearchResults(null);
    }
  }, [query]);
  return (
    searchResults && (
      <div className="h-full">
        {searchResults.songs.length > 0 && (
          <div>
            <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
              Songs
            </div>
            <div className="flex-col pr-3 group-hover/a:pr-2">
              {searchResults.songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}
        {searchResults.artists.length > 0 && (
          <div>
            <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
              Artists
            </div>
            <div
              className="flex flex-row overflow-x-auto pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {searchResults.artists.map((artist) => (
                <div key={artist.id} className="min-w-48 max-w-48">
                  <ArtistCard artist={artist} />
                </div>
              ))}
            </div>
          </div>
        )}
        {searchResults.albums.length > 0 && (
          <div>
            <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
              Albums
            </div>
            <div
              className="flex flex-row overflow-x-auto pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {searchResults.albums.map((album) => (
                <div key={album.id} className="min-w-48 max-w-48">
                  <AlbumCard album={album} />
                </div>
              ))}
            </div>
          </div>
        )}
        {searchResults.playlists.length > 0 && (
          <div>
            <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
              Playlists
            </div>
            <div
              className="flex flex-row overflow-x-auto pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {searchResults.playlists.map((playlist) => (
                <div key={playlist.id} className="min-w-48 max-w-48">
                  <PlaylistCard playlist={playlist} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  );
}
