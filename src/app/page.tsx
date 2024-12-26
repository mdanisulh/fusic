"use client";
import ArtistCard from "@/components/cards/ArtistCard";
import PlaylistCard from "@/components/cards/PlaylistCard";
import SongCard from "@/components/cards/SongCard";
import Router from "@/components/common/Router";
import { useAudio } from "@/lib/hooks/useAudio";
import { useHistory } from "@/lib/hooks/useHistory";
import { getArtist } from "@/lib/services/artists";
import { getPlaylist } from "@/lib/services/playlists";
import { getSong } from "@/lib/services/songs";
import getAverageColor from "@/lib/utils/averageColor";
import Artist from "@/types/artist";
import Playlist from "@/types/playlist";
import Song from "@/types/song";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import IconButton from "../components/common/IconButton";

const trendingPlaylistIds = [
  "110858205",
  "1134548194",
  "1134543272",
  "1139074020",
  "946682072",
  "1223344164",
  "47599074",
  "902306817",
  "1210453303",
];
const recommendedPlaylistIds = [
  "58057412",
  "1219169738",
  "903166403",
  "1080335349",
  "101704478",
  "1164340768",
  "1079336813",
  "330056058",
  "1023629070",
  "1223482895",
  "158220028",
  "1077765822",
];
const recommendedArtistIds = [
  "459320",
  "455130",
  "455782",
  "881158",
  "4878402",
  "467309",
  "455109",
  "1350398",
  "7473760",
  "1546334",
  "468245",
  "464932",
  "485956",
  "610240",
  "578407",
  "455125",
];
export default function Home() {
  const { last100, getMostPlayedSongIds } = useHistory()!;
  const recentlyPlayed = last100.slice(0, 8);
  const [color, setColor] = useState("");
  const { song } = useAudio()!;
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [numColumns, setNumColumns] = useState(8);

  const [mostPlayedSongs, setMostPlayedSongs] = useState<Song[]>([]);
  const [trendingPlaylists, setTrendingPlaylists] = useState<Playlist[]>([]);
  const [recommendedArtists, setRecommendedArtists] = useState<Artist[]>([]);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<Playlist[]>(
    [],
  );

  useEffect(() => {
    Promise.all(
      trendingPlaylistIds.map(async (id) => {
        const playlist = await getPlaylist(id);
        return playlist;
      }),
    )
      .then((playlists) => {
        setTrendingPlaylists(
          playlists.filter((playlist) => playlist !== null) as Playlist[],
        );
      })
      .catch((error) => {
        console.error("Error fetching trending playlists:", error);
      });
    Promise.all(
      recommendedPlaylistIds.map(async (id) => {
        const playlist = await getPlaylist(id);
        return playlist;
      }),
    )
      .then((playlists) => {
        setRecommendedPlaylists(
          playlists.filter((playlist) => playlist !== null) as Playlist[],
        );
      })
      .catch((error) => {
        console.error("Error fetching recommended playlists:", error);
      });
    Promise.all(
      recommendedArtistIds.map(async (id) => {
        const artist = await getArtist(id);
        return artist;
      }),
    )
      .then((artists) => {
        setRecommendedArtists(
          artists.filter((artist) => artist !== null) as Artist[],
        );
      })
      .catch((error) => {
        console.error("Error fetching recommended artists:", error);
      });
  }, []);
  useEffect(() => {
    const mostPlayedSongIds = getMostPlayedSongIds(8);
    Promise.all(
      mostPlayedSongIds.map(async (id) => {
        const song = await getSong(id);
        return song;
      }),
    )
      .then((songs) => {
        setMostPlayedSongs(songs.filter((song) => song !== null) as Song[]);
      })
      .catch((error) => {
        console.error("Error fetching most played songs:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const calculateColumns = () => {
      if (gridRef.current && cardRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        const cardWidth = cardRef.current.offsetWidth;
        const maxColumns = Math.floor(gridWidth / cardWidth);
        const columns =
          recentlyPlayed.length - (recentlyPlayed.length % maxColumns);
        setNumColumns(columns);
      }
    };
    calculateColumns();
    const resizeObserver = new ResizeObserver(() => {
      calculateColumns();
    });
    const currentGridRef = gridRef.current;
    if (currentGridRef) {
      resizeObserver.observe(currentGridRef);
    }
    return () => {
      if (currentGridRef) {
        resizeObserver.unobserve(currentGridRef);
      }
    };
  }, [recentlyPlayed]);

  useEffect(() => {
    if (!song) return;
    let gradientImage = song.image[1];
    if (!gradientImage) return;
    getAverageColor(gradientImage).then((color) => {
      setColor(color);
    });
  }, [song]);

  return (
    <div
      className="relative h-full w-full overflow-y-scroll rounded-lg"
      ref={gridRef}
    >
      <header
        className="sticky top-0 z-20 flex rounded-t-lg"
        style={{
          backgroundColor: color,
          backgroundImage: `linear-gradient(rgba(18,18,18,0.1) 0, rgba(18,18,18,0.375) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
        }}
      >
        <div className="p-4 pr-0">
          <Router />
        </div>
      </header>
      <div className="absolute top-0 h-96 w-full">
        <div
          style={{
            backgroundColor: color,
            backgroundImage: `linear-gradient(rgba(18,18,18,0.25) 0, rgb(18,18,18) 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDov…sdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)`,
          }}
          className="h-full w-full"
        />
      </div>
      {recentlyPlayed.length > 0 && (
        <div className="relative px-4">
          <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
            Recently Played
          </div>
          <Link href="/history">
            <IconButton
              iconPath="/assets/next.svg"
              iconSize={16}
              className="absolute right-0 top-0 m-4 h-8 w-8 justify-center self-center rounded-full bg-dark-grey"
            />
          </Link>
          <div
            className="grid gap-4 py-4 pb-8"
            style={{
              scrollbarWidth: "none",
              gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
            }}
          >
            {recentlyPlayed.slice(0, numColumns).map((song, index) => (
              <div
                key={song.id}
                ref={index == 0 ? cardRef : null}
                className="w-full rounded-lg bg-white bg-opacity-10"
              >
                <SongCard song={song} />
              </div>
            ))}
          </div>
        </div>
      )}
      {mostPlayedSongs.length > 0 && (
        <div className="relative px-4">
          <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
            Most Played
          </div>
          <div
            className="grid gap-4 py-4 pb-8"
            style={{
              scrollbarWidth: "none",
              gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
            }}
          >
            {mostPlayedSongs.map((song) => (
              <div
                key={song.id}
                className="w-full rounded-lg bg-white bg-opacity-10"
              >
                <SongCard song={song} />
              </div>
            ))}
          </div>
        </div>
      )}
      {trendingPlaylists.length > 0 && (
        <div className="relative px-4">
          <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
            Trending Playlists
          </div>
          <div
            className="flex flex-row overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {trendingPlaylists.map((playlist) => (
              <div key={playlist.id} className="min-w-48 max-w-48">
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
          </div>
        </div>
      )}
      {recommendedArtists.length > 0 && (
        <div className="relative px-4">
          <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
            Recommended Artists
          </div>
          <div
            className="flex flex-row overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {recommendedArtists.map((artist) => (
              <div key={artist.id} className="min-w-48 max-w-48">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>
        </div>
      )}
      {recommendedPlaylists.length > 0 && (
        <div className="relative px-4">
          <div className="cursor-text p-2 pt-4 text-2xl font-bold text-white">
            Recommended Playlists
          </div>
          <div
            className="flex flex-row overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {recommendedPlaylists.map((playlist) => (
              <div key={playlist.id} className="min-w-48 max-w-48">
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
