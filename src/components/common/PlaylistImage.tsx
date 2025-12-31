import Playlist from "@/types/playlist";
import Image from "next/image";

export default function PlaylistImage({
  playlist,
}: {
  playlist: Omit<Playlist, "songs"> | Playlist;
}) {
  if (playlist.image.length > 0)
    return (
      <Image
        width={152}
        height={152}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
        }}
        src={playlist.image[1]}
        className="rounded-lg"
        priority={true}
        alt=""
      />
    );
  if (
    playlist.image.length === 0 &&
    "songs" in playlist &&
    playlist.songs.length > 0 &&
    playlist.songs.length < 4
  )
    return (
      <Image
        width={150}
        height={150}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
        }}
        src={playlist.songs[0].image[1]}
        className="rounded-lg"
        priority={true}
        alt=""
      />
    );
  if (
    playlist.image.length === 0 &&
    "songs" in playlist &&
    playlist.songs.length >= 4
  )
    return (
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0">
        <div className="relative w-full pt-[100%]">
          <Image
            src={playlist.songs[0].image[1]}
            className="absolute top-0 left-0 h-full w-full rounded-tl-lg object-cover"
            layout="fill"
            style={{ objectFit: "cover" }}
            priority={true}
            alt=""
          />
        </div>
        <div className="relative w-full pt-[100%]">
          <Image
            src={playlist.songs[1].image[1]}
            className="absolute top-0 left-0 h-full w-full rounded-tr-lg object-cover"
            layout="fill"
            style={{ objectFit: "cover" }}
            priority={true}
            alt=""
          />
        </div>
        <div className="relative w-full pt-[100%]">
          <Image
            src={playlist.songs[2].image[1]}
            className="absolute top-0 left-0 h-full w-full rounded-bl-lg object-cover"
            layout="fill"
            style={{ objectFit: "cover" }}
            priority={true}
            alt=""
          />
        </div>
        <div className="relative w-full pt-[100%]">
          <Image
            src={playlist.songs[3].image[1]}
            className="absolute top-0 left-0 h-full w-full rounded-br-lg object-cover"
            layout="fill"
            style={{ objectFit: "cover" }}
            priority={true}
            alt=""
          />
        </div>
      </div>
    );
  return (
    <div className="rounded-lg bg-grey">
      <Image
        width={150}
        height={150}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
        }}
        src="/assets/fallback.svg"
        className="rounded-lg p-[20%] invert"
        priority={true}
        alt=""
      />
    </div>
  );
}
