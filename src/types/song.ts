type Song = {
  id: string;
  name: string;
  image: string[];
  url: string;
  duration: number;
  artists: { id: string; name: string }[];
  album?: { id: string; name: string };
  playCount?: number;
  lyrics?: { time: number; line: string }[];
  year?: string;
};
export default Song;

export const dummySong: Song = {
  id: "fusic",
  name: "Fusic",
  image: ["/logo.png", "/logo.png", "/logo.png"],
  url: "",
  artists: [{ id: "fusic", name: "Fusic" }],
  duration: 0,
};
