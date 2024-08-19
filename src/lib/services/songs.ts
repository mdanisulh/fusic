import Song from "@/types/song";
import { apiEndpoint } from "../constants/constants";

const downloadQuality = 2; // 0 - 4

export async function searchSongs(
  query: string,
  limit: number = 10,
  page: number = 0,
) {
  const response = await fetch(
    `${apiEndpoint}/search/songs?query=${query}&limit=${limit}&page=${page}`,
  );
  const data = await response.json();
  const songs: Song[] = data.data.results.map(
    (song: {
      id: string;
      name: string;
      image: { url: string }[];
      downloadUrl: { url: string }[];
      duration?: number;
      artists: { primary: { id: string; name: string }[] };
      album?: { id: string; name: string };
      year?: string;
      playCount?: number;
    }) => transformSong(song),
  );
  return songs;
}

export const getSong = async (id: string) => {
  const response = await fetch(`${apiEndpoint}/songs/${id}`);
  const data = await response.json();
  return transformSong(data.data);
};

export const getSongSuggestions = async (
  id: string,
  limit: number = 10,
): Promise<Song[]> => {
  const response = await fetch(
    `${apiEndpoint}/songs/${id}/suggestions?limit=${limit}`,
  );
  const data = await response.json();
  return data.data ? data.data.map(transformSong) : [];
};

export const transformSong = (song: {
  id: string;
  name: string;
  image: { url: string }[];
  downloadUrl: { url: string }[];
  duration?: number;
  artists: { primary: { id: string; name: string }[] };
  album?: { id: string; name: string };
  year?: string;
  playCount?: number;
}): Song => ({
  id: song.id,
  name: song.name.replace(/&quot;/g, '"'),
  image: song.image.map((img) => img.url),
  url:
    song.downloadUrl[downloadQuality] && song.downloadUrl[downloadQuality].url,
  duration: song.duration ?? 0,
  artists: song.artists.primary.map((artist) => ({
    id: artist.id,
    name: artist.name.replace(/&quot;/g, '"'),
  })),
  album: song.album && {
    id: song.album.id,
    name: song.album.name && song.album.name.replace(/&quot;/g, '"'),
  },
  playCount: song.playCount,
  year: song.year,
});
