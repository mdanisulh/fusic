import Artist from "@/types/artist";
import Song from "@/types/song";
import { apiEndpoint } from "../constants/constants";
import { transformAlbum } from "./albums";
import { transformSong } from "./songs";

export async function searchArtists(query: string, limit = 10, page = 0) {
  const response = await fetch(
    `${apiEndpoint}/search/artists?query=${query}&limit=${limit}&page=${page}`,
  );
  const data = await response.json();
  const artists: Omit<Artist, "songs">[] = data.data.results.map(
    (artist: { id: string; name: string; image: { url: string }[] }) => ({
      id: artist.id,
      name: artist.name,
      image: artist.image.map((img) => img.url),
    }),
  );
  return artists;
}

export async function getArtistSongs(
  id: string,
  page: number = 0,
): Promise<Song[]> {
  const response = await fetch(
    `${apiEndpoint}/artists/${id}/songs?page=${page}`,
  );
  const data = await response.json();
  const songs = data.data.songs;
  return songs.map(transformSong);
}

export async function getArtist(
  id: string,
  page: number = 0,
  songCount: number = 10,
  albumCount: number = 10,
): Promise<Artist | null> {
  const response = await fetch(
    `${apiEndpoint}/artists/${id}?page=${page}&songCount=${songCount}&albumCount=${albumCount}&sortBy=popularity&sortOrder=desc`,
  );
  const data = await response.json();
  const artist = data.data;
  if (!artist) return null;
  return {
    id: artist.id,
    name: artist.name.replace(/&quot;/g, '"'),
    image: artist.image.map((img: { url: string }) => img.url),
    songs: artist.topSongs.map(transformSong),
    albums: artist.topAlbums.map(transformAlbum),
    fanCount: artist.fanCount,
  };
}
