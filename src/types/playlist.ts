import Song from "./song";

type Playlist = {
  id: string;
  name: string;
  image: string[];
  songs: Song[];
  artists: { id: string; name: string }[];
  songCount?: number;
  playCount?: number;
  description?: string;
  year?: number;
};
export default Playlist;
