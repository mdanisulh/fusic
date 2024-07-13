"use client";
import { useAudio } from "@/lib/hooks/useAudio";
import { useCurrentTime } from "@/lib/hooks/useCurrentTime";
import getAverageColor from "@/lib/utils/averageColor";
import { useEffect, useMemo, useState } from "react";

export default function LyricsPage() {
  const { song, setLyrics } = useAudio()!;
  const { currentTime, setTime } = useCurrentTime()!;
  const [color, setColor] = useState("");
  const lyrics = useMemo(() => song.lyrics ?? [], [song.lyrics]);

  useEffect(() => {
    async function fetchLyrics() {
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
          setLyrics(syncedLyrics);
        } else if (data.plainLyrics) {
          const newLyrics = data.plainLyrics.split("\n").map((line: string) => {
            return { time: 0, line: line };
          });
          setLyrics(newLyrics);
        } else {
          setLyrics([
            { time: 0, line: "Sorry, no lyrics found for this song" },
          ]);
        }
      } else {
        setLyrics([{ time: 0, line: "Sorry, no lyrics found for this song" }]);
      }
    }
    if (!song.lyrics) {
      fetchLyrics();
    }
    getAverageColor(document.querySelector(".abc")!).then((res: string) => {
      setColor(res);
    });
  }, [song, setLyrics]);

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
    <div
      className="overflow-y-hidden scroll-smooth rounded-lg bg-scroll px-24 py-16 text-center text-white hover:overflow-y-scroll hover:pr-[84px]"
      style={{ height: "calc(100vh - 96px)", backgroundColor: color }}
    >
      <div className="text-2xl font-bold leading-10">
        {lyrics.map((item: { time: number; line: string }, index: number) => (
          <p
            key={`line-${index}`}
            id={`line-${index}`}
            onClick={() =>
              lyrics[lyrics.length - 1].time !== 0 && setTime(item.time)
            }
            className={`${currentTime >= item.time && currentTime < (lyrics[index + 1]?.time || Infinity) ? "text-[27px] opacity-100" : "opacity-50"}`}
          >
            {item.line}
          </p>
        ))}
      </div>
    </div>
  );
}
