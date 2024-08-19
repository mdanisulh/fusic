"use client";
import { useAudio } from "@/lib/hooks/useAudio";
import { useCurrentTime } from "@/lib/hooks/useCurrentTime";
import getAverageColor from "@/lib/utils/averageColor";
import { useCallback, useEffect, useMemo, useState } from "react";

const transliterate = async (input: string) => {
  const response = await fetch("/api/transliterate", {
    method: "POST",
    body: JSON.stringify({ input }),
  });
  return await response.json();
};

export default function LyricsPage() {
  const { song, setLyrics } = useAudio()!;
  const { currentTime, setTime } = useCurrentTime()!;
  const [color, setColor] = useState("");
  const lyrics = useMemo(() => song.lyrics ?? [], [song.lyrics]);

  const fetchLyrics = useCallback(
    async (toTransliterate: boolean = false) => {
      const res = await fetch(
        "https://lrclib.net/api/get?" +
          new URLSearchParams({
            artist_name: song.artists[0].name,
            album_name: song.album?.name ?? song.name,
            track_name: song.name,
            duration: song.duration.toString(),
          }),
      );
      if (res.ok) {
        const data = await res.json();
        if (data.syncedLyrics) {
          if (toTransliterate)
            data.syncedLyrics = await transliterate(data.syncedLyrics);
          const lyricsLines = data.syncedLyrics.split("\n");
          const syncedLyrics = lyricsLines.map((line: string) => {
            const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\] (.*)/);
            if (match) {
              const minutes = parseInt(match[1]);
              const seconds = parseInt(match[2]);
              const milliseconds = parseInt(match[3]);
              const line = match[4];
              return {
                time: minutes * 60 + seconds + milliseconds / 1000,
                line,
              };
            }
          });
          if (toTransliterate) {
            syncedLyrics.pop();
            syncedLyrics.unshift({ time: -1, line: "" });
          }
          setLyrics(syncedLyrics);
        } else if (data.plainLyrics) {
          if (toTransliterate)
            data.plainLyrics = await transliterate(data.plainLyrics);
          const plainLyrics = data.plainLyrics
            .split("\n")
            .map((line: string) => {
              return { time: 0, line: line };
            });
          if (toTransliterate) {
            plainLyrics.pop();
            plainLyrics.unshift({ time: -1, line: "" });
          }
          setLyrics(plainLyrics);
        } else if (song.id) {
          setLyrics([
            { time: 0, line: "Sorry, no lyrics found for this song" },
          ]);
        }
      } else if (song.id) {
        setLyrics([{ time: 0, line: "Sorry, no lyrics found for this song" }]);
      }
    },
    [setLyrics, song],
  );

  useEffect(() => {
    if (!song.lyrics) {
      fetchLyrics();
    }
    getAverageColor(
      document.querySelector(".current-song-img")! as HTMLImageElement,
    ).then((color) => {
      setColor(color);
    });
  }, [song, setLyrics, fetchLyrics]);

  useEffect(() => {
    if (lyrics.length === 0 || lyrics[lyrics.length - 1].time === 0) return;
    const currentLineIndex = lyrics.findIndex(
      (item, index) =>
        currentTime >= item.time &&
        currentTime < (lyrics[index + 1]?.time || Infinity),
    );
    if (currentLineIndex !== -1) {
      const element = document.getElementById(`line-${currentLineIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, lyrics]);

  return (
    <div className="relative h-full text-center text-white">
      <div
        className="h-full overflow-y-hidden scroll-smooth rounded-lg bg-scroll p-16 hover:overflow-y-scroll hover:pr-[52px]"
        style={{ backgroundColor: color }}
      >
        <div className="inline-flex flex-col items-center text-4xl font-bold leading-snug">
          {lyrics.map((item: { time: number; line: string }, index: number) => (
            <p
              key={`line-${index}`}
              id={`line-${index}`}
              onClick={() =>
                lyrics[lyrics.length - 1].time !== 0 && setTime(item.time)
              }
              className={
                "cursor-pointer " +
                (currentTime >= item.time &&
                currentTime < (lyrics[index + 1]?.time || Infinity)
                  ? ""
                  : currentTime < item.time
                    ? "text-black opacity-60"
                    : "text-white opacity-50")
              }
            >
              {item.line}
            </p>
          ))}
        </div>
      </div>
      {lyrics.length > 1 && (
        <div
          title="Transliterate"
          className="absolute bottom-4 right-6 h-8 w-8 cursor-pointer rounded-lg border-2 border-white text-xl font-black leading-7 opacity-70 hover:opacity-100"
          style={
            lyrics[0].time === -1 // Checking if lyrics are transliterated
              ? {
                  backgroundColor: "white",
                  color: color,
                  opacity: 1,
                  cursor: "not-allowed",
                }
              : {}
          }
          onClick={() => lyrics[0].time !== -1 && fetchLyrics(true)}
        >
          T
        </div>
      )}
    </div>
  );
}
