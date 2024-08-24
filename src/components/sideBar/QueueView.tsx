"use client";
import { useAudio } from "@/lib/hooks/useAudio";
import { useQueue } from "@/lib/hooks/useQueue";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import QueueCard from "../cards/QueueCard";
import IconButton from "../common/IconButton";

export default function QueueView() {
  const { setRSBView } = useUIConfig()!;
  const { isPlaying, setSong, togglePlay, song } = useAudio()!;
  const {
    setCurrentIndex,
    shuffleIndices,
    removeFromExtraQueue,
    addToExtraQueue,
    extraQueue,
    queue,
    currentIndex,
    clearQueue,
  } = useQueue()!;

  const upcoming = shuffleIndices.slice(currentIndex + 1);
  return (
    <div className="flex h-full flex-col rounded-lg bg-light-black">
      <div className="sticky top-0 flex justify-between">
        <p className="my-1 p-4 font-bold text-white">Queue</p>
        <IconButton
          iconPath="/assets/close.svg"
          title="Close"
          className="m-4 rounded-full p-2 font-bold hover:bg-dark-grey"
          iconSize={16}
          onClick={() => setRSBView("none")}
        />
      </div>
      <div className="flex-grow overflow-y-hidden scroll-smooth pl-1 pr-3 hover:overflow-y-scroll hover:pr-2">
        <div className="mb-0 p-2 pr-0">
          <p className="mt-1 p-2 font-bold text-white">Now playing</p>
          <QueueCard
            key={crypto.randomUUID()}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            setCurrentIndex={setCurrentIndex}
            removeFromExtraQueue={removeFromExtraQueue}
            shuffleIndices={shuffleIndices}
            setSong={setSong}
            addToExtraQueue={addToExtraQueue}
            song={song}
            index={shuffleIndices[currentIndex]}
            isNowPlaying={true}
          />
        </div>
        {extraQueue.length !== 0 && (
          <div className="mb-0 p-2 pr-0">
            <div className="mt-1 flex justify-between p-2">
              <p className="font-bold text-white">Next in queue</p>
              <p
                className="self-center pr-1 text-sm font-bold text-light-grey hover:pr-0 hover:text-[15px] hover:text-white"
                onClick={clearQueue}
              >
                Clear Queue
              </p>
            </div>
            {extraQueue.map((song, index) => (
              <QueueCard
                key={crypto.randomUUID()}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                setCurrentIndex={setCurrentIndex}
                removeFromExtraQueue={removeFromExtraQueue}
                shuffleIndices={shuffleIndices}
                setSong={setSong}
                addToExtraQueue={addToExtraQueue}
                song={song}
                index={shuffleIndices[currentIndex]}
                isNowPlaying={false}
                isInQueue={index}
              />
            ))}
          </div>
        )}
        {upcoming.length > 0 && (
          <div className="mb-0 p-2 pr-0">
            <p className="mt-1 p-2 font-bold text-white">Next up</p>
            {upcoming.map((index) => (
              <QueueCard
                key={crypto.randomUUID()}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                setCurrentIndex={setCurrentIndex}
                removeFromExtraQueue={removeFromExtraQueue}
                shuffleIndices={shuffleIndices}
                setSong={setSong}
                addToExtraQueue={addToExtraQueue}
                song={queue[index]}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
