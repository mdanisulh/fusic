import Playlist from "@/types/playlist";
import { apiEndpoint } from "../constants/constants";
import { transformSong } from "./songs";

export async function searchPlaylists(query: string, limit = 10, page = 0) {
  const response = await fetch(
    `${apiEndpoint}/search/playlists?query=${query}&limit=${limit}&page=${page}`,
  );
  const data = await response.json();
  if (!data.data || !data.data.results) return [];
  const res: Omit<Playlist, "songs">[] = data.data.results.map(
    (playlist: {
      id: string;
      name: string;
      image: { url: string }[];
      songCount?: number;
    }) => ({
      id: playlist.id,
      name: playlist.name,
      image: playlist.image.map((img) => img.url),
      songCount: playlist.songCount,
    }),
  );
  return res;
}

export async function getPlaylist(
  id: string,
  limit: number = 100,
  page: number = 0,
) {
  const response = await fetch(
    `${apiEndpoint}/playlists?id=${id}&limit=${limit}&page=${page}`,
  );
  const data = await response.json();
  const playlist = data.data;
  if (!playlist) return null;
  const res: Playlist = {
    id: playlist.id,
    name: playlist.name.replace(/&quot;/g, '"'),
    image: playlist.image.map((img: { url: string }) => img.url),
    songs: playlist.songs.map((song: any) => transformSong(song)),
    artists: playlist.artists.map((artist: { id: string; name: string }) => ({
      id: artist.id,
      name: artist.name.replace(/&quot;/g, '"'),
    })),
    playCount: playlist.playCount,
    songCount: playlist.songCount,
    year: playlist.year,
    description: playlist.description,
  };
  return res;
}
