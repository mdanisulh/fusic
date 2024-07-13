import Album from "./album";
import Song from "./song";

type Artist = {
  id: string;
  name: string;
  image: string[];
  songs: Song[];
  albums: Album[];
  singles?: Song[];
  fanCount?: number;
};
export default Artist;
