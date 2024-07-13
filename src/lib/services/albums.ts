import Album from "@/types/album";
import { apiEndpoint } from "../constants/constants";
import { transformSong } from "./songs";

export async function searchAlbums(query: string, limit = 10, page = 0) {
  const response = await fetch(
    `${apiEndpoint}/search/albums?query=${query}&limit=${limit}&page=${page}`,
  );
  const data = await response.json();
  const albums: Omit<Album, "songs">[] = data.data.results.map(transformAlbum);
  return albums;
}

export const transformAlbum = (album: any): Album => ({
  id: album.id,
  name: album.name.replace(/&quot;/g, '"'),
  image: album.image.map((img: { url: string }) => img.url),
  songs: album.songs && album.songs.map((song: any) => transformSong(song)),
  artists: album.artists.primary.map(
    (artist: { id: string; name: string }) => ({
      id: artist.id,
      name: artist.name.replace(/&quot;/g, '"'),
    }),
  ),
  playCount: album.playCount,
  songCount: album.songCount,
  year: album.year,
  description: album.description,
  language: album.language,
});

export async function getAlbum(id: string) {
  const response = await fetch(`${apiEndpoint}/albums?id=${id}`);
  const data = await response.json();
  return transformAlbum(data.data);
}
