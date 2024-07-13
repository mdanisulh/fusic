import { apiEndpoint } from "../constants/constants";

export async function globalSearch(query: string) {
  const response = await fetch(`${apiEndpoint}/search?query=${query}`);
  const data = await response.json();
  const topQuery = data.data.topQuery.results[0];
  const songs = data.data.songs.results;
  const artists = data.data.artists.results;
  const albums = data.data.albums.results;
  const playlists = data.data.playlists.results;
  const res: {
    topQuery: Item | null;
    songs: Item[];
    artists: Item[];
    albums: Item[];
    playlists: Item[];
  } = {
    topQuery: topQuery
      ? {
          id: topQuery.id,
          name: topQuery.title,
          image: topQuery.image[1].url,
          type: topQuery.type,
        }
      : null,
    songs: songs.map(
      (song: {
        id: string;
        title: string;
        primaryArtists: string;
        image: { url: string }[];
      }) => ({
        id: song.id,
        name: song.title,
        image: song.image[1].url,
        artist: song.primaryArtists,
      }),
    ),
    artists: artists.map(
      (artist: { id: string; title: string; image: { url: string }[] }) => ({
        id: artist.id,
        name: artist.title,
        image: artist.image[1].url,
      }),
    ),
    albums: albums.map(
      (album: {
        id: string;
        title: string;
        image: { url: string }[];
        artist: string;
        year?: number;
      }) => ({
        id: album.id,
        name: album.title,
        image: album.image[1].url,
        artist: album.artist,
        year: album.year,
      }),
    ),
    playlists: playlists.map(
      (playlist: { id: string; title: string; image: { url: string }[] }) => ({
        id: playlist.id,
        name: playlist.title,
        image: playlist.image[1].url,
      }),
    ),
  };
  return res;
}
