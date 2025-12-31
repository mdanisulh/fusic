"use client";
import { useAudio } from "@/lib/hooks/useAudio";
import { useCurrentTime } from "@/lib/hooks/useCurrentTime";
import { useQueue } from "@/lib/hooks/useQueue";
import formatTime from "@/lib/utils/formatTime";
import IconButton from "../common/IconButton";
import Slider from "../common/Slider";

export default function PlayerControls() {
  const { isPlaying, togglePlay, playNext, playPrevious, song } = useAudio()!;
  const { toggleShuffle, toggleRepeat, shuffle, repeat } = useQueue()!;
  const { currentTime, setTime } = useCurrentTime()!;
  return (
    <div className="grow flex-col">
      <div className="flex content-center justify-center">
        <IconButton
          iconPath="/assets/shuffle.svg"
          altIconPath="dot"
          iconSize={16}
          title="Shuffle"
          className="mx-2 p-2"
          isActive={shuffle}
          onClick={toggleShuffle}
        />
        <IconButton
          iconPath="/assets/play-previous.svg"
          iconSize={16}
          title="Previous"
          className="p-2"
          onClick={playPrevious}
        />
        <IconButton
          iconPath="/assets/pause.svg"
          altIconPath="/assets/play.svg"
          isActive={isPlaying}
          title="Play"
          className="mx-4 my-2 rounded-full bg-white p-2 hover:scale-105"
          iconSize={16}
          isWhite={false}
          onClick={togglePlay}
        />
        <IconButton
          iconPath="/assets/play-next.svg"
          iconSize={16}
          title="Next"
          className="p-2"
          onClick={() => playNext()}
        />
        <IconButton
          iconPath={
            repeat !== 2 ? "/assets/repeat.svg" : "/assets/repeat-one.svg"
          }
          altIconPath="dot"
          iconSize={16}
          title="Repeat"
          className="mx-2 p-2"
          isActive={repeat !== 0}
          onClick={toggleRepeat}
        />
      </div>
      <div className="flex grow p-2 pt-0">
        <div className="mr-2 flex w-10 justify-end text-xs text-light-grey">
          {formatTime(currentTime)}
        </div>
        <Slider
          range={song["duration"]}
          value={currentTime}
          onChange={setTime}
        />
        <div className="ml-2 flex w-10 text-xs text-light-grey">
          {formatTime(song["duration"])}
        </div>
      </div>
    </div>
  );
}
