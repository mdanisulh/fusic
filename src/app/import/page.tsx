"use client";
import IconButton from "@/components/common/IconButton";
import ScrollableDiv from "@/components/common/ScrollableDiv";
import { useAudio } from "@/lib/hooks/useAudio";
import { useLibrary } from "@/lib/hooks/useLibraryProvider";
import { idbDel, idbGet } from "@/lib/services/idb";
import { getSong, searchSongs } from "@/lib/services/songs";
import Playlist from "@/types/playlist";
import Song from "@/types/song";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

function getbgColor(a: string, b: string): string {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length] > 3 ? "rgb(128,0,0)" : "rgb(0,128,0)";
}

export default function ImportPlaylist() {
  const { setSong, isPlaying, song: currentSong, togglePlay } = useAudio()!;
  const { createPlaylist } = useLibrary()!;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [songResults, setSongResults] = useState<Song[][]>([]);
  const [songQueries, setSongQueries] = useState<string[][] | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean[] | null>(null);
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = useDebouncedCallback(async (query: string) => {
    if (query) {
      const songs = await searchSongs(query);
      setSearchResults(songs);
    } else {
      setSearchResults([]);
    }
  }, 800);
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };
  const handleCheckboxChange = (song: Song) => {
    setSelectedSongs((prevSelectedSongs) => {
      const newSelectedSongs = new Set(prevSelectedSongs);
      if (newSelectedSongs.has(song.id)) {
        newSelectedSongs.delete(song.id);
      } else {
        newSelectedSongs.add(song.id);
      }
      return newSelectedSongs;
    });
    if (
      songResults.every(
        (result) => result[0] === undefined || result[0].id !== song.id,
      )
    ) {
      setSongResults((prevSongResults) => [...prevSongResults, [song]]);
    }
  };
  const handleCancel = () => {
    idbDel("importPlaylist");
    router.replace("/");
  };
  const handleImport = () => {
    const songs: Song[] = [];
    const addedSongIds: Set<string> = new Set();
    songResults.forEach((result) => {
      const song = result[0];
      if (song && selectedSongs.has(song.id) && !addedSongIds.has(song.id)) {
        songs.push(song);
        addedSongIds.add(song.id);
      }
    });
    const playlist: Playlist = {
      id: crypto.randomUUID(),
      name,
      songs,
      image: [],
      artists: [],
    };
    createPlaylist(playlist);
    idbDel("importPlaylist");
    router.replace(`/playlist/${playlist.id}`);
  };

  useEffect(() => {
    idbGet("importPlaylist").then(async (data) => {
      setName(data.name);
      if (data.songIds !== undefined) {
        setSelectedSongs(new Set(data.songIds));
        for (const songId of data.songIds) {
          const song = await getSong(songId);
          if (!song) continue;
          setSongResults((prevSongResults) => [...prevSongResults, [song]]);
        }
      } else {
        setSongQueries(data.songs);
        setIsExpanded(new Array(data.songs.length).fill(false));
        for (const query of data.songs) {
          const songs = await searchSongs(`${query[0]} ${query[1]}`, 5);
          if (songs.length > 0) {
            setSelectedSongs((prev) => prev.add(songs[0].id));
          }
          setSongResults((prevSongResults) => [...prevSongResults, songs]);
        }
      }
    });
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SongCard = (songs: Song[], index?: number): JSX.Element => {
    const song = songs[0];
    const query =
      index !== undefined && songQueries ? songQueries[index] : null;
    return (
      <>
        <div
          key={song?.id ?? crypto.randomUUID()}
          className="flex w-full rounded-lg p-2 pl-1 hover:bg-dark-grey"
        >
          {song && (
            <input
              type="checkbox"
              checked={song && selectedSongs.has(song.id)}
              onChange={() => song && handleCheckboxChange(song)}
              className="mr-2 flex-shrink-0"
              style={{ accentColor: "#8020f0" }}
            />
          )}
          {!song && (
            <div className="w-5 flex-shrink-0 text-end text-sm text-light-grey"></div>
          )}
          <div
            className="group relative mr-2 flex-shrink-0"
            style={{ width: "44px", height: "44px" }}
            onClick={() => {
              song && song.id === currentSong.id ? togglePlay() : setSong(song);
            }}
          >
            {song && (
              <>
                <Image
                  src={song["image"][1]}
                  alt={song["name"]}
                  title={song["name"]}
                  width={48}
                  height={48}
                  className="rounded-md group-hover:opacity-50"
                  style={{ objectFit: "fill" }}
                  priority={true}
                />
                <Image
                  src={
                    isPlaying && song.id === currentSong.id
                      ? "/assets/play.svg"
                      : "/assets/pause.svg"
                  }
                  alt="Overlay"
                  width={16}
                  height={16}
                  className="absolute left-4 top-4 rounded-md opacity-0 invert group-hover:opacity-100"
                  style={{ objectFit: "cover" }}
                />
              </>
            )}
          </div>
          <div
            className="py-auto flex flex-grow flex-col truncate rounded-lg px-1.5 text-sm text-white"
            style={{
              backgroundColor: query
                ? getbgColor(query[0], song?.name ?? "")
                : "",
            }}
          >
            {query && (
              <ScrollableDiv className="my-auto text-base">
                {query[0]}
              </ScrollableDiv>
            )}
            <ScrollableDiv className="my-auto">{song?.name}</ScrollableDiv>
          </div>
          <div
            className="py-auto ml-3 flex w-[25%] flex-shrink-0 flex-col truncate rounded-lg px-1.5 text-sm text-light-grey"
            style={{
              backgroundColor: query
                ? getbgColor(
                    query[1]
                      .split(", ")
                      .map((artist: string) => artist.trim().toLowerCase())
                      .sort()
                      .join(", "),
                    song?.artists
                      .map((artist) => artist.name.toLowerCase())
                      .sort()
                      .join(", ") ?? "",
                  )
                : "",
            }}
          >
            {query && (
              <ScrollableDiv className="my-auto text-base">
                {query[1]}
              </ScrollableDiv>
            )}
            <ScrollableDiv className="my-auto">
              {song?.artists.reduce((acc: string[], artist, index) => {
                acc.push(artist.name);
                if (index < song.artists.length - 1) {
                  acc.push(", ");
                }
                return acc;
              }, [])}
            </ScrollableDiv>
          </div>
          <div
            className="py-auto ml-3 flex w-[25%] flex-shrink-0 flex-col truncate rounded-lg px-1.5 text-sm text-light-grey"
            style={{
              backgroundColor: query
                ? getbgColor(query[2], song?.album?.name ?? "")
                : "",
            }}
          >
            {query && (
              <ScrollableDiv className="my-auto text-base">
                {query[2]}
              </ScrollableDiv>
            )}
            <ScrollableDiv className="my-auto">
              {song?.album?.name}
            </ScrollableDiv>
          </div>
          {index !== undefined && (
            <IconButton
              iconPath="/assets/next.svg"
              iconSize={16}
              className={`${songs.length > 1 ? "" : "cursor-not-allowed"} mx-2 flex-shrink-0 ${isExpanded && index != undefined && isExpanded[index] ? "-rotate-90" : "rotate-90"}`}
              isWhite
              onClick={() =>
                songs.length > 1 &&
                setIsExpanded((prev) => {
                  if (!prev) return null;
                  return prev.map((value, i) => (i === index ? !value : value));
                })
              }
            />
          )}
        </div>
        {index !== undefined && isExpanded && isExpanded[index] && (
          <div className="mx-5">
            {songs.map((song, index) =>
              index ? <div key={index}>{SongCard([song])}</div> : null,
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="relative h-full w-full overflow-y-scroll px-3 text-white">
      <header
        className="sticky top-0 z-10 flex bg-light-black py-3"
        ref={searchRef}
      >
        <div
          className="flex h-10 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-red-600 text-center text-white"
          onClick={handleCancel}
        >
          Cancel
        </div>
        <div className="relative mx-3 h-10 flex-grow">
          <input
            className="peer h-full w-full rounded-lg bg-dark-grey pl-9 text-sm text-white focus:outline-none focus:outline-offset-0 focus:outline-white"
            style={{ paddingRight: searchQuery ? "36px" : "20px" }}
            placeholder="Search for songs, albums, artists, and more"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            value={searchQuery}
            onFocus={() => ((window as any).isInputFocused = true)}
            onBlur={() => ((window as any).isInputFocused = false)}
          />
          <IconButton
            iconPath="/assets/search-outlined.svg"
            iconSize={16}
            className="peer-focus:white absolute left-3 top-3"
          />
          <IconButton
            iconPath="/assets/close.svg"
            iconSize={16}
            className={`peer-focus:white absolute right-3 top-3 ${searchQuery ? "" : "hidden"}`}
            onClick={clearSearch}
          />
        </div>
        <div
          className="flex h-10 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary text-center text-white"
          onClick={handleImport}
        >
          Import
        </div>
      </header>
      <div className="relative w-full">
        <div
          className="sticky top-16 z-20 max-h-60 w-full overflow-y-auto rounded-lg bg-dark-grey shadow-lg shadow-light-black"
          ref={resultsRef}
        >
          {isFocused && searchResults.length > 0 && (
            <div className="p-2">
              {searchResults.map((song) => SongCard([song]))}
            </div>
          )}
        </div>
        <div className="m-2 flex">
          <input
            className="peer h-8 w-full rounded-lg bg-dark-grey px-4 text-sm text-white focus:outline-none focus:outline-offset-0 focus:outline-white"
            placeholder="Enter playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => ((window as any).isInputFocused = true)}
            onBlur={() => ((window as any).isInputFocused = false)}
          />
          <div className="mx-4 flex-shrink-0">
            {selectedSongs.size} songs selected
          </div>
        </div>
        {songResults.length > 0 &&
          songResults.map((song, index) => (
            <div
              key={index}
              className="flex w-full rounded-lg hover:bg-dark-grey"
            >
              <div className="m-auto ml-2 w-8 flex-shrink-0 text-end text-sm text-light-grey">
                {index + 1}
              </div>
              <div className="flex-grow overflow-hidden">
                {songQueries && songQueries[index] && SongCard(song, index)}
                {!(songQueries && songQueries[index]) && SongCard(song)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
