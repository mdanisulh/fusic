import Song from "./song";

type Album = {
  id: string;
  name: string;
  image: string[];
  songs: Song[];
  artists: { id: string; name: string }[];
  songCount?: number;
  playCount?: number;
  description: string;
  language: string;
  year?: number;
};
export default Album;
